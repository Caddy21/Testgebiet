// ==UserScript==
// @name         [LSS] Sprechwunsch Sortierer
// @namespace    https://www.leitstellenspiel.de/
// @version      1.0
// @description  Sortiert Sprechwünsche nach Fahrzeugtypen
// @author       Caddy21
// @match        https://www.leitstellenspiel.de/
// @icon         https://github.com/Caddy21/-docs-assets-css/raw/main/yoshi_icon__by_josecapes_dgqbro3-fullview.png
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// ==/UserScript==

(function () {
    'use strict';

    // Benutzerdefinierte Prioritäten (IDs in gewünschter Reihenfolge)
    const PRIORITY_ORDER = [31, 28, 32]; // RTH, RTW, FuStW, dann alle anderen
    // Fahrzeugdaten aus der API
    let vehicleData = {};
    // Flag für Button-Hinzufügung
    let buttonAdded = false;

    // Funktion zum Abrufen der Fahrzeugdaten aus dem GM-Speicher
    function getStoredVehicleData() {
        const storedData = GM_getValue('vehicleData', null);
        const timestamp = GM_getValue('vehicleDataTimestamp', 0);
        const currentTime = Date.now();

        // Wenn Daten vorhanden sind und noch nicht älter als 24 Stunden
        if (storedData && (currentTime - timestamp < 24 * 60 * 60 * 1000)) {
            console.info('Fahrzeugdaten aus dem Speicher geladen.');
            return storedData;
        }

        return null;
    }

    // Fahrzeugdaten aus der API laden und im GM-Speicher speichern
    function fetchVehicleData() {
        console.info('Fahrzeugdaten werden aus der API geladen...');

        GM_xmlhttpRequest({
            method: "GET",
            url: 'https://www.leitstellenspiel.de/api/vehicles',
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);

                    vehicleData = data.reduce((acc, vehicle) => {
                        acc[vehicle.id] = vehicle.vehicle_type; // Speichert Fahrzeug-ID und Typ
                        return acc;
                    }, {});

                    // Speichern der Fahrzeugdaten und Timestamp (damit wir sie später aktualisieren können)
                    GM_setValue('vehicleData', vehicleData);
                    GM_setValue('vehicleDataTimestamp', Date.now());

                    console.info('Fahrzeugdaten erfolgreich aus der API geladen und im Speicher gespeichert.');
                } catch (error) {
                    console.error('Fehler beim Verarbeiten der API-Daten:', error);
                }
            },
            onerror: function() {
                console.error('Fehler bei der API-Anfrage');
            }
        });
    }

    // Initialisierung
    async function init() {
        try {
            console.info('Skript initialisiert.');
            addButton(); // Button hinzufügen ohne API-Daten
        } catch (error) {
            console.error('Fehler bei der Initialisierung:', error);
        }
    }

    // Wiederholtes Laden sicherstellen, falls das DOM asynchron manipuliert wird
    let attempts = 0;
    const maxAttempts = 1;

    // Observer-Variable und Status-Flag
    let observerPaused = false;
    const observer = new MutationObserver(() => {
        if (observerPaused) return; // Wenn pausiert, nichts tun
        attempts++;
        console.info(`DOM-Änderung erkannt, Versuch #${attempts}`);
        try {
            if (attempts <= maxAttempts) {
                init();
            } else {
                observer.disconnect(); // Deaktiviert den Observer nach maxAttempts
                console.info('MutationObserver deaktiviert nach maximalen Versuchen.');
            }
        } catch (error) {
            console.error('Fehler beim erneuten Ausführen des Skripts:', error);
        }
    });

    // Funktion zum Pausieren des Observers
    function pauseObserver() {
        observer.disconnect();
        observerPaused = true;
        console.info('MutationObserver pausiert.');
    }

    // Funktion zum Wiederaktivieren des Haupt-Observers und des Lightbox-Observers
    function resumeObserver() {
        console.log("🔍 Haupt-Observer wird wieder aktiviert.");
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Startet die Beobachtung auf Lightbox-Elemente
        observeForLightboxes();
    }

    // Button zum Sortieren hinzufügen
    function addButton() {
        if (buttonAdded) return;

        try {
            console.info('Versuche, den Button hinzuzufügen...');

            const funkDiv = document.querySelector('.flex-grow-1');

            if (funkDiv) {
                console.info('Funk-Div gefunden:', funkDiv);

                const button = document.createElement('button');
                button.textContent = 'Sprechwünsche sortieren';
                button.className = 'btn btn-xs btn-primary';
                button.style.marginLeft = '10px';
                button.style.cursor = 'pointer';

                button.addEventListener('click', async () => {
                    vehicleData = getStoredVehicleData() || {};
                    if (Object.keys(vehicleData).length === 0) {
                        await fetchVehicleData();
                    }
                    sortSprechwünsche();

                    // Wiederaktivieren des Haupt-Observers und des Lightbox-Observers
                    resumeObserver(); // Observer wird wieder aktiviert
                });

                funkDiv.appendChild(button);
                buttonAdded = true;
                console.info('Button wurde neben dem "Funk"-Element hinzugefügt.');

                // Observer pausieren, nachdem der Button hinzugefügt wurde
                pauseObserver();
            } else {
                console.error('Kein "Funk"-Element gefunden.');
            }
        } catch (error) {
            console.error('Fehler beim Hinzufügen des Buttons:', error);
        }
    }

    observer.observe(document.body, { childList: true, subtree: true });

    console.info('Tampermonkey-Skript wird geladen...');

    // Extrahiert die Fahrzeug-ID aus einem Sprechwunsch-Element
    function getVehicleIdFromElement(element) {
        try {
            // Sucht nach der Fahrzeug-ID im Klassennamen
            const className = element.className;
            const match = className.match(/vehicle_(\d+)/); // Sucht nach "vehicle_" gefolgt von einer Zahl

            if (match) {
                return parseInt(match[1], 10); // Gibt die Fahrzeug-ID zurück
            } else {
                console.warn('Keine Fahrzeug-ID im Klassennamen gefunden:', className);
                return -1;
            }
        } catch (error) {
            console.error('Fehler beim Extrahieren der Fahrzeug-ID:', error);
            return -1;
        }
    }

    // Funktion zum Sortieren der Sprechwünsche
    function sortSprechwünsche() {
        try {
            console.info('Sortierfunktion wurde aufgerufen.');
            const listContainer = document.querySelector('#radio_messages_important');
            if (!listContainer) {
                console.error('Sprechwunsch-Container (#radio_messages_important) nicht gefunden.');
                return;
            }

            console.info('Sprechwunsch-Container gefunden:', listContainer);

            // Sprechwünsche sammeln
            const items = Array.from(listContainer.children);

            // Vorher die Reihenfolge in der Konsole ausgeben
            console.log('Vor der Sortierung:');
            console.log(items.map(item => getVehicleIdFromElement(item)));

            // Sprechwünsche sortieren
            items.sort((a, b) => {
                const aVehicleId = getVehicleIdFromElement(a);
                const bVehicleId = getVehicleIdFromElement(b);

                // Priorität nach den IDs bestimmen
                const aPriority = PRIORITY_ORDER.indexOf(vehicleData[aVehicleId] || -1);
                const bPriority = PRIORITY_ORDER.indexOf(vehicleData[bVehicleId] || -1);

                // Unbekannte Fahrzeuge ans Ende
                return (aPriority === -1 ? Infinity : aPriority) - (bPriority === -1 ? Infinity : bPriority);
            });

            // Nach der Sortierung die Reihenfolge in der Konsole ausgeben
            console.log('Nach der Sortierung:');
            console.log(items.map(item => getVehicleIdFromElement(item)));

            // Sortierte Elemente zurück in den Container einfügen
            items.forEach(item => listContainer.appendChild(item));

            console.info('Sprechwünsche wurden erfolgreich sortiert.');

            // Die sortierte Reihenfolge im sessionStorage speichern
            const sortedIds = items.map(item => getVehicleIdFromElement(item));
            sessionStorage.setItem('sortedSprechwünsche', JSON.stringify(sortedIds));

        } catch (error) {
            console.error('Fehler in der Sortierfunktion:', error);
        }
    }

    // Funktion zum Abrufen der sortierten Liste aus dem sessionStorage
    function getSortedSprechwünsche() {
        const sortedData = sessionStorage.getItem('sortedSprechwünsche');
        if (sortedData) {
            return JSON.parse(sortedData); // Gibt die sortierte Reihenfolge der IDs zurück
        } else {
            console.warn('Keine sortierten Sprechwünsche im sessionStorage gefunden.');
            return [];
        }
    }


    // Funktion zum Überprüfen der iframes auf den Button
    function checkIframeForButton() {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            try {
                // Sicherstellen, dass wir auf den Inhalt des iframe zugreifen können (Cross-Origin verhindern)
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

                if (iframeDoc) {
                    const button = iframeDoc.querySelector('#next-vehicle-fms-5');
                    if (button) {
                        console.info('Button #next-vehicle-fms-5 gefunden in einem iframe.');
                        // Hier kannst du die gewünschte Aktion ausführen, z. B. den Button klicken oder darauf warten
                    }
                }
            } catch (error) {
                console.error('Fehler beim Überprüfen des iframe-Inhalts:', error);
            }
        });
    }

    // Funktion zum Überwachen des DOMs und Durchsuchen von iframes
    function observeIframeChanges() {
        const iframeObserver = new MutationObserver(() => {
            console.log('Mutation innerhalb der iframes erkannt.');

            // Überprüfe alle iframes auf den Button
            checkIframeForButton();
        });

        // Beobachte das gesamte Body-Element, um alle Änderungen zu erkennen, einschließlich der Lightbox
        document.querySelectorAll('iframe').forEach(iframe => {
            iframeObserver.observe(iframe.contentDocument || iframe.contentWindow.document, {
                childList: true,
                subtree: true
            });
        });
    }

    // Funktion zum Überprüfen des Button in einem iframe
    function debugAlertNextButtonInIframe() {
        const iframes = document.querySelectorAll('iframe');
        let foundButton = false;

        iframes.forEach(iframe => {
            try {
                // Sicherstellen, dass der Inhalt des iframe zugänglich ist
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                if (iframeDoc) {
                    const button = iframeDoc.querySelector('#next-vehicle-fms-5');
                    if (button) {
                        console.info('Button #next-vehicle-fms-5 gefunden in einem iframe.');
                        foundButton = true;
                        // Hier könntest du die gewünschte Aktion auf dem Button ausführen (z.B. Klick)
                    }
                }
            } catch (error) {
                console.error('Fehler beim Überprüfen des iframe-Inhalts:', error);
            }
        });

        return foundButton;
    }

    // Funktion zum Beobachten des DOMs auf neue Lightbox-Elemente
    function observeForLightboxes() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.id.startsWith('lightbox_iframe_')) {
                            console.log(`🟢 Neuer iFrame mit id ${node.id} erkannt! Überprüfe Buttons...`);

                            // Wiederholt die Überprüfung alle 1 Sekunde, bis der Button gefunden wird
                            const intervalId = setInterval(() => {
                                if (debugAlertNextButtonInIframe()) {
                                    clearInterval(intervalId); // Stoppt die Schleife, wenn der Button gefunden wurde
                                }
                            }, 1000); // 1 Sekunde
                        }
                    });
                }
            });
        });

        // Beobachtet das gesamte DOM auf Hinzufügungen von Lightbox-Elementen
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('MutationObserver auf Lightbox-Elemente aktiviert.');
    }

})();
