// ==UserScript==
// @name         Erweitertes Einsatzfenster
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Alarmierung und Anzeige von Einsätzen im Leitstellenspiel
// @author       Caddy21
// @match        https://www.leitstellenspiel.de/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    let vehicleData = []; // Gespeicherte Fahrzeugdaten
    let vehicleOffset = 0;
    let activeAAOButton = null;
    let buildingMap = {};

    const vehicleLimit = 250;
    const aaosUrl = 'https://www.leitstellenspiel.de/api/v1/aaos';
    const einsatzUrl = 'https://www.leitstellenspiel.de/einsaetze.json';

    const style = document.createElement('style');
    style.textContent = `
.einsatz-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.einsatz-modal-content {
    background: white;
    border-radius: 10px;
    padding: 20px;
    width: 80%;
    max-width: 800px;
    max-height: 80%;
    overflow-y: auto;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.aao-active {
    background-color: #ffc107;
    border-color: #ffa000;
    color: black;
}
`;
    document.head.appendChild(style);



    async function fetchData() {
        try {
            const aaosResponse = await fetch(aaosUrl);
            const aaosData = await aaosResponse.json();
            GM_setValue('aaosData', JSON.stringify(aaosData));

            const einsatzResponse = await fetch(einsatzUrl);
            const einsatzData = await einsatzResponse.json();
            GM_setValue('einsatzData', JSON.stringify(einsatzData));
        } catch (error) {
            console.error('Fehler beim Abrufen der Daten:', error);
        }
    }

    fetchData();
    setInterval(fetchData, 24 * 60 * 60 * 1000);

    function parseMissionsFromDOM() {
        const missionElements = document.querySelectorAll('.missionSideBarEntry');
        const missionList = [];

        missionElements.forEach(el => {
            const id = el.getAttribute('mission_id');
            const nameEl = el.querySelector(`#mission_caption_${id}`);
            const name = nameEl ? nameEl.childNodes[0].textContent.trim().replace(/,\s*$/, '') : 'Unbekannt';

            const addressEl = el.querySelector(`#mission_address_${id}`);
            const address = addressEl ? addressEl.textContent.trim() : 'Unbekannt';

            const panel = el.querySelector(`#mission_panel_${id}`);
            let status = 'Unbekannt';
            if (panel.classList.contains('mission_panel_red')) status = 'Offen';
            else if (panel.classList.contains('mission_panel_yellow')) status = 'In Bearbeitung';
            else if (panel.classList.contains('mission_panel_green')) status = 'Abgeschlossen';

            missionList.push({ id, name, address, status });
        });

        return missionList;
    }

    function monitorMissions() {
        const currentMissionList = parseMissionsFromDOM();
        const lastMissionList = JSON.parse(GM_getValue('lastMissionList', '[]'));

        if (JSON.stringify(lastMissionList) !== JSON.stringify(currentMissionList)) {
            GM_setValue('lastMissionList', JSON.stringify(currentMissionList));
            updateMissionTable(currentMissionList);
        }
    }

    function createModal() {
        const modalHtml = `
    <div id="einsatzModal" class="modal" style="display: none; position: fixed; top: 10%; left: 10%; width: 80%; height: 80%; background-color: white; z-index: 9999; overflow: auto; border: 2px solid #444; padding: 10px; border-radius: 10px;">
        <div class="modal-content">
            <h4 style="display:flex; justify-content: space-between; align-items: center;">
                Einsätze
                <button id="closeModalBtn" class="btn btn-danger btn-sm">Schließen</button>
            </h4>
            <input type="text" id="einsatzSearch" class="form-control" placeholder="🔍 Suche nach Einsatz oder AAO..." style="margin-bottom: 10px;">
            <div id="aaoList" style="margin-bottom: 10px; display: flex; flex-wrap: wrap; gap: 8px;"></div>
            <button id="resetAAOButton" class="btn btn-warning btn-sm" style="margin-top: 10px;">AAO Zurücksetzen</button>
            <table id="einsatzTable" class="table table-striped">
                <thead>
                    <tr>
                        <th>Einsatzname</th>
                        <th>Adresse</th>
                        <th>Status</th>
                        <th>Aktionen</th>
                    </tr>
                </thead>
                <tbody id="missionTableBody">
                </tbody>
            </table>

            <hr>
            <h5>🚒 Eigene Fahrzeuge</h5>
            <div id="vehicleListContainer" class="list-group" style="max-height: 300px; overflow-y: auto;"></div>
            <button id="loadMoreVehiclesBtn" class="btn btn-secondary btn-sm" style="margin-top: 10px;">Weitere Fahrzeuge laden</button>
        </div>
    </div>
    `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        document.getElementById('closeModalBtn').addEventListener('click', closeModal);
        document.getElementById('einsatzSearch').addEventListener('input', handleSearch);
        document.getElementById('resetAAOButton').addEventListener('click', resetAAOSelection);
    }

    function resetAAOSelection() {
        const aaoButtons = document.querySelectorAll('#aaoList button');
        aaoButtons.forEach(button => button.classList.remove('aao-active'));
        activeAAOButton = null;
    }

    function handleSearch() {
        const query = document.getElementById('einsatzSearch').value.toLowerCase();
        const allMissions = parseMissionsFromDOM();
        const filteredMissions = allMissions.filter(m =>
                                                    m.name.toLowerCase().includes(query) ||
                                                    m.address.toLowerCase().includes(query)
                                                   );
        updateMissionTable(filteredMissions);

        const aaoButtons = document.querySelectorAll('#aaoList button');
        aaoButtons.forEach(button => {
            const text = button.textContent.toLowerCase();
            button.style.display = query === '' || text.includes(query) ? 'inline-block' : 'none';
        });
    }

    function getStatusClass(status) {
        switch(status) {
            case 'Alamieren': return 'status-alamieren';
            case 'Auf Anfahrt': return 'status-anfahrt';
            case 'Wird bearbeitet': return 'status-bearbeitung';
            default: return 'status-unbekannt';
        }
    }

    function renderAAOs(aaosData) {
        const container = document.getElementById('aaoList');
        container.innerHTML = '';
        if (!aaosData || aaosData.length === 0) {
            container.textContent = 'Keine AAOs gefunden';
            return;
        }

        aaosData.forEach(aao => {
            const btn = document.createElement('button');
            btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
            btn.textContent = aao.caption;
            btn._aao = aao;
            btn.addEventListener('click', function() {
                handleAAOButtonClick(btn);
            });
            container.appendChild(btn);
        });
    }

    function handleAAOButtonClick(buttonElement) {
        if (activeAAOButton) {
            activeAAOButton.classList.remove('aao-active');
        }
        activeAAOButton = buttonElement;
        buttonElement.classList.add('aao-active');
    }

    function updateMissionTable(missionList) {
        const tbody = document.getElementById('missionTableBody');
        tbody.innerHTML = '';
        missionList.forEach(mission => {
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.textContent = mission.name;
            row.appendChild(nameCell);

            const addressCell = document.createElement('td');
            addressCell.textContent = mission.address;
            row.appendChild(addressCell);

            const statusCell = document.createElement('td');
            statusCell.textContent = mission.status;
            statusCell.classList.add(getStatusClass(mission.status));
            row.appendChild(statusCell);

            const actionCell = document.createElement('td');
            const buttonContainer = document.createElement('div');

            const anfahrenButton = document.createElement('button');
            anfahrenButton.classList.add('btn', 'btn-success');
            anfahrenButton.textContent = 'Anfahren';
            buttonContainer.appendChild(anfahrenButton);

            const zufahrenButton = document.createElement('button');
            zufahrenButton.classList.add('btn', 'btn-primary');
            zufahrenButton.textContent = 'Zufahren';
            buttonContainer.appendChild(zufahrenButton);

            actionCell.appendChild(buttonContainer);
            row.appendChild(actionCell);

            tbody.appendChild(row);
        });
    }

    function openModal() {
        document.getElementById('einsatzModal').style.display = 'block';
    }

    function closeModal() {
        const modal = document.getElementById('einsatzModal');
        if (modal) {
            modal.style.display = 'none';
            const input = document.getElementById('einsatzSearch');
            if (input) input.value = '';
            const aaoButtons = document.querySelectorAll('#aaoList button');
            aaoButtons.forEach(button => button.style.display = 'inline-block');
            const allMissions = parseMissionsFromDOM();
            updateMissionTable(allMissions);
        }
    }

    function setupEvents() {
        const btn = document.getElementById(config.buttonId);
        if (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                openModal();
            });
        }
    }

    const config = {
        buttonId: 'expandButton',
    };

    function init() {
        const navContainer = document.querySelector('#missions') || document.querySelector('.navbar-nav');
        if (navContainer && !document.getElementById(config.buttonId)) {
            navContainer.insertAdjacentHTML('beforeend', `
            <a href="#" id="${config.buttonId}" class="btn btn-success" style="margin-left:10px;">
                🚨 Erweiterte Einsätze
            </a>
        `);
            setupEvents();
        } else {
            setTimeout(init, 1000);
        }
    }

    function loadVehicles() {
        fetch(`https://www.leitstellenspiel.de/api/vehicles?limit=${vehicleLimit}&offset=${vehicleOffset}`)
            .then(response => response.json())
            .then(data => {
            vehicleData = vehicleData.concat(data);
            displayVehicles(data);
            vehicleOffset += data.length;

            // Button ausblenden, wenn keine weiteren vorhanden sind
            if (data.length < vehicleLimit) {
                document.getElementById("loadMoreVehiclesBtn").style.display = "none";
            }
        })
            .catch(error => {
            console.error("Fehler beim Laden der Fahrzeuge:", error);
            alert("Fehler beim Laden der Fahrzeuge: " + error.message);
        });
    }


    function displayVehicles(vehicles) {
    const container = document.getElementById("vehicleListContainer");
    if (!container) return;

    vehicles.forEach(vehicle => {
        const vehicleDiv = document.createElement("div");
        vehicleDiv.className = "list-group-item";
        vehicleDiv.style.display = "flex";
        vehicleDiv.style.alignItems = "center";
        vehicleDiv.style.gap = "10px";

        vehicleDiv.innerHTML = `
            <input type="checkbox" id="vehicle-${vehicle.id}" data-id="${vehicle.id}" />
            <label for="vehicle-${vehicle.id}" style="margin: 0;">
                ${vehicle.caption}
            </label>
        `;

        container.appendChild(vehicleDiv);
    });
}

   function renderVehicles(vehicles) {
    const vehicleList = document.getElementById("vehicleListContainer");
    vehicleList.innerHTML = ""; // Vorherige Inhalte löschen

    vehicles.forEach(vehicle => {
        const vehicleRow = document.createElement("div");
        vehicleRow.style.display = "flex";
        vehicleRow.style.alignItems = "center";
        vehicleRow.style.marginBottom = "5px";
        vehicleRow.style.gap = "10px";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.setAttribute("data-id", vehicle.id);

        const nameLabel = document.createElement("span");
        nameLabel.textContent = vehicle.caption;

        const buildingLabel = document.createElement("span");
        buildingLabel.style.fontStyle = "italic";
        buildingLabel.style.color = "#555";
        buildingLabel.textContent = buildingMap[vehicle.building_id] || "Unbekanntes Gebäude";

        vehicleRow.appendChild(checkbox);
        vehicleRow.appendChild(nameLabel);
        vehicleRow.appendChild(buildingLabel);
        vehicleList.appendChild(vehicleRow);
    });
}

    // Button-Click Handler
    function setupLoadMoreVehicles() {
        const btn = document.getElementById('loadMoreVehiclesBtn');
        btn.addEventListener('click', () => displayVehicles());
    }

    function loadBuildingsAndVehicles() {
    fetch("https://www.leitstellenspiel.de/api/buildings")
        .then(response => response.json())
        .then(buildings => {
            // Gebäude nach ID ablegen
            buildings.forEach(b => buildingMap[b.id] = b.caption);
            return fetch("https://www.leitstellenspiel.de/api/vehicles");
        })
        .then(response => response.json())
        .then(vehicles => {
            renderVehicles(vehicles);
        })
        .catch(error => {
            console.error("Fehler beim Laden der Daten:", error);
        });
}

    createModal();
    const initialMissions = parseMissionsFromDOM();
    const storedAAOs = JSON.parse(GM_getValue('aaosData', '[]'));
    renderAAOs(storedAAOs);
    updateMissionTable(initialMissions);
    loadVehicles();
    setupLoadMoreVehicles();
    init();

})();
