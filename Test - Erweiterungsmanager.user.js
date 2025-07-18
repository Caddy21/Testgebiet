// ==UserScript==
// @name         [LSS] 02 - Erweiterungs-Manager
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Listet Wachen auf, bei denen Erweiterungen fehlen und ermöglicht das hinzufügen dieser Erweiterungen.
// @author       Caddy21
// @match        https://www.leitstellenspiel.de/
// @grant        GM_xmlhttpRequest
// @connect      api.lss-manager.de
// @connect      leitstellenspiel.de
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         https://github.com/Caddy21/-docs-assets-css/raw/main/yoshi_icon__by_josecapes_dgqbro3-fullview.png
// @run-at       document-end
// ==/UserScript==

// To-Do
// Lagererweiterungen einbauen

(function() {
    'use strict';
    // Manuelle Konfiguration der Erweiterungen

    // Hier könnt Ihr auswählen welche Erweiterung in der Tabelle angezeigt werden soll, dafür die nicht benötigten einfach mit // ausklammern.
    const manualExtensions = {
        '0_normal': [ // Feuerwache (normal)
            { id: 0, name: 'Rettungsdienst', cost: 100000, coins: 20 },
            { id: 1, name: '1te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 2, name: '2te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 3, name: '3te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 4, name: '4te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 5, name: '5te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 6, name: 'Wasserrettung', cost: 400000, coins: 25 },
            { id: 7, name: '6te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 8, name: 'Flughafenfeuerwehr', cost: 300000, coins: 25 },
            { id: 9, name: 'Großwache', cost: 1000000, coins: 50 },
            { id: 10, name: '7te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 11, name: '8te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 12, name: '9te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 13, name: 'Werkfeuerwehr', cost: 100000, coins: 20 },
            { id: 14, name: 'Netzersatzanlage 50', cost: 100000, coins: 20 },
            { id: 15, name: 'Netzersatzanlage 200', cost: 100000, coins: 20 },
            { id: 16, name: 'Großlüfter', cost: 75000, coins: 15 },
            { id: 17, name: '10te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 18, name: 'Drohneneinheit', cost: 150000, coins: 25 },
            { id: 19, name: 'Verpflegungsdienst', cost: 200000, coins: 25 },
            { id: 20, name: '1te Anhänger Stellplatz', cost: 75000, coins: 15 },
            { id: 21, name: '2te Anhänger Stellplatz', cost: 75000, coins: 15 },
            { id: 22, name: '3te Anhänger Stellplatz', cost: 75000, coins: 15 },
            { id: 23, name: '4te Anhänger Stellplatz', cost: 75000, coins: 15 },
            { id: 24, name: '5te Anhänger Stellplatz', cost: 75000, coins: 15 },
            { id: 25, name: 'Bahnrettung', cost: 125000, coins: 25 },
            { id: 26, name: '11te Ab-Stellplatz', cost: 150000, coins: 20 },
            { id: 27, name: '12te Ab-Stellplatz', cost: 150000, coins: 20 },
        ],

        '1_normal': [ // Feuerwehrschule
            { id: 0, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },
            { id: 1, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },
            { id: 2, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },
        ],

        '2_normal': [ // Rettungswache
            { id: 0, name: 'Großwache', cost: 1000000, coins: 50 },
        ],

        '3_normal': [ // Rettungsschule
            { id: 0, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },
            { id: 1, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },
            { id: 2, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },
        ],

        '4_normal': [ // Krankenhaus
            { id: 0, name: 'Allgemeine Innere', cost: 10000, coins: 10 },
            { id: 1, name: 'Allgemeine Chirugie', cost: 10000, coins: 10 },
            { id: 2, name: 'Gynäkologie', cost: 70000, coins: 15 },
            { id: 3, name: 'Urologie', cost: 70000, coins: 15 },
            { id: 4, name: 'Unfallchirugie', cost: 70000, coins: 15 },
            { id: 5, name: 'Neurologie', cost: 70000, coins: 15 },
            { id: 6, name: 'Neurochirugie', cost: 70000, coins: 15 },
            { id: 7, name: 'Kardiologie', cost: 70000, coins: 15 },
            { id: 8, name: 'Kardiochirugie', cost: 70000, coins: 15 },
            { id: 9, name: 'Großkrankenhaus', cost: 200000, coins: 50 },
        ],

        '5_normal': [ // Rettungshubschrauber-Station
            { id: 0, name: 'Windenrettung', cost: 200000, coins: 15 },
        ],

        '6_normal': [ // Polizeiwache
            { id: 0, name: '1te Zelle', cost: 25000, coins: 5 },
            { id: 1, name: '2te Zelle', cost: 25000, coins: 5 },
            { id: 2, name: '3te Zelle', cost: 25000, coins: 5 },
            { id: 3, name: '4te Zelle', cost: 25000, coins: 5 },
            { id: 4, name: '5te Zelle', cost: 25000, coins: 5 },
            { id: 5, name: '6te Zelle', cost: 25000, coins: 5 },
            { id: 6, name: '7te Zelle', cost: 25000, coins: 5 },
            { id: 7, name: '8te Zelle', cost: 25000, coins: 5 },
            { id: 8, name: '9te Zelle', cost: 25000, coins: 5 },
            { id: 9, name: '10te Zelle', cost: 25000, coins: 5 },
            { id: 10, name: 'Diensthundestaffel', cost: 100000, coins: 10 },
            { id: 11, name: 'Kriminalpolizei', cost: 100000, coins: 20 },
            { id: 12, name: 'Dienstgruppenleitung', cost: 200000, coins: 25 },
            { id: 13, name: 'Motorradstaffel', cost: 75000, coins: 15 },
            { id: 14, name: 'Großwache', cost: 1000000, coins: 50 },
            { id: 15, name: 'Großgewahrsam', cost: 200000, coins: 50 },
        ],

        '8_normal': [ // Polizeischule
            { id: 0, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },
            { id: 1, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },
            { id: 2, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },
        ],

        '9_normal': [ // THW
            { id: 0, name: '1. Technischer Zug: Fachgruppe Bergung/Notinstandsetzung', cost: 25000, coins: 5 },
            { id: 1, name: '1. Technischer Zug: Zugtrupp', cost: 25000, coins: 5 },
            { id: 2, name: 'Fachgruppe Räumen', cost: 25000, coins: 5 },
            { id: 3, name: 'Fachgruppe Wassergefahren', cost: 500000, coins: 15 },
            { id: 4, name: '2. Technischer Zug - Bergungsgruppe', cost: 25000, coins: 5 },
            { id: 5, name: '2. Technischer Zug: Fachgruppe Bergung/Notinstandsetzung', cost: 25000, coins: 5 },
            { id: 6, name: '2. Technischer Zug: Zugtrupp', cost: 25000, coins: 5 },
            { id: 7, name: 'Fachgruppe Ortung', cost: 450000, coins: 25 },
            { id: 8, name: 'Fachgruppe Wasserschaden/Pumpen', cost: 200000, coins: 25 },
            { id: 9, name: 'Fachruppe Schwere Bergung', cost: 200000, coins: 25 },
            { id: 10, name: 'Fachgruppe Elektroversorgung', cost: 200000, coins: 25 },
            { id: 11, name: 'Ortsverband-Mannschaftstransportwagen', cost: 50000, coins: 15 },
            { id: 12, name: 'Trupp Unbenannte Luftfahrtsysteme', cost: 50000, coins: 15 },
            { id: 13, name: 'Fachzug Führung und Kommunikation', cost: 300000, coins: 25 },
        ],

        '10_normal': [ // THW-Bundesschule
            { id: 0, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },
            { id: 1, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },
            { id: 2, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },
        ],

        '11_normal': [ // Bereitschaftspolizei
            { id: 0, name: '2. Zug der 1. Hundertschaft', cost: 25000, coins: 5 },
            { id: 1, name: '3. Zug der 1. Hundertschaft', cost: 25000, coins: 5 },
            { id: 2, name: 'Sonderfahrzeug: Gefangenenkraftwagen', cost: 25000, coins: 5 },
            { id: 3, name: 'Technischer Zug: Wasserwerfer', cost: 25000, coins: 5 },
            { id: 4, name: 'SEK: 1. Zug', cost: 100000, coins: 10 },
            { id: 5, name: 'SEK: 2. Zug', cost: 100000, coins: 10 },
            { id: 6, name: 'MEK: 1. Zug', cost: 100000, coins: 10 },
            { id: 7, name: 'MEK: 2. Zug', cost: 100000, coins: 10 },
            { id: 8, name: 'Diensthundestaffel', cost: 100000, coins: 10 },
            { id: 9, name: 'Reiterstaffel', cost: 300000, coins: 25},
            { id: 10, name: 'Lautsprecherkraftwagen', cost: 100000, coins: 10},
        ],

        '12_normal': [ // SEG
            { id: 0, name: 'Führung', cost: 25000, coins: 5 },
            { id: 1, name: 'Sanitätsdienst', cost: 25500, coins: 5 },
            { id: 2, name: 'Wasserrettung', cost: 500000, coins: 25 },
            { id: 3, name: 'Rettungshundestaffel', cost: 350000, coins: 25 },
            { id: 4, name: 'SEG-Drohne', cost: 50000, coins: 15 },
            { id: 5, name: 'Betreuungs- und Verpflegungsdienst', cost: 200000, coins: 25 },
        ],

        '13_normal': [ // Polizeihubschrauberstation
            { id: 0, name: 'Außenlastbehälter', cost: 200000, coins: 15 },
            { id: 1, name: 'Windenrettung', cost: 200000, coins: 15 },
        ],

        '17_normal': [ // Polizeisondereinheit
            { id: 0, name: 'SEK: 1. Zug', cost: 100000, coins: 10 },
            { id: 1, name: 'SEK: 2. Zug', cost: 100000, coins: 10 },
            { id: 2, name: 'MEK: 1. Zug', cost: 100000, coins: 10 },
            { id: 3, name: 'MEK: 2. Zug', cost: 100000, coins: 10 },
            { id: 4, name: 'Diensthundestaffel', cost: 100000, coins: 10 },

        ],

        '0_small': [ // Feuerwehr (Kleinwache)
            { id: 0, name: 'Rettungsdienst', cost: 100000, coins: 20 },
            { id: 1, name: '1te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 2, name: '2te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 6, name: 'Wasserrettung', cost: 400000, coins: 25 },
            { id: 8, name: 'Flughafenfeuerwehr', cost: 300000, coins: 25 },
            { id: 13, name: 'Werkfeuerwehr', cost: 100000, coins: 20 },
            { id: 14, name: 'Netzersatzanlage 50', cost: 100000, coins: 20 },
            { id: 16, name: 'Großlüfter', cost: 75000, coins: 25 },
            { id: 18, name: 'Drohneneinheit', cost: 150000, coins: 25 },
            { id: 19, name: 'Verpflegungsdienst', cost: 200000, coins: 25 },
            { id: 20, name: '1te Anhänger Stellplatz', cost: 75000, coins: 15 },
            { id: 21, name: '2te Anhänger Stellplatz', cost: 75000, coins: 15 },
            { id: 25, name: 'Bahnrettung', cost: 125000, coins: 25 },
        ],

        '6_small': [ // Polizei (Kleinwache)
            { id: 0, name: '1te Zelle', cost: 25000, coins: 5 },
            { id: 1, name: '2te Zelle', cost: 25000, coins: 5 },
            { id: 10, name: 'Diensthundestaffel', cost: 100000, coins: 10 },
            { id: 11, name: 'Kriminalpolizei', cost: 100000, coins: 20 },
            { id: 12, name: 'Dienstgruppenleitung', cost: 200000, coins: 25 },
            { id: 13, name: 'Motorradstaffel', cost: 75000, coins: 15 },
        ],

        '24_normal': [ // Reiterstaffel
            { id: 0, name: 'Reiterstaffel', cost: 300000, coins: 25 },
            { id: 1, name: 'Reiterstaffel', cost: 300000, coins: 25 },
            { id: 2, name: 'Reiterstaffel', cost: 300000, coins: 25 },
            { id: 3, name: 'Reiterstaffel', cost: 300000, coins: 25 },
            { id: 4, name: 'Reiterstaffel', cost: 300000, coins: 25 },
            { id: 5, name: 'Reiterstaffel', cost: 300000, coins: 25 },
        ],

        '25_normal': [ // Bergrettungswache
            { id: 0, name: 'Höhenrettung', cost: 50000, coins: 25 },
            { id: 1, name: 'Drohneneinheit', cost: 75000, coins: 25 },
            { id: 2, name: 'Rettungshundestaffel', cost: 350000, coins: 25 },
            { id: 3, name: 'Rettungsdienst', cost: 100000, coins: 20 },
        ],

        '27_normal': [ // Schule für Seefahrt und Seenotrettung
            { id: 0, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },
            { id: 1, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },
            { id: 2, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },
        ],

    };

    const buildingTypeNames = {
        '0_normal': 'Feuerwache (Normal)',
        '0_small': 'Feuerwache (Kleinwache)',
        '1_normal': 'Feuerwehrschule',
        '2_normal': 'Rettungswache',
        '3_normal': 'Rettungsschule',
        '4_normal': 'Krankenhaus',
        '5_normal': 'Rettungshubschrauber-Station',
        '6_normal': 'Polizeiwache (Normal)',
        '6_small': 'Polizeiwache (Kleinwache)',
        '8_normal': 'Polizeischule',
        '9_normal': 'Technisches Hilfswerk',
        '10_normal': 'Technisches Hilfswerk - Bundesschule',
        '11_normal': 'Bereitschaftspolizei',
        '12_normal': 'Schnelleinsatzgruppe (SEG)',
        '13_normal': 'Polizeihubschrauber-Station',
        '17_normal': 'Polizei-Sondereinheiten',
        '24_normal': 'Reiterstaffel',
        '25_normal': 'Bergrettungswache',
        '27_normal': 'Schule für Seefahrt und Seenotrettung',
    };

    // Ab hier nichts mehr ändern! (Es sei denn Ihr wisst was Ihr tut)

    // Funktion um die Lightbox und Stile zu erstellen
    const styles = `
        #extension-lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }
        #extension-lightbox #extension-lightbox-content {
            background: var(--background-color, white);
            color: var(--text-color, black);
            border: 1px solid var(--border-color, black);
            padding: 20px;
            width: 80%;
            max-width: 1500px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            text-align: center;
            border-radius: 10px; /* Abgerundete Ecken */
        }
        #extension-lightbox #close-extension-helper {
            position: absolute;
            top: 10px;
            right: 10px;
            background: red;
            color: white;
            border: none;
            padding: 5px 10px;
            cursor: pointer;
            border-radius: 4px;
        }
        :root {
            --background-color: #f2f2f2;
            --text-color: #000;
            --border-color: #ccc;
            --button-background-color: #007bff;
            --button-text-color: #ffffff;
            --button-hover-background-color: #0056b3;
        }
        #extension-lightbox table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 16px;
        }
        #extension-lightbox th {
            text-align: center;
            vertical-align: middle;
        }
        #extension-lightbox table td {
            background-color: var(--background-color);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            padding: 10px;
            text-align: center; /* Text in der Mitte */
            vertical-align: middle;
        }
        #extension-lightbox thead {
            background-color: #f2f2f2;
            font-weight: bold;
            border-bottom: 2px solid #ccc;
        }
        #extension-lightbox .extension-button,
        #extension-lightbox .build-selected-button,
        #extension-lightbox .build-all-button,
        #extension-lightbox .spoiler-button {
            color: var(--button-text-color);
            border: none;
            padding: 5px 10px;
            cursor: pointer;
            border-radius: 4px;
            font-size: 14px;
            transition: background-color 0.2s ease-in-out;
        }
        #extension-lightbox .extension-button {
            background-color: var(--button-background-color);
        }
        #extension-lightbox .extension-button:hover:enabled {
            background-color: var(--button-hover-background-color);
        }
        #extension-lightbox .build-selected-button {
            background-color: blue;
        }
        #extension-lightbox .build-all-button {
            background-color: red;
        }
        #extension-lightbox .build-selected-button:hover:enabled,
        #extension-lightbox .build-all-button:hover:enabled {
            filter: brightness(90%);
        }
        #extension-lightbox .spoiler-button {
            background-color: green;
        }
        #extension-lightbox .extension-button:disabled,
        #extension-lightbox .build-selected-button:disabled,
        #extension-lightbox .build-all-button:disabled {
            background-color: gray !important;
            cursor: not-allowed;
        }
        #extension-lightbox .spoiler-content {
            display: none;
        }
        #extension-lightbox .extension-search {
            width: 100%;
            padding: 8px;
            margin: 10px 0;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            font-size: 14px;
        }
        .currency-selection {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 1px solid black;
            padding: 20px;
            z-index: 10001;
            display: flex;
            flex-direction: column;
            gap: 10px;
            border-radius: 8px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        }
        .currency-button {
            padding: 10px 20px;
            cursor: pointer;
            border-radius: 4px;
            border: none;
            color: #ffffff;
        }
        .credits-button {
            background-color: #28a745;
        }
        .coins-button {
            background-color: #dc3545;
        }
        .cancel-button {
            background-color: #6c757d;
            color: #ffffff;
            border: none;
            padding: 10px 20px;
            cursor: pointer;
            border-radius: 4px;
        }
        #open-extension-helper {
            cursor: pointer;
        }

    `;

    const SETTINGS_KEY = 'enabledExtensions';

    const defaultExtensionSettings = {};
    for (const category in manualExtensions) {
        for (const ext of manualExtensions[category]) {
            defaultExtensionSettings[`${category}_${ext.id}`] = true;
        }
    }

    function getExtensionSettings() {
        return { ...defaultExtensionSettings, ...GM_getValue(SETTINGS_KEY, {}) };
    }

    function saveExtensionSettings(settings) {
        GM_setValue(SETTINGS_KEY, settings);
    }

    function openExtensionSettingsOverlay() {
        const settings = getExtensionSettings();
        const originalSettings = { ...settings };

        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '10001';
        overlay.style.overflowY = 'auto';

        const panel = document.createElement('div');
        panel.style.margin = '50px auto';
        panel.style.padding = '20px';
        panel.style.background = 'var(--background-color, #fff)';
        panel.style.color = 'var(--text-color, #000)';
        panel.style.borderRadius = '10px';
        panel.style.maxWidth = '800px';

        const close = document.createElement('button');
        close.textContent = 'Schließen';
        close.style.float = 'right';
        close.style.marginBottom = '10px';
        close.style.background = 'transparent';
        close.style.color = 'var(--text-color, #000)';
        close.style.border = '1px solid var(--border-color, #ccc)';
        close.style.padding = '5px 10px';
        close.style.borderRadius = '5px';
        close.addEventListener('click', () => overlay.remove());
        panel.appendChild(close);

        // Beschreibung und Tabs
        const description = document.createElement('div');

        const descHeading = document.createElement('h4');
        descHeading.style.marginBottom = '10px';
        descHeading.textContent = '🛠️ Hier könnt ihr festlegen, welche Erweiterungen und Lagerräume pro Wachen-Typ angezeigt werden sollen.';
        description.appendChild(descHeading);

        const descText = document.createElement('p');
        descText.textContent = 'Die Auswahl wird gespeichert und beim nächsten Besuch automatisch übernommen.';
        description.appendChild(descText);

        panel.appendChild(description);

        // Tabs nur mit Erweiterungen (Lagerräume später)
        const btnGroup = document.createElement('div');
        btnGroup.style.marginBottom = '10px';

        const extBtn = document.createElement('button');
        extBtn.id = 'tab-ext-btn';
        extBtn.className = 'tab-ext-btn active';
        extBtn.textContent = 'Erweiterungen';
        extBtn.style.background = '#007bff';
        extBtn.style.color = 'white';
        extBtn.style.padding = '6px 12px';
        extBtn.style.marginRight = '6px';
        extBtn.style.border = 'none';
        extBtn.style.borderRadius = '4px';
        extBtn.style.cursor = 'pointer';

        btnGroup.appendChild(extBtn);
        panel.appendChild(btnGroup);

        // Container für den Inhalt
        const tabContent = document.createElement('div');
        tabContent.id = 'settings-tab-content';
        tabContent.style.margin = '20px 0';
        panel.appendChild(tabContent);


        const form = document.createElement('form');

        // Hilfsfunktion zum Aktualisieren der Checkboxen nach Änderungen am settings-Objekt
        function updateCheckboxes() {
            for (const input of form.querySelectorAll('input[type=checkbox][data-key]')) {
                const key = input.dataset.key;
                input.checked = settings[key];
            }
        }

        for (const category in manualExtensions) {
            const fieldset = document.createElement('fieldset');

            const legend = document.createElement('legend');
            legend.style.color = 'var(--text-color, #000)';
            legend.style.borderBottom = '1px solid var(--border-color, #ccc)';
            legend.style.padding = '6px 10px';
            legend.style.marginBottom = '6px';
            legend.style.cursor = 'pointer';
            legend.style.userSelect = 'none';
            legend.style.fontWeight = '600';
            legend.style.fontSize = '0.95em';

            // Chevron-Symbol
            const chevron = document.createElement('span');
            chevron.textContent = '▶';
            chevron.style.marginRight = '8px';
            chevron.style.transition = 'transform 0.2s ease';

            const legendText = document.createElement('span');
            legendText.textContent = buildingTypeNames[category] || category;

            legend.appendChild(chevron);
            legend.appendChild(legendText);

            // Container für die Checkboxen
            const contentContainer = document.createElement('div');
            contentContainer.style.display = 'none'; // geschlossen
            contentContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(150px, 1fr))';
            contentContainer.style.gap = '8px';
            contentContainer.style.padding = '8px 0';

            // Alle-An/Abwählen Checkbox im Spoiler
            const allCheckboxLabel = document.createElement('label');
            allCheckboxLabel.style.gridColumn = '1 / -1';
            allCheckboxLabel.style.display = 'flex';
            allCheckboxLabel.style.alignItems = 'center';
            allCheckboxLabel.style.gap = '6px';
            allCheckboxLabel.style.fontWeight = '500';

            const selectAllCheckbox = document.createElement('input');
            selectAllCheckbox.type = 'checkbox';
            selectAllCheckbox.dataset.group = category;

            const selectAllText = document.createElement('span');
            selectAllText.textContent = 'Alle Erweiterungen an-/abwählen';
            selectAllText.style.fontWeight = 'bold';
            selectAllText.style.color = 'var(--primary-color, #007bff)';

            allCheckboxLabel.appendChild(selectAllCheckbox);
            allCheckboxLabel.appendChild(selectAllText);
            contentContainer.appendChild(allCheckboxLabel);

            const checkboxes = [];

            manualExtensions[category].forEach(ext => {
                const key = `${category}_${ext.id}`;
                const label = document.createElement('label');
                label.style.display = 'flex';
                label.style.alignItems = 'center';
                label.style.gap = '6px';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = settings[key];
                checkbox.dataset.key = key;

                checkbox.addEventListener('change', () => {
                    settings[key] = checkbox.checked;
                    updateSelectAllCheckbox();
                });

                label.appendChild(checkbox);
                label.append(` ${ext.name}`);
                contentContainer.appendChild(label);
                checkboxes.push(checkbox);
            });

            function updateSelectAllCheckbox() {
                const allChecked = checkboxes.every(cb => cb.checked);
                selectAllCheckbox.checked = allChecked;
            }

            selectAllCheckbox.addEventListener('change', () => {
                checkboxes.forEach(cb => {
                    cb.checked = selectAllCheckbox.checked;
                    settings[cb.dataset.key] = cb.checked;
                });
            });

            // Spoiler-Öffnen / -Schließen mit Chevron
            legend.addEventListener('click', (e) => {
                const isOpen = contentContainer.style.display === 'grid';
                contentContainer.style.display = isOpen ? 'none' : 'grid';
                chevron.textContent = isOpen ? '▶' : '▼';
            });

            updateSelectAllCheckbox();

            fieldset.appendChild(legend);
            fieldset.appendChild(contentContainer);
            form.appendChild(fieldset);
        }

        panel.appendChild(form);

        // Buttons Container
        const btnContainer = document.createElement('div');
        btnContainer.style.marginTop = '15px';
        btnContainer.style.textAlign = 'right';

        // Speichern Button
        const saveBtn = document.createElement('button');
        saveBtn.type = 'button';
        saveBtn.textContent = 'Speichern';
        saveBtn.style.marginRight = '10px';
        saveBtn.style.background = 'transparent';
        saveBtn.style.color = 'var(--text-color, #000)';
        saveBtn.style.border = '1px solid var(--border-color, #ccc)';
        saveBtn.style.padding = '5px 10px';
        saveBtn.style.borderRadius = '5px';
        saveBtn.addEventListener('click', () => {
            saveExtensionSettings(settings);
            alert('Einstellungen gespeichert!');
            overlay.remove();
            location.reload();
        });
        btnContainer.appendChild(saveBtn);

        // Zurücksetzen Button
        const resetBtn = document.createElement('button');
        resetBtn.type = 'button';
        resetBtn.textContent = 'Zurücksetzen';
        resetBtn.style.background = 'transparent';
        resetBtn.style.color = 'var(--text-color, #000)';
        resetBtn.style.border = '1px solid var(--border-color, #ccc)';
        resetBtn.style.padding = '5px 10px';
        resetBtn.style.borderRadius = '5px';
        resetBtn.addEventListener('click', () => {
            for (const key in settings) {
                settings[key] = true;
            }
            updateCheckboxes();
            form.querySelectorAll('fieldset').forEach(fieldset => {
                const selectAll = fieldset.querySelector('input[type="checkbox"][data-group]');
                if (selectAll) selectAll.checked = true;
            });
        });
        btnContainer.appendChild(resetBtn);

        panel.appendChild(btnContainer);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);
    }


    // Funktion zum Abrufen der Benutzereinstellungen vom API
    async function getUserMode() {
        try {
            const response = await fetch('https://www.leitstellenspiel.de/api/settings');
            const data = await response.json();
            return data; // Gibt die vollständige Antwort zurück
        } catch (error) {
            console.error("Fehler beim Abrufen der Einstellungen: ", error);
            return null;
        }
    }

    // Funktion zum Anwenden des Dark- oder Light-Modus basierend auf der API-Antwort
    async function applyMode() {
        const userSettings = await getUserMode();
        if (!userSettings) {
            return;
        }

        const mode = userSettings.design_mode; // Benutze jetzt "design_mode" anstelle von "mode"
        // Warten auf das Lightbox-Element
        const lightboxContent = document.getElementById('extension-lightbox-content');
        if (!lightboxContent) {
            return;
        }

        // Entferne alle möglichen Modus-Klassen
        lightboxContent.classList.remove('dark', 'light');

        // Modus anwenden
        if (mode === 1 || mode === 4) { // Dunkelmodus
            lightboxContent.classList.add('dark');

            // Dark Mode für Tabelle
            document.documentElement.style.setProperty('--background-color', '#333');
            document.documentElement.style.setProperty('--text-color', '#fff');
            document.documentElement.style.setProperty('--border-color', '#444');
        } else if (mode === 2 || mode === 3) { // Hellmodus
            lightboxContent.classList.add('light');

            // Light Mode für Tabelle
            document.documentElement.style.setProperty('--background-color', '#f2f2f2');
            document.documentElement.style.setProperty('--text-color', '#000');
            document.documentElement.style.setProperty('--border-color', '#ccc');
        } else { // Standardmodus (wenn der Modus unbekannt ist)
            lightboxContent.classList.add('light'); // Standardmäßig hell

            // Standard Light Mode für Tabelle
            document.documentElement.style.setProperty('--background-color', '#f2f2f2');
            document.documentElement.style.setProperty('--text-color', '#000');
            document.documentElement.style.setProperty('--border-color', '#ccc');
        }
    }

    // Funktion zur Beobachtung der Lightbox auf Änderungen (für dynamisch geladene Elemente)
    function observeLightbox() {
        const lightboxContainer = document.getElementById('extension-lightbox');
        if (!lightboxContainer) {
            return;
        }

        const observer = new MutationObserver(() => {
            // Überprüfe, ob das Content-Element in der Lightbox existiert
            const lightboxContent = document.getElementById('extension-lightbox-content');
            if (lightboxContent) {
                applyMode(); // Wenn das Lightbox-Inhalt gefunden wird, Modus anwenden
                observer.disconnect(); // Beende die Beobachtung, wenn die Lightbox gefunden wurde
            }
        });

        // Beobachte das Hinzufügen von neuen Kindelementen (wie die Lightbox-Inhalte)
        observer.observe(lightboxContainer, { childList: true, subtree: true });
    }

    // Wende den Modus an, wenn das DOM bereit ist
    window.addEventListener('load', () => {
        applyMode();
        observeLightbox(); // Beobachtet dynamische Änderungen
    });

    // Fügt die Stile hinzu
    const styleElement = document.createElement('style');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);

    const lightbox = document.createElement('div');
    lightbox.id = 'extension-lightbox';
    lightbox.style.display = 'none';
    lightbox.innerHTML = `
<div id="extension-lightbox-content">
    <button id="close-extension-helper">Schließen</button>
    <h3>🚒🏗️ <strong>Herzlich willkommen beim ultimativen Ausbau-Assistenten für eure Wachen!</strong> 🚒🏗️</h3>
    <h2>
        <br>Dem Erweiterungs-Manager
    </h2>
    <h5>
        <br>
        <br>Dieses kleine Helferlein zeigt euch genau, wo noch Platz in euren Wachen ist: Welche <strong>Erweiterungen</strong> und <strong>Lagerräume</strong> noch möglich sind – und mit nur ein paar Klicks geht’s direkt in den Ausbau. Einfacher wird’s nicht!
        <br>
        <br>Und das Beste: Über den
        <button id="open-extension-settings" style="
            font-weight: 600;
            color: #fff;
            background-color: var(--primary-color, #007bff);
            border: none;
            padding: 6px 14px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            margin: 0 5px;
        ">
          Einstellungen
        </button>
        -Button könnt ihr festlegen, welche Erweiterungen und Lagerräume euch pro Wachen-Typ angezeigt werden – ganz nach eurem Geschmack. Einmal gespeichert, für immer gemerkt.
        <br>
        <br>Kleiner Hinweis am Rande: Feedback, Verbesserungsvorschläge oder Kritik zum Skript sind jederzeit im
        <a href="https://forum.leitstellenspiel.de/index.php?thread/27856-script-erweiterungs-manager/" target="_blank" style="color:#007bff; text-decoration:none;">
            <strong>Forum</strong>
        </a> willkommen. 💌
        <br>
        <br>
        <br>Und nun viel Spaß beim Credits oder Coins ausgeben!
        <div id="extension-list">
        Einen Moment Geduld bitte …
        <br><br>
        Gebäudedaten werden geladen, Kaffee kocht – gleich geht's los!
        </div>
    </h5>
</div>
`;

    document.body.appendChild(lightbox);

    const openBtn = document.getElementById('open-extension-settings');
    openBtn.addEventListener('mouseenter', () => {
        openBtn.style.backgroundColor = '#0056b3'; // dunkleres Blau beim Hover
    });
    openBtn.addEventListener('mouseleave', () => {
        openBtn.style.backgroundColor = 'var(--primary-color, #007bff)';
    });

    openBtn.addEventListener('click', () => {
        openExtensionSettingsOverlay();
    });

    const lightboxContent = lightbox.querySelector('#extension-lightbox-content');

    // Darkmode oder Whitemode anwenden
    function applyTheme() {
        const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        lightboxContent.classList.toggle('dark', isDarkMode);
        lightboxContent.classList.toggle('light', !isDarkMode);
    }

    // Event-Listener für Theme-Änderungen
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

    // Theme initial anwenden
    applyTheme();

    // Funktion zum Formatieren der Zahl
    function formatNumber(number) {
        return new Intl.NumberFormat('de-DE').format(number);
    }

    // Funktion zum Abrufen des CSRF-Tokens
    function getCSRFToken() {
        const meta = document.querySelector('meta[name="csrf-token"]');
        return meta ? meta.getAttribute('content') : '';
    }

    // Button im Profilmenü hinzufügen
    function addMenuButton() {
        const profileMenu = document.querySelector('#menu_profile + .dropdown-menu');
        if (profileMenu) {
            let menuButton = document.querySelector('#menu_profile + .dropdown-menu #open-extension-helper');
            if (!menuButton) {
                const divider = profileMenu.querySelector('li.divider');
                menuButton = document.createElement('li');
                menuButton.setAttribute('role', 'presentation');
                menuButton.innerHTML = `
                <a href="#" id="open-extension-helper">
                    <span class="glyphicon glyphicon-wrench"></span>&nbsp;&nbsp; Erweiterungs-Manager
                </a>
            `;
                if (divider) {
                    profileMenu.insertBefore(menuButton, divider);
                } else {
                    profileMenu.appendChild(menuButton);
                }
            }
            // Entfernen des href-Attribut, um das Standard-Linkverhalten zu verhindern
            const link = menuButton.querySelector('a');
            link.removeAttribute('href');
            link.addEventListener('click', (e) => {
                e.preventDefault();
                checkPremiumAndShowHint();
            });
        } else {
            console.error('Profilmenü (#menu_profile + .dropdown-menu) nicht gefunden. Der Button konnte nicht hinzugefügt werden.');
        }
    }

    // Initial den Button hinzufügen
    addMenuButton();

    // Globale Variable definieren
    var user_premium = false;

    // Funktion, um den Premium-Status zu überprüfen
    function checkPremiumStatus() {
        // Suchen Sie nach dem Skript-Tag, das die Variable user_premium setzt
        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
            var scriptContent = scripts[i].textContent;
            var premiumMatch = scriptContent.match(/var user_premium\s*=\s*(true|false);/);
            if (premiumMatch) {
                user_premium = (premiumMatch[1] === 'true');
                break;
            }
        }

        // Fallback, falls die Variable nicht gefunden wird
        if (typeof user_premium === 'undefined') {
            console.error("Die Variable 'user_premium' ist nicht definiert. Bitte prüfen Sie die HTML-Struktur.");
            user_premium = false; // Standardwert setzen
        }
    }

    // Rufen Sie die Funktion auf, um den Status zu überprüfen
    checkPremiumStatus();

    // Funktion zur Prüfung von Premium und Hinweis
    async function checkPremiumAndShowHint() {
        const userSettings = await getUserMode();
        const isDarkMode = userSettings && (userSettings.design_mode === 1 || userSettings.design_mode === 4);

        function createCustomAlert(message, isDarkMode, callback) {
            const alertDiv = document.createElement('div');
            alertDiv.style.position = 'fixed';
            alertDiv.style.top = '50%';
            alertDiv.style.left = '50%';
            alertDiv.style.transform = 'translate(-50%, -50%)';
            alertDiv.style.padding = '20px';
            alertDiv.style.border = '1px solid';
            alertDiv.style.borderRadius = '10px';
            alertDiv.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.2)';
            alertDiv.style.width = '300px';
            alertDiv.style.textAlign = 'center';
            alertDiv.style.zIndex = '10002';

            alertDiv.style.background = isDarkMode ? '#333' : '#fff';
            alertDiv.style.color = isDarkMode ? '#fff' : '#000';
            alertDiv.style.borderColor = isDarkMode ? '#444' : '#ccc';

            const alertText = document.createElement('p');
            alertText.textContent = message;
            alertDiv.appendChild(alertText);

            const closeButton = document.createElement('button');
            closeButton.textContent = 'OK';
            closeButton.style.marginTop = '10px';
            closeButton.style.padding = '5px 10px';
            closeButton.style.border = 'none';
            closeButton.style.cursor = 'pointer';
            closeButton.style.borderRadius = '4px';
            closeButton.style.backgroundColor = isDarkMode ? '#444' : '#007bff';
            closeButton.style.color = isDarkMode ? '#fff' : '#fff';
            closeButton.onclick = () => {
                document.body.removeChild(alertDiv);
                callback();
            };
            alertDiv.appendChild(closeButton);

            document.body.appendChild(alertDiv);
        }

        if (typeof user_premium !== 'undefined') {

            if (!user_premium) {
                createCustomAlert("Du kannst dieses Script nur mit Einschränkungen nutzen da du keinen Premium-Account hast.", isDarkMode, () => {
                    const lightbox = document.getElementById('extension-lightbox');
                    lightbox.style.display = 'flex';
                    fetchBuildingsAndRender(); // API-Daten abrufen, wenn das Script geöffnet wird
                });
            } else {
                const lightbox = document.getElementById('extension-lightbox');
                lightbox.style.display = 'flex';
                fetchBuildingsAndRender(); // API-Daten abrufen, wenn das Script geöffnet wird
            }
        } else {
            console.error("Die Variable 'user_premium' ist nicht definiert. Bitte prüfe, ob sie korrekt geladen wurde.");
        }
    }

    // Funktion, um den Namen eines Gebäudes anhand der ID zu bekommen
    function getBuildingCaption(buildingId) {
        const building = buildingsData.find(b => String(b.id) === String(buildingId));
        if (building) {

            return building.caption; // Direkt den Gebäudennamen zurückgeben
        }

        return 'Unbekanntes Gebäude';
    }

    let buildingsData = []; // Globale Variable, um die abgerufenen Gebäudedaten zu speichern
    let buildingGroups = {}; // Globale Definition

    // Funktion zum Abrufen der Gebäudedaten
    function fetchBuildingsAndRender() {
        fetch('https://www.leitstellenspiel.de/api/buildings')
            .then(response => {
            if (!response.ok) {
                throw new Error('Fehler beim Abrufen der Daten');
            }
            return response.json();
        })
            .then(data => {
            buildingsData = data; // Speichern der Gebäudedaten in einer globalen Variablen
            renderMissingExtensions(data); // Weiterverarbeiten der abgerufenen Daten
        })
            .catch(error => {
            const list = document.getElementById('extension-list');
            list.innerHTML = 'Fehler beim Laden der Gebäudedaten.';
        });
    }

    // Funktion, um den Namen der zugehörigen Leitstelle zu ermitteln
    function getLeitstelleName(building) {
        if (!building.leitstelle_building_id) return 'Keine Leitstelle';

        const leitstelle = buildingsData.find(b => b.id === building.leitstelle_building_id);
        return leitstelle ? leitstelle.caption : 'Unbekannt';
    }

    // Funktion um die aktuelle Credits und Coins des USERS abzurufen
    async function getUserCredits() {
        try {
            const response = await fetch('https://www.leitstellenspiel.de/api/userinfo');
            if (!response.ok) {
                throw new Error('Fehler beim Abrufen der Credits und Coins');
            }
            const data = await response.json();
            return {
                credits: data.credits_user_current,
                coins: data.coins_user_current,
                premium: data.premium // Fügen Sie diese Zeile hinzu, um den Premium-Status zurückzugeben
            };
        } catch (error) {
            console.error('Fehler beim Abrufen der Credits und Coins:', error);
            throw error;
        }
    }

    // Funktion um die Tabellen mit Daten zu füllen
    async function renderMissingExtensions(buildings) {
        const userInfo = await getUserCredits();
        const list = document.getElementById('extension-list');
        list.innerHTML = '';

        buildingGroups = {};
        buildingsData = buildings;

        buildings.sort((a, b) => {
            if (a.building_type === b.building_type) {
                return a.caption.localeCompare(b.caption);
            }
            return a.building_type - b.building_type;
        });

        const settings = getExtensionSettings();  // Aktuelle Einstellungen holen

        buildings.forEach(building => {
            // Key für Einstellungen, so wie du sie im Overlay verwendet hast
            const baseKey = `${building.building_type}_${building.small_building ? 'small' : 'normal'}`;

            const extensions = manualExtensions[baseKey];
            if (!extensions) return;

            const existingExtensions = new Set(building.extensions.map(e => e.type_id));

            const allowedExtensions = extensions.filter(extension => {
                // Key für einzelne Extension zusammensetzen
                const key = `${baseKey}_${extension.id}`;

                // Nur Erweiterungen anzeigen, die in den Einstellungen aktiviert sind
                if (!settings[key]) return false;

                if (isExtensionLimitReached(building, extension.id)) return false;

                if (building.building_type === 6 && building.small_building) {
                    const forbidden = [10, 11, 12, 13];
                    if (forbidden.some(id => existingExtensions.has(id))) {
                        return !forbidden.includes(extension.id);
                    }
                }

                if (building.building_type === 0 && building.small_building) {
                    const forbidden = [0, 6, 8, 13, 14, 16, 18, 19, 25];
                    if (forbidden.some(id => existingExtensions.has(id))) {
                        return !forbidden.includes(extension.id);
                    }
                }

                return !existingExtensions.has(extension.id);
            });

            if (allowedExtensions.length > 0) {
                if (!buildingGroups[baseKey]) buildingGroups[baseKey] = [];
                buildingGroups[baseKey].push({ building, missingExtensions: allowedExtensions });
            }
        });


        Object.keys(buildingGroups).forEach(groupKey => {
            const group = buildingGroups[groupKey];
            const buildingType = buildingTypeNames[groupKey] || 'Unbekannt';

            const buildingHeader = document.createElement('h4');
            buildingHeader.textContent = buildingType;
            buildingHeader.classList.add('building-header');
            list.appendChild(buildingHeader);

            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.gap = '10px';
            buttonContainer.style.justifyContent = 'center';
            buttonContainer.style.alignItems = 'center';

            const spoilerButton = document.createElement('button');
            spoilerButton.textContent = 'Erweiterungen anzeigen';
            spoilerButton.classList.add('btn', 'spoiler-button');
            buttonContainer.appendChild(spoilerButton);

            const buildSelectedButton = document.createElement('button');
            buildSelectedButton.textContent = 'Ausgewählte Erweiterungen bauen';
            buildSelectedButton.classList.add('btn', 'build-selected-button');
            buildSelectedButton.disabled = true;
            buildSelectedButton.onclick = () => buildSelectedExtensions();
            buttonContainer.appendChild(buildSelectedButton);

            const buildAllButton = document.createElement('button');
            buildAllButton.textContent = 'Sämtliche Erweiterungen bei allen Wachen bauen';
            buildAllButton.classList.add('btn', 'build-all-button');
            buildAllButton.onclick = () => showCurrencySelectionForAll(groupKey);
            buttonContainer.appendChild(buildAllButton);

            list.appendChild(buttonContainer);

            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'spoiler-content';
            contentWrapper.style.display = 'none';

            spoilerButton.addEventListener('click', () => {
                const visible = contentWrapper.style.display === 'block';
                contentWrapper.style.display = visible ? 'none' : 'block';
                spoilerButton.textContent = visible ? 'Erweiterungen anzeigen' : 'Erweiterungen ausblenden';
            });

            const table = document.createElement('table');
            table.innerHTML = `
      <thead style="background-color: #f2f2f2; font-weight: bold; border-bottom: 2px solid #ccc;">
        <tr>
          <th style="padding: 10px; text-align: center;">Alle An- / Abwählen</th>
          <th>Leitstellen</th>
          <th>Wachen</th>
          <th>Baubare Erweiterungen</th>
          <th>Bauen mit Credits</th>
          <th>Bauen mit Coins</th>
        </tr>
      </thead>
      <tbody></tbody>
      `;

            const tbody = table.querySelector('tbody');
            const filters = {}; // für kombinierte Filterung
            const filterRow = document.createElement('tr');
            const filterElements = {}; // speichert Dropdown-Elemente zum Zurücksetzen

            // Checkbox-Zelle in der Filterzeile
            const selectAllCell = document.createElement('th');
            selectAllCell.style.textAlign = 'center';
            const selectAllCheckbox = document.createElement('input');
            selectAllCheckbox.type = 'checkbox';
            selectAllCheckbox.className = 'select-all-checkbox';
            selectAllCheckbox.dataset.group = groupKey;
            selectAllCell.appendChild(selectAllCheckbox);
            filterRow.appendChild(selectAllCell);

            // Funktion für Dropdowns mit kombinierten Filtern
            function createDropdownFilter(options, placeholder, columnIndex) {
                const cell = document.createElement('th');
                const select = document.createElement('select');
                select.innerHTML = `<option value="">🔽 ${placeholder}</option>`;
                [...new Set(options)].sort().forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt;
                    option.textContent = opt;
                    select.appendChild(option);
                });

                select.addEventListener('change', () => {
                    if (select.value === '') {
                        delete filters[columnIndex];
                    } else {
                        filters[columnIndex] = select.value;
                    }
                    applyAllFilters(table, filters);
                    updateSelectAllCheckboxState();
                });

                filterElements[columnIndex] = select;
                cell.appendChild(select);
                return cell;
            }

            const leitstellen = group.map(g => getLeitstelleName(g.building));
            const wachen = group.map(g => g.building.caption);
            const erweiterungen = group.flatMap(g => g.missingExtensions.map(e => e.name));

            filterRow.appendChild(createDropdownFilter(leitstellen, 'Leitstelle', 1));
            filterRow.appendChild(createDropdownFilter(wachen, 'Wache', 2));
            filterRow.appendChild(createDropdownFilter(erweiterungen, 'Erweiterung', 3));

            // Filter zurücksetzen Button in 4. Spalte (Bauen mit Credits)
            const resetCell = document.createElement('th');
            resetCell.style.textAlign = 'center';
            const resetButton = document.createElement('button');
            resetButton.textContent = 'Filter zurücksetzen';
            resetButton.classList.add('btn', 'btn-sm', 'btn-primary');
            resetButton.style.padding = '2px 6px';
            resetButton.style.fontSize = '0.8em';
            resetButton.style.borderRadius = '0.25rem';
            resetButton.style.height = 'auto';
            resetButton.onclick = () => {
                Object.keys(filterElements).forEach(i => {
                    filterElements[i].selectedIndex = 0;
                });
                Object.keys(filters).forEach(k => delete filters[k]);
                applyAllFilters(table, filters);
                updateSelectAllCheckboxState();
            };
            resetCell.appendChild(resetButton);
            filterRow.appendChild(resetCell);

            // Letzte Spalte (Bauen mit Coins) leer lassen
            filterRow.appendChild(document.createElement('th'));

            table.querySelector('thead').appendChild(filterRow);

            selectAllCheckbox.addEventListener('change', () => {
                const rows = tbody.querySelectorAll('tr');
                rows.forEach(row => {
                    if (row.style.display !== 'none') {
                        const checkbox = row.querySelector('.extension-checkbox');
                        if (checkbox && !checkbox.disabled) {
                            checkbox.checked = selectAllCheckbox.checked;
                        }
                    }
                });
                updateBuildSelectedButton();
                updateSelectAllCheckboxState();
            });

            group.forEach(({ building, missingExtensions }) => {
                missingExtensions.forEach(extension => {
                    if (isExtensionLimitReached(building, extension.id)) return;

                    const row = document.createElement('tr');
                    row.classList.add(`row-${building.id}-${extension.id}`);

                    const checkboxCell = document.createElement('td');
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'extension-checkbox';
                    checkbox.dataset.buildingId = building.id;
                    checkbox.dataset.extensionId = extension.id;
                    checkbox.disabled = userInfo.credits < extension.cost && userInfo.coins < extension.coins;
                    checkbox.addEventListener('change', () => {
                        updateBuildSelectedButton();

                    });
                    checkboxCell.appendChild(checkbox);
                    row.appendChild(checkboxCell);

                    const leitstelleCell = document.createElement('td');
                    leitstelleCell.textContent = getLeitstelleName(building);
                    row.appendChild(leitstelleCell);

                    const nameCell = document.createElement('td');
                    nameCell.textContent = building.caption;
                    row.appendChild(nameCell);

                    const extensionCell = document.createElement('td');
                    extensionCell.textContent = extension.name;
                    row.appendChild(extensionCell);

                    const creditCell = document.createElement('td');
                    const creditButton = document.createElement('button');
                    creditButton.textContent = `${formatNumber(extension.cost)} Credits`;
                    creditButton.classList.add('btn', 'btn-xl', 'credit-button');
                    creditButton.style.backgroundColor = '#28a745';
                    creditButton.style.color = 'white';
                    creditButton.disabled = userInfo.credits < extension.cost;
                    creditButton.onclick = () => buildExtension(building, extension.id, 'credits', extension.cost, row);
                    creditCell.appendChild(creditButton);
                    row.appendChild(creditCell);

                    const coinsCell = document.createElement('td');
                    const coinsButton = document.createElement('button');
                    coinsButton.textContent = `${extension.coins} Coins`;
                    coinsButton.classList.add('btn', 'btn-xl', 'coins-button');
                    coinsButton.style.backgroundColor = '#dc3545';
                    coinsButton.style.color = 'white';
                    coinsButton.disabled = userInfo.coins < extension.coins;
                    coinsButton.onclick = () => buildExtension(building, extension.id, 'coins', extension.coins, row);
                    coinsCell.appendChild(coinsButton);
                    row.appendChild(coinsCell);

                    tbody.appendChild(row);
                });
            });

            contentWrapper.appendChild(table);
            list.appendChild(contentWrapper);

            function applyAllFilters(table, filters) {
                const rows = table.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    let visible = true;
                    Object.entries(filters).forEach(([columnIndex, value]) => {
                        const cellText = row.children[columnIndex]?.textContent.toLowerCase().trim() || '';
                        if (value && cellText !== value.toLowerCase()) {
                            visible = false;
                        }
                    });
                    row.style.display = visible ? '' : 'none';
                });
            }

            function updateSelectAllCheckboxState() {
                const rows = tbody.querySelectorAll('tr');
                let total = 0;
                let checked = 0;
                rows.forEach(row => {
                    if (row.style.display !== 'none') {
                        const checkbox = row.querySelector('.extension-checkbox');
                        if (checkbox && !checkbox.disabled) {
                            total++;
                            if (checkbox.checked) checked++;
                        }
                    }
                });
            }

            updateSelectAllCheckboxState();
            updateBuildSelectedButton();
        });
    }

    // Schließen-Button-Funktionalität
    document.getElementById('close-extension-helper').addEventListener('click', () => {
        const lightbox = document.getElementById('extension-lightbox');
        lightbox.style.display = 'none';

        // Setze die globalen Variablen zurück
        buildingGroups = {};
        buildingsData = [];
    });

    // Initial den Button hinzufügen
    addMenuButton();

    // Filterfunktion
    function filterTableByDropdown(table, columnIndex, filterValue) {
        const tbody = table.querySelector('tbody');
        const rows = tbody.querySelectorAll('tr');
        rows.forEach(row => {
            const cell = row.children[columnIndex];
            const cellText = cell?.textContent.toLowerCase() || '';
            const match = !filterValue || cellText === filterValue.toLowerCase();
            row.style.display = match ? '' : 'none';
        });
    }

    // Funktion zur Filterungen der Tabelleninhalten
    function filterTable(tbody, searchTerm) {
        const rows = tbody.querySelectorAll("tr");

        rows.forEach(row => {
            const leitstelle = row.cells[1]?.textContent.toLowerCase() || "";
            const wachenName = row.cells[2]?.textContent.toLowerCase() || "";
            const erweiterung = row.cells[3]?.textContent.toLowerCase() || "";
            const isBuilt = row.classList.contains("built"); // Prüft, ob bereits gebaut

            if (isBuilt) {
                row.style.display = "none"; // Gebaute Zeilen bleiben unsichtbar
            } else if (leitstelle.includes(searchTerm) || wachenName.includes(searchTerm) || erweiterung.includes(searchTerm)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    }

    // Funktion zur Unterscheidung der Erweiterungswarteschlange zwischen Premium und Nicht Premium User
    function isExtensionLimitReached(building, extensionId) {
        const fireStationSmallAlwaysAllowed = [1, 2, 10, 11];
        const fireStationSmallLimited = [0, 6, 8, 13, 14, 16, 18, 19, 25];

        const policeStationSmallAlwaysAllowed = [0, 1];
        const policeStationSmallLimited = [10, 11, 12, 13];

        const thwAllExtensions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]; // Alle THW-Erweiterungen
        const bpolAllExtensions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Alle BPol-Erweiterungen
        const polSonderEinheitAllExtensions = [0, 1, 2, 3, 4]; // Alle PolSondereinheit-Erweiterungen
        const KhAllExtensions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // Alle Krankenhaus-Erweiterungen

        // Falls Premium aktiv ist, gibt es keine Einschränkungen für THW, B-Pol, Schulen und Pol-Sondereinheit
        if (typeof !user_premium !== "undefined" && user_premium) {
            return false; // Keine Einschränkungen für Premium-Nutzer
        }

        // Falls es sich um eine Schule handelt und der Benutzer kein Premium hat
        if (building.building_type === 1 || building.building_type === 3 || building.building_type === 8 || building.building_type === 10 || building.building_type === 27) {
            // Erweiterung 0 und 1 sind immer erlaubt
            if (extensionId === 0 || extensionId === 1) return false;

            // Erweiterung 2 nur erlaubt, wenn Erweiterung 0 bereits gebaut wurde
            if (extensionId === 2) {
                const hasExtension0 = building.extensions.some(ext => ext.type_id === 0);
                if (!hasExtension0) return true; // Blockiere Erweiterung 2, wenn Erweiterung 0 noch nicht gebaut wurde
            }
        }

        if (building.building_type === 0 && building.small_building) {
            // Feuerwache (Kleinwache): Prüfen, ob die Erweiterung limitiert ist
            if (fireStationSmallAlwaysAllowed.includes(extensionId)) return false;
            return building.extensions.some(ext => fireStationSmallLimited.includes(ext.type_id));
        }

        if (building.building_type === 6 && building.small_building) {
            // Polizeiwache (Kleinwache): Prüfen, ob die Erweiterung limitiert ist
            if (policeStationSmallAlwaysAllowed.includes(extensionId)) return false;
            return building.extensions.some(ext => policeStationSmallLimited.includes(ext.type_id));
        }

        if (building.building_type === 4) {
            // Krankenhaus
            const khRequiredFirst = [0, 1];
            const khRestrictedUntilFirstTwo = [2, 3, 4, 5, 6, 7, 8];
            const khAlwaysAllowed = [9];

            if (khAlwaysAllowed.includes(extensionId)) return false;

            const hasRequiredFirstExtensions = khRequiredFirst.every(reqId =>
                                                                     building.extensions.some(ext => ext.type_id === reqId)
                                                                    );

            if (khRestrictedUntilFirstTwo.includes(extensionId) && !hasRequiredFirstExtensions) {
                return true;
            }

            return false;
        }

        if (building.building_type === 9) {
            // THW
            const thwRequiredFirst = [0, 1];
            const thwRestrictedUntilFirstTwo = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13];
            const thwAlwaysAllowed = [11];

            if (thwAlwaysAllowed.includes(extensionId)) return false;

            const hasRequiredFirstExtensions = thwRequiredFirst.every(reqId =>
                                                                      building.extensions.some(ext => ext.type_id === reqId)
                                                                     );

            if (thwRestrictedUntilFirstTwo.includes(extensionId) && !hasRequiredFirstExtensions) {
                return true;
            }

            return false;
        }

        if (building.building_type === 11) {
            // BPol
            const bpolAlwaysAllowed = [0, 3, 4, 6, 8, 9, 10];
            const bpolConditional = { 1: 0, 2: 1, 5: 4, 7: 8 };

            if (bpolAlwaysAllowed.includes(extensionId)) return false;
            if (bpolConditional[extensionId] !== undefined) {
                return !building.extensions.some(ext => ext.type_id === bpolConditional[extensionId]);
            }

            return false;
        }

        if (building.building_type === 17) {
            // PolSonderEinheit
            const polSonderEinheitAlwaysAllowed = [0, 2, 4];
            const polSonderEinheitConditional = { 1: 0, 3: 1 };

            if (polSonderEinheitAlwaysAllowed.includes(extensionId)) return false;
            if (polSonderEinheitConditional[extensionId] !== undefined) {
                return !building.extensions.some(ext => ext.type_id === polSonderEinheitConditional[extensionId]);
            }

            return false;
        }

        return false;
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    // Anfang des Bereichs für den Bau einer Erweiterung in einem Gebäude

    // Funktion zum Bau einer Erweiterung
    async function buildExtension(building, extensionId, currency, amount, row) {
        const userInfo = await getUserCredits();

        // Die Erweiterung wird direkt gebaut
        const csrfToken = getCSRFToken();
        const buildUrl = `/buildings/${building.id}/extension/${currency}/${extensionId}`;

        await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: buildUrl,
                headers: {
                    'X-CSRF-Token': csrfToken,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                onload: function(response) {
                    // Überprüfen, ob die Zeile existiert
                    if (row) {
                        // Wenn es sich um eine Polizei-Kleinwache handelt und Erweiterungen 10, 11, 12 oder 13 betroffen sind
                        if (building.building_type === 6 && building.small_building && [10, 11, 12, 13].includes(extensionId)) {
                            // Alle Erweiterungen der Polizei-Kleinwache ausblenden, die noch nicht gebaut wurden
                            const allRows = document.querySelectorAll(
                                `.row-${building.id}-10,
                         .row-${building.id}-11,
                         .row-${building.id}-12,
                         .row-${building.id}-13`
                            );
                            allRows.forEach(otherRow => {
                                if (otherRow !== row) {
                                    otherRow.style.display = 'none'; // Alle anderen Zeilen ausblenden
                                }
                            });
                        }

                        // Wenn es sich um eine Feuerwehr-Kleinwache handelt und Erweiterungen 0, 3, 4, 5, 6, 7, 8, 9 oder 12 betroffen sind
                        if (building.building_type === 0 && building.small_building && [0, 6, 8, 13, 14, 16, 18, 19, 25].includes(extensionId)) {
                            // Alle Erweiterungen der Feuerwehr-Kleinwache ausblenden, die noch nicht gebaut wurden
                            const allRows = document.querySelectorAll(
                                `.row-${building.id}-0,
                         .row-${building.id}-6,
                         .row-${building.id}-8,
                         .row-${building.id}-13,
                         .row-${building.id}-14,
                         .row-${building.id}-16,
                         .row-${building.id}-18,
                         .row-${building.id}-19,
                         .row-${building.id}-25`
                            );
                            allRows.forEach(otherRow => {
                                if (otherRow !== row) {
                                    otherRow.style.display = 'none'; // Alle anderen Zeilen ausblenden
                                }
                            });
                        }

                        if (row) {
                            row.classList.add("built"); // Markiert die Zeile als gebaut
                            row.style.display = "none"; // Blendet sie weiterhin aus
                        }

                        row.style.display = 'none'; // Die ausgebaute Zeile wird ausgeblendet
                    }

                    resolve(response);
                },
                onerror: function(error) {
                    console.error(`Fehler beim Bauen der Erweiterung in Gebäude ${building.id}.`, error);
                    reject(error);
                }
            });
        });
    }

    // Ende des Bereichs für den Bau * einer Erweiterung * in einem Gebäude


    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


    // Anfang der Funktion für * Bau von ausgewählten Erweiterungen *

    // Funktion zum Überprüfen der maximalen Erweiterungen für Kleinwachen
    function checkMaxExtensions(buildingId, selectedExtensions) {
        const building = buildingsData.find(b => String(b.id) === String(buildingId));
        if (!building) return false;

        if (building.building_type === 0 && building.small_building) {
            // Feuerwehr Kleinwache: maximal 1 Erweiterung + 2 AB-Stellplätze + 2 Anhänger-Stellplätze
            const maxExtensions = 1;
            const maxABStellplatz = 2;
            const maxAnhStellplatz = 2;

            let extensionCount = 0;
            let abStellplatzCount = 0;
            let anhStellplatzCount = 0;

            selectedExtensions.forEach(extensionId => {
                if ([0, 6, 8, 13, 14, 16, 18, 19, 25].includes(extensionId)) {
                    extensionCount++;
                } else if (extensionId === 1) {
                    abStellplatzCount++;
                } else if (extensionId === 20) {
                    anhStellplatzCount++;
                }
            });

            if (extensionCount > maxExtensions || abStellplatzCount > maxABStellplatz || anhStellplatzCount > maxAnhStellplatz) {
                return false;
            }
        }

        if (building.building_type === 6 && building.small_building) {
            // Polizei Kleinwache: maximal 1 Erweiterung + 2 Zellen
            const maxExtensions = 1;
            const maxZellen = 2;

            let extensionCount = 0;
            let zellenCount = 0;

            selectedExtensions.forEach(extensionId => {
                if ([10, 11, 12, 13].includes(extensionId)) {
                    extensionCount++;
                } else if (extensionId === 0) {
                    zellenCount++;
                }
            });

            if (extensionCount > maxExtensions || zellenCount > maxZellen) {
                return false;
            }
        }

        return true;
    }

    // Funktion zum Bau der ausgewählten Erweiterungen
    async function buildSelectedExtensions() {
        const selectedExtensions = document.querySelectorAll('.extension-checkbox:checked');

        const selectedExtensionsByBuilding = {};

        // ZUERST Daten erfassen
        selectedExtensions.forEach(checkbox => {
            const buildingId = checkbox.dataset.buildingId;
            const extensionId = checkbox.dataset.extensionId;

            if (!selectedExtensionsByBuilding[buildingId]) {
                selectedExtensionsByBuilding[buildingId] = [];
            }
            selectedExtensionsByBuilding[buildingId].push(parseInt(extensionId, 10));
        });

        for (const [buildingId, extensions] of Object.entries(selectedExtensionsByBuilding)) {
            const building = buildingsData.find(b => String(b.id) === String(buildingId));
            if (!building) continue;

            // Regeln für Kleinwachen
            if (building.small_building) {
                if (building.building_type === 0) {
                    const invalid = [0, 6, 8, 13, 14, 16, 18, 19, 25];
                    if (extensions.filter(id => invalid.includes(id)).length > 1) {
                        showError("Information zu deinem Bauvorhaben:\n\nDiese Erweiterungen für die Feuerwehr-Kleinwache können nicht zusammen gebaut werden.\n\nBitte wähle nur eine Erweiterung aus.");
                        updateBuildSelectedButton();
                        return;
                    }
                }

                if (building.building_type === 6) {
                    const invalid = [10, 11, 12, 13];
                    if (extensions.filter(id => invalid.includes(id)).length > 1) {
                        showError("Information zu deinem Bauvorhaben:\n\nDiese Erweiterungen für die Polizei-Kleinwache können nicht zusammen gebaut werden.\n\nBitte wähle nur eine Erweiterung aus.");
                        updateBuildSelectedButton();
                        return;
                    }
                }
            }
        }

        const userInfo = await getUserCredits();

        if (!user_premium) {
            for (const [buildingId, extensions] of Object.entries(selectedExtensionsByBuilding)) {
                if (extensions.length > 2) {
                    alert(`Zu viele Erweiterungen für Gebäude ${getBuildingCaption(buildingId)} ausgewählt.\n\nOhne Premium-Account sind maximal 2 Ausbauten möglich.`);
                    updateBuildSelectedButton();
                    return;
                }
            }
        }

        // Optional: Credits & Coins berechnen (robust mit Prüfung)
        let totalCredits = 0;
        let totalCoins = 0;
        for (const [buildingId, extensions] of Object.entries(selectedExtensionsByBuilding)) {
            extensions.forEach(extensionId => {
                const row = document.querySelector(`.row-${buildingId}-${extensionId}`);
                if (!row) {
                    console.warn(`⚠️ Zeile für Erweiterung ${extensionId} in Gebäude ${buildingId} nicht gefunden.`);
                    return;
                }

                const creditElement = row.querySelector('.credit-button');
                const coinElement = row.querySelector('.coins-button');

                if (creditElement) {
                    totalCredits += parseInt(creditElement.innerText.replace(/\D/g, ''), 10);
                }

                if (coinElement) {
                    totalCoins += parseInt(coinElement.innerText.replace(/\D/g, ''), 10);
                }
            });
        }

        // Zeige Coin/Credit-Auswahl
        showCurrencySelection(selectedExtensionsByBuilding, userInfo);

        // Checkboxen und Buttons erst jetzt zurücksetzen
        setTimeout(() => {
            selectedExtensions.forEach(checkbox => {
                checkbox.checked = false;
            });

            document.querySelectorAll('.select-all-checkbox').forEach(checkbox => {
                checkbox.checked = false;
                checkbox.dispatchEvent(new Event('change'));
            });

            updateBuildSelectedButton();
        }, 100);
    }

    // Funktiom um eine Fehlermeldung auszugeben
    function showError(message) {
        // Verstecke den Währungscontainer, falls er existiert
        const currencyContainer = document.getElementById('currency-container');
        if (currencyContainer) {
            currencyContainer.style.display = 'none';
        }

        // Fehlercontainer abrufen
        const errorMessageDiv = document.getElementById('error-message');

        if (errorMessageDiv) {
            errorMessageDiv.textContent = message; // Fehlermeldung setzen
            errorMessageDiv.style.display = 'block'; // Sichtbar machen
        } else {
            alert(message); // Falls das Element nicht existiert, nutze ein Alert
            updateBuildSelectedButton();

        }
    }

    // Funktion zur Auswahl der Zahlmöglichkeit sowie Prüfung der ausgewählten Erweiterungen
    async function showCurrencySelection(selectedExtensionsByBuilding, userInfo) {
        const userSettings = await getUserMode();
        const isDarkMode = userSettings && (userSettings.design_mode === 1 || userSettings.design_mode === 4);

        let totalCredits = 0;
        let totalCoins = 0;

        for (const [buildingId, extensions] of Object.entries(selectedExtensionsByBuilding)) {
            for (const extensionId of extensions) {
                const row = document.querySelector(`.row-${buildingId}-${extensionId}`);
                if (row) {
                    const extensionCost = parseInt(row.querySelector('.credit-button').innerText.replace(/\D/g, ''), 10);
                    const extensionCoins = parseInt(row.querySelector('.coins-button').innerText.replace(/\D/g, ''), 10);
                    totalCredits += extensionCost;
                    totalCoins += extensionCoins;
                }
            }
        }

        const fehlendeCredits = Math.max(0, totalCredits - userInfo.credits);
        const fehlendeCoins = Math.max(0, totalCoins - userInfo.coins);

        // Falls beides nicht reicht, zeige eine Meldung
        if (userInfo.credits < totalCredits && userInfo.coins < totalCoins) {
            alert(`Du hast nicht genug Ressourcen!\n\n- Fehlende Credits: ${formatNumber(fehlendeCredits)}\n- Fehlende Coins: ${formatNumber(fehlendeCoins)}`);
            return;
        }

        const selectionDiv = document.createElement('div');
        selectionDiv.className = 'currency-selection';
        selectionDiv.style.background = isDarkMode ? '#333' : '#fff';
        selectionDiv.style.color = isDarkMode ? '#fff' : '#000';
        selectionDiv.style.borderColor = isDarkMode ? '#444' : '#ccc';

        const totalText = document.createElement('p');
        totalText.innerHTML = `Wähle zwischen <b>Credits (grün)</b> oder <b>Coins (rot)</b><br><br>Info:<br>Sollte eine Währung <b>nicht</b> ausreichend vorhanden sein,<br>kannst Du diese nicht auswählen`;
        selectionDiv.appendChild(totalText);

        const creditsButton = document.createElement('button');
        creditsButton.className = 'currency-button credits-button';
        creditsButton.textContent = `${formatNumber(totalCredits)} Credits`;
        creditsButton.disabled = userInfo.credits < totalCredits;
        creditsButton.onclick = async () => {
            // Fortschrittsanzeige erst nach Auswahl
            const progressContainer = document.createElement('div');
            progressContainer.style.position = 'fixed';
            progressContainer.style.top = '50%';
            progressContainer.style.left = '50%';
            progressContainer.style.transform = 'translate(-50%, -50%)'; // Positionierung, falls nötig
            progressContainer.style.zIndex = '10002';
            progressContainer.style.background = isDarkMode ? '#333' : '#fff'; // kein transparentes Hintergrund
            progressContainer.style.padding = '20px';
            progressContainer.style.borderRadius = '8px';
            progressContainer.style.textAlign = 'center';
            progressContainer.innerHTML = 'Bitte warten...';

            const progressBar = document.createElement('div');
            progressBar.style.height = '10px';
            progressBar.style.width = '100%';
            progressBar.style.backgroundColor = '#e0e0e0'; // normale Hintergrundfarbe ohne Transparenz
            progressContainer.appendChild(progressBar);

            const progressFill = document.createElement('div');
            progressFill.style.height = '100%';
            progressFill.style.width = '0%';
            progressFill.style.backgroundColor = '#76c7c0'; // grüner Farbton für Fortschritt
            progressBar.appendChild(progressFill);

            // Textanzeige für Fortschritt
            const progressText = document.createElement('p');
            progressText.innerHTML = '0 von 0 Erweiterungen gebaut'; // initiale Anzeige
            progressContainer.appendChild(progressText);

            document.body.appendChild(progressContainer);

            const updateProgress = (completed, total) => {
                progressFill.style.width = `${(completed / total) * 100}%`;
                progressText.innerHTML = `${completed} von ${total} Erweiterungen gebaut`;
            };

            let completed = 0;
            const totalItems = Object.keys(selectedExtensionsByBuilding).length;

            for (const [buildingId, extensions] of Object.entries(selectedExtensionsByBuilding)) {
                for (const extensionId of extensions) {
                    const row = document.querySelector(`.row-${buildingId}-${extensionId}`);
                    if (row) {
                        const extensionCost = parseInt(row.querySelector('.credit-button').innerText.replace(/\D/g, ''), 10);
                        await buildExtension({ id: buildingId }, extensionId, 'credits', extensionCost, row);
                        completed++;
                        updateProgress(completed, totalItems);
                    }
                }
            }

            document.body.removeChild(progressContainer); // Fortschrittsanzeige entfernen
            document.body.removeChild(selectionDiv); // Auswahl-Dialog entfernen
        };

        const coinsButton = document.createElement('button');
        coinsButton.className = 'currency-button coins-button';
        coinsButton.textContent = `${formatNumber(totalCoins)} Coins`;
        coinsButton.disabled = userInfo.coins < totalCoins;
        coinsButton.onclick = async () => {
            // Fortschrittsanzeige erst nach Auswahl
            const progressContainer = document.createElement('div');
            progressContainer.style.position = 'fixed';
            progressContainer.style.top = '50%';
            progressContainer.style.left = '50%';
            progressContainer.style.transform = 'translate(-50%, -50%)'; // Positionierung, falls nötig
            progressContainer.style.zIndex = '10002';
            progressContainer.style.background = isDarkMode ? '#333' : '#fff'; // kein transparentes Hintergrund
            progressContainer.style.padding = '20px';
            progressContainer.style.borderRadius = '8px';
            progressContainer.style.textAlign = 'center';
            progressContainer.innerHTML = 'Bitte warten...';

            const progressBar = document.createElement('div');
            progressBar.style.height = '10px';
            progressBar.style.width = '100%';
            progressBar.style.backgroundColor = '#e0e0e0'; // normale Hintergrundfarbe ohne Transparenz
            progressContainer.appendChild(progressBar);

            const progressFill = document.createElement('div');
            progressFill.style.height = '100%';
            progressFill.style.width = '0%';
            progressFill.style.backgroundColor = '#76c7c0'; // grüner Farbton für Fortschritt
            progressBar.appendChild(progressFill);

            // Textanzeige für Fortschritt
            const progressText = document.createElement('p');
            progressText.innerHTML = '0 von 0 Erweiterungen gebaut'; // initiale Anzeige
            progressContainer.appendChild(progressText);

            document.body.appendChild(progressContainer);

            const updateProgress = (completed, total) => {
                progressFill.style.width = `${(completed / total) * 100}%`;
                progressText.innerHTML = `${completed} von ${total} Erweiterungen gebaut`;
            };

            let completed = 0;
            const totalItems = Object.keys(selectedExtensionsByBuilding).length;

            for (const [buildingId, extensions] of Object.entries(selectedExtensionsByBuilding)) {
                for (const extensionId of extensions) {
                    const row = document.querySelector(`.row-${buildingId}-${extensionId}`);
                    if (row) {
                        const extensionCoins = parseInt(row.querySelector('.coins-button').innerText.replace(/\D/g, ''), 10);
                        await buildExtension({ id: buildingId }, extensionId, 'coins', extensionCoins, row);
                        completed++;
                        updateProgress(completed, totalItems);
                    }
                }
            }

            document.body.removeChild(progressContainer); // Fortschrittsanzeige entfernen
            document.body.removeChild(selectionDiv); // Auswahl-Dialog entfernen
        };

        const cancelButton = document.createElement('button');
        cancelButton.className = 'cancel-button';
        cancelButton.textContent = 'Abbrechen';
        cancelButton.onclick = () => {
            document.body.removeChild(selectionDiv); // Auswahl-Dialog entfernen
        };

        selectionDiv.appendChild(creditsButton);
        selectionDiv.appendChild(coinsButton);
        selectionDiv.appendChild(cancelButton);

        document.body.appendChild(selectionDiv);
    }

    // Updatefunktion des Buttons
    function updateBuildSelectedButton() {
        const groups = document.querySelectorAll('.spoiler-content');
        groups.forEach(group => {
            const buildSelectedButton = group.previousElementSibling.querySelector('.build-selected-button');
            const selectedCheckboxes = group.querySelectorAll('.extension-checkbox:checked');
            if (buildSelectedButton) {
                buildSelectedButton.disabled = selectedCheckboxes.length === 0;
            }
        });
    }

    // Event-Listener für Checkbox-Änderungen hinzufügen
    document.addEventListener('change', (event) => {
        if (event.target.classList.contains('extension-checkbox')) {
            updateBuildSelectedButton();
        }
    });

    // Ende der Funktion für * Bau von ausgewählten Erweiterungen *


    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


    // Anfang der Funktion * Alle Erweiterungen * in einem Gebäude bauen

    // Funktion zur Auswahl der Währung und Prüfung der Credit/Coins vorhandenheit
    async function showCurrencySelectionForAll(groupKey) {
        const userSettings = await getUserMode();
        const isDarkMode = userSettings && (userSettings.design_mode === 1 || userSettings.design_mode === 4);

        if (!buildingGroups[groupKey]) {
            console.error(`Ungültiger Gruppen-Key: ${groupKey}`);
            return;
        }

        const group = buildingGroups[groupKey];
        let totalCredits = 0;
        let totalCoins = 0;

        group.forEach(({ missingExtensions }) => {
            missingExtensions.forEach(extension => {
                totalCredits += extension.cost;
                totalCoins += extension.coins;
            });
        });

        const userInfo = await getUserCredits();
        const fehlendeCredits = Math.max(0, totalCredits - userInfo.credits);
        const fehlendeCoins = Math.max(0, totalCoins - userInfo.coins);

        // Falls beides nicht reicht, zeige eine Meldung
        if (userInfo.credits < totalCredits && userInfo.coins < totalCoins) {
            alert(`Du hast nicht genug Ressourcen!\n\n- Fehlende Credits: ${formatNumber(fehlendeCredits)}\n- Fehlende Coins: ${formatNumber(fehlendeCoins)}`);
            return;
        }

        const selectionDiv = document.createElement('div');
        selectionDiv.className = 'currency-selection';
        selectionDiv.style.background = isDarkMode ? '#333' : '#fff';
        selectionDiv.style.color = isDarkMode ? '#fff' : '#000';
        selectionDiv.style.borderColor = isDarkMode ? '#444' : '#ccc';

        const totalText = document.createElement('p');
        totalText.innerHTML = `Wähle zwischen <b>Credits (grün)</b> oder <b>Coins (rot)</b><br><br>Info:<br>Sollte eine Währung <b>nicht</b> ausreichend vorhanden sein,<br>kannst Du diese nicht auswählen`;
        selectionDiv.appendChild(totalText);

        const creditsButton = document.createElement('button');
        creditsButton.className = 'currency-button credits-button';
        creditsButton.textContent = `${formatNumber(totalCredits)} Credits`;
        creditsButton.disabled = userInfo.credits < totalCredits;
        creditsButton.onclick = async () => {
            document.body.removeChild(selectionDiv);
            await calculateAndBuildAllExtensions(groupKey, 'credits');
        };

        const coinsButton = document.createElement('button');
        coinsButton.className = 'currency-button coins-button';
        coinsButton.textContent = `${formatNumber(totalCoins)} Coins`;
        coinsButton.disabled = userInfo.coins < totalCoins;
        coinsButton.onclick = async () => {
            document.body.removeChild(selectionDiv);
            await calculateAndBuildAllExtensions(groupKey, 'coins');
        };

        const cancelButton = document.createElement('button');
        cancelButton.className = 'cancel-button';
        cancelButton.textContent = 'Abbrechen';
        cancelButton.onclick = () => {
            document.body.removeChild(selectionDiv);
        };

        selectionDiv.appendChild(creditsButton);
        selectionDiv.appendChild(coinsButton);
        selectionDiv.appendChild(cancelButton);

        document.body.appendChild(selectionDiv);
    }

    // Funktion um die Gesamtkosten zu errechnen
    async function calculateAndBuildAllExtensions(groupKey, currency) {
        const group = buildingGroups[groupKey];
        const totalExtensions = group.reduce((sum, { missingExtensions }) => sum + missingExtensions.length, 0);
        const totalCost = group.reduce((sum, { missingExtensions }) => {
            return sum + missingExtensions.reduce((extSum, extension) => extSum + extension[currency], 0);
        }, 0);

        try {
            const userInfo = await getUserCredits();
            if ((currency === 'credits' && userInfo.credits < totalCost) || (currency === 'coins' && userInfo.coins < totalCost)) {
                alert(`Nicht genügend ${currency === 'credits' ? 'Credits' : 'Coins'}. Der Bauversuch wird abgebrochen.`);
                return;
            }

            // Erstelle die Fortschrittsanzeige
            const { progressContainer, progressText, progressFill } = await createProgressBar(totalExtensions);
            let builtCount = 0;

            // Baue alle Erweiterungen nur für den spezifischen Wachentyp
            for (const { building, missingExtensions } of group) {
                for (const extension of missingExtensions) {
                    // Überprüfe, ob die Erweiterung gebaut werden kann
                    if (!isExtensionLimitReached(building, extension.id)) {
                        // Baue die Erweiterung
                        await buildExtension(building, extension.id, currency, extension[currency]);
                        builtCount++;
                        updateProgress(builtCount, totalExtensions, progressText, progressFill);
                    }
                }
            }

            // Entferne die Fortschrittsanzeige, wenn alle Erweiterungen gebaut wurden
            removeProgressBar(progressContainer);

            // Aktualisiere die Tabelle
            renderMissingExtensions(buildingsData);
        } catch (error) {
            console.error('Fehler beim Abrufen der Credits und Coins:', error);
            alert('Fehler beim Abrufen der Credits und Coins.');
        }
    }

    // Funktion zur Erstellung der Fortschrittsanzeige
    async function createProgressBar(totalExtensions) {
        const userSettings = await getUserMode();
        const isDarkMode = userSettings && (userSettings.design_mode === 1 || userSettings.design_mode === 4);

        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        progressContainer.style.position = 'fixed';
        progressContainer.style.top = '50%';
        progressContainer.style.left = '50%';
        progressContainer.style.transform = 'translate(-50%, -50%)';
        progressContainer.style.padding = '20px';
        progressContainer.style.border = '1px solid #ccc';
        progressContainer.style.borderRadius = '10px';
        progressContainer.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.2)';
        progressContainer.style.width = '300px';
        progressContainer.style.textAlign = 'center';
        progressContainer.style.zIndex = '10002'; // Sicherstellen, dass der Fortschrittsbalken oben bleibt

        // Set background color based on mode
        progressContainer.style.background = isDarkMode ? '#333' : '#fff';
        progressContainer.style.color = isDarkMode ? '#fff' : '#000';

        const progressText = document.createElement('p');
        progressText.textContent = `0 / ${totalExtensions} Erweiterungen gebaut`;
        progressText.style.fontWeight = 'bold'; // Fettschrift für bessere Lesbarkeit
        progressText.style.fontSize = '16px'; // Größere Schrift für bessere Sichtbarkeit

        const progressBar = document.createElement('div');
        progressBar.style.width = '100%';
        progressBar.style.background = isDarkMode ? '#555' : '#ddd';  // Hintergrund für die Progressbar
        progressBar.style.borderRadius = '5px';
        progressBar.style.marginTop = '10px';
        progressBar.style.overflow = 'hidden'; // Hinzugefügt um sicherzustellen, dass der Fortschrittsbalken den Container nicht verlässt

        const progressFill = document.createElement('div');
        progressFill.style.width = '0%';
        progressFill.style.height = '20px';
        progressFill.style.background = '#4caf50';
        progressFill.style.borderRadius = '5px';

        progressBar.appendChild(progressFill);
        progressContainer.appendChild(progressText);
        progressContainer.appendChild(progressBar);
        document.body.appendChild(progressContainer);

        return { progressContainer, progressText, progressFill };
    }

    // Funktion zur Aktualisierung des Fortschritts
    function updateProgress(builtCount, totalExtensions, progressText, progressFill) {
        progressText.textContent = `${builtCount} / ${totalExtensions} Erweiterungen gebaut`;
        progressFill.style.width = Math.min(100, (builtCount / totalExtensions) * 100) + '%'; // Math.min hinzugefügt, um sicherzustellen, dass die Breite nicht 100% überschreitet
    }

    // Funktion zum Entfernen der Fortschrittsanzeige mit 500ms Verzögerung
    function removeProgressBar(progressContainer) {
        setTimeout(() => {
            document.body.removeChild(progressContainer);
        }, 500); // 500ms Pause bevor die Fortschrittsanzeige entfernt wird
    }

    // Funktion zum Bauen aller Erweiterungen für alle Wachen mit Pause und Anzeige
    async function buildAllExtensionsWithPause(groupKey, currency) {
        const group = buildingGroups[groupKey];
        let builtCount = 0;
        const totalExtensions = group.reduce((sum, { missingExtensions }) => sum + missingExtensions.length, 0);

        // Erstelle die Fortschrittsanzeige
        const { progressContainer, progressText, progressFill } = await createProgressBar(totalExtensions);

        for (const { building, missingExtensions } of group) {
            for (const extension of missingExtensions) {
                // Überprüfe, ob die Erweiterung gebaut werden kann
                if (!isExtensionLimitReached(building, extension.id)) {
                    // Definiere die Zeile (row)
                    const row = document.querySelector(`.row-${building.id}-${extension.id}`);
                    // Baue die Erweiterung
                    await buildExtensionWithPause(building, extension.id, currency, extension[currency], row);
                    await new Promise(resolve => setTimeout(resolve, 500)); // 500ms Pause
                    builtCount++;
                    updateProgress(builtCount, totalExtensions, progressText, progressFill);
                }
            }
        }

        // Entferne die Fortschrittsanzeige, wenn alle Erweiterungen gebaut wurden
        removeProgressBar(progressContainer);
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

})();
