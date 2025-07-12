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
// @icon         https://github.com/Caddy21/-docs-assets-css/raw/main/yoshi_icon__by_josecapes_dgqbro3-fullview.png
// @run-at       document-end
// ==/UserScript==

// To-Do
// Lagererweiterungen einbauen
// manualExtensions verbessern um etliches Ausklammern zu verhindern und dem User weniger Arbeit zu machen
// Suche verbessern

(function() {
    'use strict';
    // Manuelle Konfiguration der Erweiterungen

    const manualExtensions = {
        '0_normal': [ // Feuerwache (normal)
            { id: 0, name: 'Rettungsdienst', cost: 100000, coins: 20 },
            { id: 6, name: 'Wasserrettung', cost: 400000, coins: 25 },
            { id: 8, name: 'Flughafenfeuerwehr', cost: 300000, coins: 25 },
            { id: 13, name: 'Werkfeuerwehr', cost: 100000, coins: 20 },
            { id: 14, name: 'Netzersatzanlage 50', cost: 100000, coins: 20 },
            { id: 15, name: 'Netzersatzanlage 200', cost: 100000, coins: 20 },
            { id: 16, name: 'Großlüfter', cost: 75000, coins: 15 },
            { id: 18, name: 'Drohneneinheit', cost: 150000, coins: 25 },
            { id: 19, name: 'Verpflegungsdienst', cost: 200000, coins: 25 },
            { id: 25, name: 'Bahnrettung', cost: 125000, coins: 25 },
            { id: 9, name: 'Großwache', cost: 1000000, coins: 50 },
            { id: 1, name: '1te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 2, name: '2te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 3, name: '3te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 4, name: '4te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 5, name: '5te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 7, name: '6te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 10, name: '7te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 11, name: '8te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 12, name: '9te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 17, name: '10te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 26, name: '11te Ab-Stellplatz', cost: 150000, coins: 20 },
            { id: 27, name: '12te Ab-Stellplatz', cost: 150000, coins: 20 },
            { id: 20, name: '1te Anhänger Stellplatz', cost: 75000, coins: 15 },
            { id: 21, name: '2te Anhänger Stellplatz', cost: 75000, coins: 15 },
            { id: 22, name: '3te Anhänger Stellplatz', cost: 75000, coins: 15 },
            { id: 23, name: '4te Anhänger Stellplatz', cost: 75000, coins: 15 },
            { id: 24, name: '5te Anhänger Stellplatz', cost: 75000, coins: 15 },

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
            { id: 12, name: 'Trupp Unbemannte Luftfahrtsysteme', cost: 50000, coins: 15 },
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
            { id: 6, name: 'Wasserrettung', cost: 400000, coins: 25 },
            { id: 8, name: 'Flughafenfeuerwehr', cost: 300000, coins: 25 },
            { id: 13, name: 'Werkfeuerwehr', cost: 100000, coins: 20 },
            { id: 14, name: 'Netzersatzanlage 50', cost: 100000, coins: 20 },
            { id: 16, name: 'Großlüfter', cost: 75000, coins: 25 },
            { id: 18, name: 'Drohneneinheit', cost: 150000, coins: 25 },
            { id: 19, name: 'Verpflegungsdienst', cost: 200000, coins: 25 },
            { id: 25, name: 'Bahnrettung', cost: 125000, coins: 25 },
            { id: 1, name: '1te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 2, name: '2te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 20, name: '1te Anhänger Stellplatz', cost: 75000, coins: 15 },
            { id: 21, name: '2te Anhänger Stellplatz', cost: 75000, coins: 15 },
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
    const manualStorageRooms = {
        '0_normal': [
            { initial_containers: 10, name: 'Lagerraum', cost: 25000, coins: 10, additionalStorage: 40 },
            { additional_containers_1: 20, name: '1te Zusätzlicher Lagerraum', cost: 50000, coins: 10, additionalStorage: 30 },
            { additional_containers_1: 30, name: '2te Zusätzlicher Lagerraum', cost: 50000, coins: 10, additionalStorage: 30 },
            { additional_containers_3: 40, name: '3te Zusätzlicher Lagerraum', cost: 50000, coins: 10, additionalStorage: 30 },
            { additional_containers_4: 50, name: '4te Zusätzlicher Lagerraum', cost: 50000, coins: 10, additionalStorage: 30 },
            { additional_containers_5: 60, name: '5te Zusätzlicher Lagerraum', cost: 50000, coins: 10, additionalStorage: 30 },
            { additional_containers_6: 70, name: '6te Zusätzlicher Lagerraum', cost: 50000, coins: 10, additionalStorage: 30 },
        ],

        '0_small': [
            { initial_containers: 10, name: 'Lagerraum', cost: 25000, coins: 10, additionalStorage: 40 },
            { additional_containers_1: 20, name: '1te Zusätzlicher Lagerraum', cost: 50000, coins: 10, additionalStorage: 30 },
            { additional_containers_2: 30, name: '2te Zusätzlicher Lagerraum', cost: 50000, coins: 10, additionalStorage: 30 },

        ],

        '5_normal': [ // Rettungshubschrauber-Station
            {initial_containers: 40, name: 'Lagerraum', cost: 25000, coins: 10, additionalStorage: 40 },

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
    const inProgressStorageUpgrades = new Map();
    const styles = `
  :root {
    --background-color: #f2f2f2;
    --text-color: #000;
    --border-color: #ccc;
    --button-background-color: #007bff;
    --button-text-color: #fff;
    --button-hover-background-color: #0056b3;
  }

  #extension-lightbox, #extension-settings-lightbox {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  }

  #extension-lightbox {
    background: rgba(0, 0, 0, 0.5);
  }

  #extension-lightbox-content, .settings-content {
    background: var(--background-color);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    padding: 20px;
    width: 80%;
    max-width: 1500px;
    max-height: 90vh;
    overflow-y: auto;
    text-align: center;
    position: relative;
  }

  .settings-content {
    padding: 32px;
    max-width: 600px;
    width: 95vw;
    min-width: 350px;
    border-radius: 8px;
    box-sizing: border-box;
  }

  #close-extension-helper, .cancel-button {
    position: absolute;
    top: 10px; right: 10px;
    background: red;
    color: #fff;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 4px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    font-size: 16px;
  }

  th, td {
    border: 1px solid var(--border-color);
    padding: 10px;
    text-align: center;
    vertical-align: middle;
  }

  thead {
    background-color: #f2f2f2;
    font-weight: bold;
    border-bottom: 2px solid #ccc;
  }

  .extension-button, .build-selected-button, .build-all-button, .spoiler-button {
    color: var(--button-text-color);
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 4px;
    font-size: 14px;
    transition: background-color 0.2s ease-in-out;
  }

  .extension-button { background: var(--button-background-color); }
  .extension-button:hover:enabled { background: var(--button-hover-background-color); }

  .build-selected-button { background: blue; }
  .build-all-button { background: red; }
  .build-selected-button:hover:enabled,
  .build-all-button:hover:enabled { filter: brightness(90%); }

  .spoiler-button { background: green; }

  .extension-button:disabled,
  .build-selected-button:disabled,
  .build-all-button:disabled {
    background: gray !important;
    cursor: not-allowed;
  }

  .spoiler-content { display: none; }

  .extension-search {
    width: 100%;
    padding: 8px;
    margin: 10px 0;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 14px;
  }

  .currency-selection {
    position: fixed;
    top: 50%; left: 50%;
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

  .currency-button, .credits-button, .coins-button, .cancel-button {
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 4px;
    border: none;
    color: #fff;
  }

  .credits-button { background: #28a745; }
  .coins-button { background: #dc3545; }
  .cancel-button { background: #6c757d; }

  #open-extension-helper, #extension-settings-btn {
    cursor: pointer;
  }

  #extension-settings-btn {
    background: var(--background-color);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    margin: 10px;
    padding: 6px 16px;
    border-radius: 5px;
    transition: background 0.2s;
  }

  #extension-settings-btn:hover {
    background: var(--border-color);
  }

  .tab-ext-btn, .tab-lager-btn {
    padding: 8px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.2s;
    border: none;
  }

  .tab-ext-btn {
    background: #28a745;
    color: #fff;
  }

  .tab-ext-btn:hover, .tab-ext-btn.active {
    background: #218838;
  }

  .tab-lager-btn {
    background: #ffc107;
    color: #333;
  }

  .tab-lager-btn:hover, .tab-lager-btn.active {
    background: #e0a800;
  }

  .tab-header {
    display: flex;
    gap: 2px;
    margin-bottom: 6px;
    flex-wrap: wrap;
  }

  .tab-btn {
    padding: 2px 10px;
    font-size: 13px;
    border: 1px solid var(--border-color);
    background: var(--background-color);
    color: var(--text-color);
    cursor: pointer;
    border-radius: 4px 4px 0 0;
    font-weight: 500;
    min-width: 60px;
    min-height: 24px;
    outline: none;
    transition: background 0.2s, color 0.2s;
    margin-bottom: -1px;
  }

  .tab-btn.active {
    background: #28a745;
    color: #fff;
    border-bottom: 1px solid var(--background-color);
    z-index: 1;
  }

  .tab-bodies .tab-body {
    display: none;
    padding: 8px 0;
  }

  .tab-bodies .tab-body.active {
    display: block;
  }

  .checkbox-columns {
    display: flex;
    gap: 24px;
    justify-content: flex-start;
  }

  .checkbox-column {
    display: flex;
    flex-direction: column;
    min-width: 200px;
  }

  .checkbox-column label {
    margin-bottom: 2px;
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    line-height: 1.2;
  }

  .checkbox-column br {
    display: none;
  }
`;

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

    // Erstellt das Lightbox-Interface
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
    <button id="extension-settings-btn-inline" style="background:#007bff; color:white; padding:4px 10px; border:none; border-radius:4px; font-size:0.9em; cursor:pointer;">
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

`;

    document.body.appendChild(lightbox);

    const lightboxContent = lightbox.querySelector('#extension-lightbox-content');

    // Einstellungen-Button erstellen und ins Lightbox einfügen
    const settingsButton = document.getElementById('extension-settings-btn-inline');
    settingsButton.onclick = openSettingsDialog;

    // Funktion für das Einstellungs-Dialog
    function openSettingsDialog() {
        // Falls bereits geöffnet, altes schließen
        let settingsBox = document.getElementById('extension-settings-lightbox');
        if (settingsBox) settingsBox.remove();

        settingsBox = document.createElement('div');
        settingsBox.id = 'extension-settings-lightbox';
        settingsBox.style = `
        position: fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.7); z-index:10001; display:flex; align-items:center; justify-content:center;
    `;

        const content = document.createElement('div');
        content.className = 'settings-content';
        content.innerHTML = `
  <h4 style="margin-bottom: 10px;">
        🛠️ Hier könnt ihr festlegen, welche Erweiterungen und Lagerräume pro Wachen-Typ angezeigt werden sollen.
  </h4>
        Die Auswahl wird gespeichert und beim nächsten Besuch automatisch übernommen.
  </p>
       <div style="margin-bottom: 10px;">
       <button id="tab-ext-btn" class="tab-ext-btn active">Erweiterungen</button>
       <button id="tab-lager-btn" class="tab-lager-btn">Lagerräume</button>
       </div>
       <div id="settings-tab-content" style="margin:20px 0;"></div>
       <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
       <button id="settings-save-btn" style="background:#007bff; color:white; padding:8px 20px; border:none; border-radius:5px;">
       💾 Speichern
       </button>
       <button id="settings-close-btn" style="background:#dc3545; color:white; padding:8px 20px; border:none; border-radius:5px;">
       ✖️ Schließen
       </button>
       </div>
`;

        settingsBox.appendChild(content);
        document.body.appendChild(settingsBox);

        // Tab-Logik (optisch und inhaltlich)
        const extBtn = content.querySelector('#tab-ext-btn');
        const lagerBtn = content.querySelector('#tab-lager-btn');
        const tabContent = content.querySelector('#settings-tab-content');

        function showTab(type) {
            tabContent.innerHTML = "";
            let allKeys = type === 'ext' ? Object.keys(manualExtensions) : Object.keys(manualStorageRooms);

            // Tab-Header (wie gehabt)
            let tabHeader = document.createElement('div');
            tabHeader.className = 'tab-header';
            allKeys.forEach((key, idx) => {
                let btn = document.createElement('button');
                btn.className = 'tab-btn' + (idx === 0 ? ' active' : '');
                btn.textContent = buildingTypeNames[key] || key;
                btn.dataset.key = key;
                tabHeader.appendChild(btn);
            });
            tabContent.appendChild(tabHeader);

            // Tab-Inhalte
            let tabBodies = document.createElement('div');
            tabBodies.className = 'tab-bodies';

            allKeys.forEach((key, idx) => {
                let body = document.createElement('div');
                body.className = 'tab-body' + (idx === 0 ? ' active' : '');
                body.dataset.key = key;

                let options = (type === 'ext' ? manualExtensions[key] : manualStorageRooms[key]) || [];
                if (options.length > 0) {
                    // In zwei Spalten aufteilen, wenn mehr als 11 Optionen
                    let colCount = options.length > 11 ? 2 : 1;
                    let itemsPerCol = Math.ceil(options.length / colCount);
                    let columns = [];
                    for (let c = 0; c < colCount; c++) {
                        columns[c] = document.createElement('div');
                        columns[c].className = 'checkbox-column';
                    }
                    options.forEach((opt, i) => {
                        let col = Math.floor(i / itemsPerCol);
                        let id = type === 'ext'
                        ? opt.id
                        : Object.keys(opt).find(k => k.endsWith('_containers') || k === 'initial_containers');
                        let lsKey = type === 'ext'
                        ? `ext_${key}_${id}`
                        : `lager_${key}_${id}`;
                        let checked = localStorage.getItem(lsKey) !== '0' ? 'checked' : '';
                        let optionName = opt.name || opt.caption || id;
                        let label = document.createElement('label');
                        // WICHTIG: data-id für Lager!
                        label.innerHTML = `<input type="checkbox" data-key="${key}" data-id="${id}"
                      class="${type === 'ext' ? 'setting-ext' : 'setting-lager'}" ${checked}>
                    ${optionName}`;
                        columns[col].appendChild(label);
                        columns[col].appendChild(document.createElement('br'));
                    });
                    let columnsContainer = document.createElement('div');
                    columnsContainer.className = 'checkbox-columns';
                    columns.forEach(col => columnsContainer.appendChild(col));
                    body.appendChild(columnsContainer);
                } else {
                    body.innerHTML = '<em>Keine Optionen</em>';
                }
                tabBodies.appendChild(body);
            });
            tabContent.appendChild(tabBodies);

            // Tab-Logik
            tabHeader.addEventListener('click', function(e) {
                if (e.target.classList.contains('tab-btn')) {
                    tabHeader.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                    e.target.classList.add('active');
                    let key = e.target.dataset.key;
                    tabBodies.querySelectorAll('.tab-body').forEach(div => {
                        div.classList.toggle('active', div.dataset.key === key);
                    });
                }
            });
        }
        extBtn.onclick = () => showTab('ext');
        lagerBtn.onclick = () => showTab('lager');

        // Standard: Erweiterungen anzeigen
        showTab('ext');

        // Speichern
        content.querySelector('#settings-save-btn').onclick = () => {
            tabContent.querySelectorAll('.setting-ext').forEach(cb => {
                const lsKey = `ext_${cb.dataset.key}_${cb.dataset.id}`;
                localStorage.setItem(lsKey, cb.checked ? '1' : '0');
            });
            tabContent.querySelectorAll('.setting-lager').forEach(cb => {
                const lsKey = `lager_${cb.dataset.key}_${cb.dataset.id}`;
                localStorage.setItem(lsKey, cb.checked ? '1' : '0');
            });
            settingsBox.remove();
            location.reload();
        };

        // Nur schließen (ohne speichern)
        content.querySelector('#settings-close-btn').onclick = () => {
            settingsBox.remove();
        };
    }

    // Button mit Dialog verknüpfen
    settingsButton.onclick = openSettingsDialog;

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

        // Prüft, ob eine Erweiterung angezeigt werden soll
        function isExtensionEnabled(key, id) {
            // Standard: Sichtbar, solange nicht explizit im localStorage auf "0"
            return localStorage.getItem(`ext_${key}_${id}`) !== '0';
        }

        // Prüft, ob ein Lager angezeigt werden soll
        function isLagerEnabled(key, lagerKey) {
            // Standard: Sichtbar, solange nicht explizit im localStorage auf "0"
            return localStorage.getItem(`lager_${key}_${lagerKey}`) !== '0';
        }
        const userInfo = await getUserCredits();
        const list = document.getElementById('extension-list');
        list.innerHTML = ''; // Lösche den Inhalt der Lightbox

        // Setze die globalen Variablen zurück
        buildingGroups = {};
        buildingsData = buildings;

        buildings.sort((a, b) => {
            if (a.building_type === b.building_type) {
                return a.caption.localeCompare(b.caption);
            }
            return a.building_type - b.building_type;
        });

        buildings.forEach(building => {
            console.log('StorageUpgrades:', building.caption, building.storageUpgrades);
            const buildingTypeKey = `${building.building_type}_${building.small_building ? 'small' : 'normal'}`;
            // Erweiterungen gemäß User-Einstellungen filtern
            const extensionsRaw = manualExtensions[buildingTypeKey];
            if (!extensionsRaw) return;
            const extensions = extensionsRaw.filter(ext => isExtensionEnabled(buildingTypeKey, ext.id));

            const existingExtensions = new Set(building.extensions.map(e => e.type_id));

            const allowedExtensions = extensions.filter(extension => {
                if (isExtensionLimitReached(building, extension.id)) {
                    return false;
                }

                // Spezifische Erweiterungen ausblenden, wenn bereits eine der relevanten Erweiterungen vorhanden ist
                if (building.building_type === 6 && building.small_building) { // Polizeiwache (Kleinwache)
                    const forbiddenExtensions = [10, 11, 12, 13];
                    if (forbiddenExtensions.some(id => existingExtensions.has(id))) {
                        return !forbiddenExtensions.includes(extension.id);
                    }
                }

                if (building.building_type === 0 && building.small_building) { // Feuerwache (Kleinwache)
                    const forbiddenExtensions = [0, 6, 8, 13, 14, 16, 18, 19, 25];
                    if (forbiddenExtensions.some(id => existingExtensions.has(id))) {
                        return !forbiddenExtensions.includes(extension.id);
                    }
                }

                return !existingExtensions.has(extension.id);
            });

            if (allowedExtensions.length > 0 || ['0_normal', '0_small', '5_normal'].includes(buildingTypeKey)) {
                if (!buildingGroups[buildingTypeKey]) {
                    buildingGroups[buildingTypeKey] = [];
                }
                buildingGroups[buildingTypeKey].push({ building, missingExtensions: allowedExtensions });
            }
        });

        function createHeader(titleText) {
            const header = document.createElement('h4');
            header.textContent = titleText;
            header.classList.add('building-header');
            return header;
        }

        function createButton(text, classList, onClick, styles = {}) {
            const button = document.createElement('button');
            button.textContent = text;
            button.classList.add('btn', ...classList);
            Object.assign(button.style, styles);
            if (onClick) button.onclick = onClick;
            return button;
        }

        function createTable(headers, groupKey) {
            const table = document.createElement('table');
            table.innerHTML = `
        <thead style="background-color: #f2f2f2; font-weight: bold; border-bottom: 2px solid #ccc;">
            <tr>
                ${headers.map(h => `<th style="${h.style || 'padding: 10px; text-align: center; vertical-align: middle;'}">${h.html}</th>`).join('')}
            </tr>
        </thead>
        <tbody></tbody>
    `;
            return { table, tbody: table.querySelector('tbody') };
        }

        function createSearchInput(placeholderText) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = placeholderText;
            Object.assign(input.style, {
                width: '100%',
                marginBottom: '10px',
                padding: '5px',
                fontSize: '14px',
                display: 'block'
            });
            return input;
        }

        // Hilfsfunktionen
        function createRow(cells, rowClass = '', dataAttributes = {}) {
            const row = document.createElement('tr');
            if (rowClass) row.className = rowClass;
            Object.entries(dataAttributes).forEach(([key, value]) => row.dataset[key] = value);

            cells.forEach(content => {
                const td = document.createElement('td');
                td.style.textAlign = 'center';
                td.style.verticalAlign = 'middle';
                if (content instanceof HTMLElement) td.appendChild(content);
                else td.textContent = content;
                row.appendChild(td);
            });

            return row;
        }

        function createSpoilerWrapper(button, wrapper, showText, hideText) {
            button.addEventListener('click', () => {
                const visible = wrapper.style.display === 'block';
                wrapper.style.display = visible ? 'none' : 'block';
                button.textContent = visible ? showText : hideText;
            });
        }

        function addStorageRoomsSection(group, groupKey, buttonContainer, list) {
            const storageGroup = manualStorageRooms[groupKey];
            if (!storageGroup) return;

            const storageButton = createButton('Lagerräume anzeigen', ['spoiler-button'], null, {
                backgroundColor: '#ffc107', color: 'black'
            });
            buttonContainer.insertBefore(storageButton, buttonContainer.children[1]);

            const wrapper = document.createElement('div');
            wrapper.className = 'spoiler-content';
            wrapper.style.display = 'none';

            const searchInput = createSearchInput("🔍 Lagerräume durchsuchen...");
            wrapper.appendChild(searchInput);


            const { table, tbody } = createTable([
                { html: `An- / Abwählen<br><input type="checkbox" class="select-all-checkbox" data-group="${groupKey}">` },
                { html: 'Leitstelle' }, { html: 'Wache' }, { html: 'Lagertyp' },
                { html: 'Kapazität' }, { html: 'Bauen mit Credits' }, { html: 'Bauen mit Coins' }
            ], groupKey);
            wrapper.appendChild(table);

            // <--- HIER EINBAUEN!
            const selectAll = table.querySelector('.select-all-checkbox');
            if (selectAll) {
                selectAll.addEventListener('change', function () {
                    const checkboxes = table.querySelectorAll('.storage-checkbox');
                    checkboxes.forEach(cb => {
                        if (!cb.disabled && cb.offsetParent !== null) cb.checked = this.checked;
                    });
                    updateBuildSelectedButton();
                });
            }

            searchInput.addEventListener('input', () => {
                filterTable(tbody, searchInput.value.toLowerCase());
            });

            group.forEach(({ building }) => {
                storageGroup
                    .filter(storage => {
                    // Lager-Key erkennen (initial_containers oder additional_containers_X)
                    const lagerKey = Object.keys(storage).find(k => k.endsWith('_containers') || k === 'initial_containers');
                    return isLagerEnabled(groupKey, lagerKey);
                })
                    .forEach(storage => {
                    const lagerKey = Object.keys(storage).find(k => k.endsWith('_containers') || k === 'initial_containers');
                    const canBuild = canBuildStorage(building, lagerKey);

                    // Checkbox
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'storage-checkbox';
                    checkbox.dataset.buildingId = building.id;
                    checkbox.dataset.lagerKey = lagerKey;
                    checkbox.disabled = !canBuild;
                    checkbox.dataset.group = groupKey;

                    // Bau-Buttons
                    const creditButton = createButton(
                        `${formatNumber(storage.cost)} Credits`,
                        ['btn-xl', 'credit-button'],
                        () => buildStorage(building, lagerKey, 'credits', storage.cost),
                        { backgroundColor: '#28a745', color: 'white' }
                    );
                    creditButton.disabled = !canBuild;

                    const coinsButton = createButton(
                        `${storage.coins} Coins`,
                        ['btn-xl', 'coins-button'],
                        () => buildStorage(building, lagerKey, 'coins', storage.coins),
                        { backgroundColor: '#dc3545', color: 'white' }
                    );
                    coinsButton.disabled = !canBuild;

                    // Tabellenzeile erzeugen
                    const row = createRow([
                        checkbox,
                        getLeitstelleName(building),
                        building.caption,
                        storage.name,
                        storage.additionalStorage ?? storage.initial_containers ?? "",
                        creditButton,
                        coinsButton
                    ]);

                    tbody.appendChild(row);
                });
            });

            createSpoilerWrapper(storageButton, wrapper, 'Lagerräume anzeigen', 'Lagerräume ausblenden');
            list.appendChild(wrapper);
        }

        // Hauptfunktion
        Object.keys(buildingGroups).forEach(groupKey => {
            const group = buildingGroups[groupKey];
            const buildingType = buildingTypeNames[groupKey] || 'Unbekannt';
            list.appendChild(createHeader(buildingType));

            const buttonContainer = document.createElement('div');
            Object.assign(buttonContainer.style, { display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' });
            list.appendChild(buttonContainer);

            const spoilerButton = createButton('Erweiterungen anzeigen', ['spoiler-button']);
            const buildSelectedButton = createButton(
                'Ausgewählte Erweiterungen bauen',
                ['build-selected-button'],
                () => buildSelectedExtensions(groupKey)
            );
            buildSelectedButton.dataset.group = groupKey;
            buildSelectedButton.disabled = true;
            const buildAllButton = createButton('Sämtliche Erweiterungen bei allen Wachen bauen', ['build-all-button'], () => showCurrencySelectionForAll(groupKey));

            [spoilerButton, buildSelectedButton, buildAllButton].forEach(btn => buttonContainer.appendChild(btn));

            if (['0_normal', '0_small', '5_normal'].includes(groupKey)) {
                addStorageRoomsSection(group, groupKey, buttonContainer, list);
            }

            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'spoiler-content';
            contentWrapper.style.display = 'none';
            createSpoilerWrapper(spoilerButton, contentWrapper, 'Erweiterungen anzeigen', 'Erweiterungen ausblenden');

            const searchInput = createSearchInput("🔍 Hier könnt Ihr nach Leistellen, Wachen oder Erweiterungen suchen...");
            const { table, tbody } = createTable([
                { html: `Alle An- / Abwählen<br><input type="checkbox" class="select-all-checkbox" data-group="${groupKey}">` },
                { html: 'Leitstelle' }, { html: 'Wachen' }, { html: 'Baubare Erweiterungen' },
                { html: 'Bauen mit Credits' }, { html: 'Bauen mit Coins' }
            ], groupKey);
            contentWrapper.appendChild(searchInput);
            contentWrapper.appendChild(table);
            list.appendChild(contentWrapper);

            searchInput.addEventListener('input', () => filterTable(tbody, searchInput.value.toLowerCase()));

            table.querySelector('.select-all-checkbox').addEventListener('change', function () {
                const checkboxes = table.querySelectorAll('.extension-checkbox');
                checkboxes.forEach(cb => {
                    if (!cb.disabled && cb.offsetParent !== null) cb.checked = this.checked;
                });
                updateBuildSelectedButton();
            });

            group.forEach(({ building, missingExtensions }) => {
                missingExtensions.forEach(extension => {
                    if (isExtensionLimitReached(building, extension.id)) return;

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'extension-checkbox';
                    checkbox.dataset.buildingId = building.id;
                    checkbox.dataset.extensionId = extension.id;
                    checkbox.disabled = userInfo.credits < extension.cost && userInfo.coins < extension.coins;
                    checkbox.addEventListener('change', updateBuildSelectedButton);
                    checkbox.dataset.group = groupKey;

                    const creditButton = createButton(
                        `${formatNumber(extension.cost)} Credits`,
                        ['btn-xl', 'credit-button'],
                        () => buildExtension(building, extension.id, 'credits', extension.cost),
                        { backgroundColor: '#28a745', color: 'white' }
                    );
                    creditButton.disabled = userInfo.credits < extension.cost;

                    const coinsButton = createButton(
                        `${extension.coins} Coins`,
                        ['btn-xl', 'coins-button'],
                        () => buildExtension(building, extension.id, 'coins', extension.coins),
                        { backgroundColor: '#dc3545', color: 'white' }
                    );
                    coinsButton.disabled = userInfo.coins < extension.coins;

                    const row = createRow([
                        checkbox, getLeitstelleName(building), building.caption, extension.name,
                        creditButton, coinsButton
                    ], `row-${building.id}-${extension.id}`);

                    tbody.appendChild(row);
                });
            });
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

    // Funktion zur Filterungen der Tabelleninhalten
    function filterTable(tbody, searchTerm) {
        const rows = tbody.querySelectorAll("tr");
        searchTerm = searchTerm.toLowerCase();

        rows.forEach(row => {
            const cells = Array.from(row.cells).map(cell => cell.textContent.toLowerCase());
            const isBuilt = row.classList.contains("built");

            const matchesSearch = cells.some(text => text.includes(searchTerm));

            row.style.display = (!isBuilt && matchesSearch) ? "" : "none";
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

        const extension = building.extensions_available?.find(ext => ext.id === extensionId);
        const extensionIdCaption = extension?.caption;

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

        // 🔁 Erweiterungsabhängigkeiten für Lagerraum
        const containerDependencies = {
            'initial_containers': null, // immer erlaubt
            'additional_containers_1': 'initial_containers',
            'additional_containers_2': 'additional_containers_1',
            'additional_containers_3': 'additional_containers_2',
            'additional_containers_4': 'additional_containers_3',
            'additional_containers_5': 'additional_containers_4',
            'additional_containers_6': 'additional_containers_5',
        };

        function getExtensionCaption(extensionId, building) {
            const ext = building.extensions_available?.find(e => e.id === extensionId);
            return ext?.caption || null;
        }

        function hasExtensionCaption(building, caption) {
            return building.extensions.some(ext => ext.caption === caption);
        }

        const caption = getExtensionCaption(extensionId, building);

        // Wenn es sich um Lagerraum-Erweiterung handelt
        if (caption && containerDependencies.hasOwnProperty(caption)) {
            const requiredCaption = containerDependencies[caption];

            // initial_containers ist immer erlaubt (requiredCaption === null)
            if (requiredCaption === null) return false;

            // Prüfe, ob vorherige Erweiterung gebaut wurde
            if (!hasExtensionCaption(building, requiredCaption)) return true;
        }

        return false;
    }

    // Funktion zur Überprüfung zum Bau der Lagerräume
    function canBuildStorage(building, storageKey) {
        const buildOrder = [
            'initial_containers',
            'additional_containers_1',
            'additional_containers_2',
            'additional_containers_3',
            'additional_containers_4',
            'additional_containers_5',
            'additional_containers_6'
        ];

        const index = buildOrder.indexOf(storageKey);
        if (index === -1 || index === 0) return true;

        const previousKey = buildOrder[index - 1];

        // Prüfen, ob vorheriger Typ gebaut wurde oder bereits im Bau ist
        const builtStorage = building.builtStorage || [];
        const isAlreadyBuilt = builtStorage.includes(previousKey);

        const isInProgress =
              inProgressStorageUpgrades.has(building.id) &&
              inProgressStorageUpgrades.get(building.id).has(previousKey);

        return isAlreadyBuilt || isInProgress;
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    // Anfang des Bereichs für den Bau einer Erweiterung oder eines Lager

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

    // Funktion zum Bau eines Lagerraums
    async function buildStorage(building, storageKey, currency, cost, row) {
    // Gibt das passende Lagerobjekt aus manualStorageRooms zurück
    function getStorageEntryByKey(key) {
        for (const group in manualStorageRooms) {
            for (const entry of manualStorageRooms[group]) {
                const entryKey = Object.keys(entry)[0];
                if (entryKey === key) {
                    return { ...entry, key: entryKey };
                }
            }
        }
        return null;
    }

    // Findet den nächsten noch nicht gebauten zusätzlichen Lagerraum
    function getNextAdditionalStorage(building, groupKey) {
        const built = new Set(building.storage_upgrades || []);
        const entries = manualStorageRooms[groupKey] || [];
        return entries.find(e => !built.has(Object.keys(e)[0]));
    }

    // Gruppenschlüssel (z. B. "0_normal", "0_small", …) aus Gebäude-Typ ermitteln
    function getGroupKeyForBuilding(building) {
        // Beispielhafte Logik – ggf. anpassen!
        if (building.building_type === 5) return '5_normal'; // Rettungshubschrauber
        if (building.level < 5) return '0_small';
        return '0_normal';
    }

    const groupKey = getGroupKeyForBuilding(building);
    let entry;

    // Falls storageKey nur ein Platzhalter ist (z. B. "additional_containers")
    if (storageKey === 'additional_containers') {
        entry = getNextAdditionalStorage(building, groupKey);
        if (!entry) {
            alert("Alle zusätzlichen Lagerräume wurden bereits gebaut.");
            return;
        }
    } else {
        entry = getStorageEntryByKey(storageKey);
        if (!entry) {
            alert(`Unbekannte Lagererweiterung: ${storageKey}`);
            return;
        }
    }

    const typeName = entry.key;
    const readableName = entry.name;

    if (!canBuildStorage(building, typeName)) {
        alert(`Die Erweiterung "${readableName}" kann nicht gebaut werden, da die vorherige Lagererweiterung fehlt.`);
        return;
    }

    const csrfToken = getCSRFToken();
    const buildUrl = `/buildings/${building.id}/storage_upgrade/${currency}/${typeName}?redirect_building_id=${building.id}`;

    await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'POST',
            url: buildUrl,
            headers: {
                'X-CSRF-Token': csrfToken,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            onload: function (response) {
                console.log(`Lagerraum "${typeName}" (${currency}) für Gebäude ${building.id} gebaut.`);

                if (!inProgressStorageUpgrades.has(building.id)) {
                    inProgressStorageUpgrades.set(building.id, new Set());
                }
                inProgressStorageUpgrades.get(building.id).add(typeName);

                if (row) {
                    row.classList.add("built");
                    row.style.backgroundColor = '#d4edda';
                    row.style.transition = 'opacity 0.5s ease';
                    row.style.opacity = '0.5';

                    setTimeout(() => {
                        row.remove();
                    }, 1000);
                }

                resolve(response);
            },
            onerror: function (error) {
                console.error(`Fehler beim Bauen von "${readableName}" in Gebäude ${building.id}.`, error);
                alert(`Der Lagerbau "${readableName}" mit ${currency} ist fehlgeschlagen. Bitte versuche es erneut.`);
                reject(error);
            }
        });
    });
}


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
        // Alle angehakten Erweiterungs- und Lagerraum-Checkboxen sammeln
        const selectedExtensionCheckboxes = document.querySelectorAll('.extension-checkbox:checked');
        const selectedStorageCheckboxes = document.querySelectorAll('.storage-checkbox:checked');

        // Erweiterungen nach Gebäude gruppieren
        const selectedExtensionsByBuilding = {};
        selectedExtensionCheckboxes.forEach(checkbox => {
            const buildingId = checkbox.dataset.buildingId;
            const extensionId = checkbox.dataset.extensionId;
            if (!selectedExtensionsByBuilding[buildingId]) selectedExtensionsByBuilding[buildingId] = [];
            selectedExtensionsByBuilding[buildingId].push(parseInt(extensionId, 10));
        });

        // Lagerräume nach Gebäude gruppieren
        const selectedStorageByBuilding = {};
        selectedStorageCheckboxes.forEach(checkbox => {
            const buildingId = checkbox.dataset.buildingId;
            const lagerKey = checkbox.dataset.lagerKey;
            if (!selectedStorageByBuilding[buildingId]) selectedStorageByBuilding[buildingId] = [];
            selectedStorageByBuilding[buildingId].push(lagerKey);
        });

        // Bei Kleinwachen: Validierung für maximal erlaubte Erweiterungen (wie bisher)
        for (const [buildingId, extensions] of Object.entries(selectedExtensionsByBuilding)) {
            const building = buildingsData.find(b => String(b.id) === String(buildingId));
            if (!building) continue;
            if (building.small_building) {
                if (building.building_type === 0) {
                    const invalidCombinationsFeuerwache = [0, 6, 8, 13, 14, 16, 18, 19, 25];
                    const selectedInvalid = extensions.filter(id => invalidCombinationsFeuerwache.includes(id));
                    if (selectedInvalid.length > 1) {
                        showError("Für die Feuerwache (Kleinwache) darf nur eine Spezial-Erweiterung gewählt werden.");
                        updateBuildSelectedButton();
                        return;
                    }
                }
                if (building.building_type === 6) {
                    const invalidCombinationsPolizei = [10, 11, 12, 13];
                    const selectedInvalid = extensions.filter(id => invalidCombinationsPolizei.includes(id));
                    if (selectedInvalid.length > 1) {
                        showError("Für die Polizeiwache (Kleinwache) darf nur eine Spezial-Erweiterung gewählt werden.");
                        updateBuildSelectedButton();
                        return;
                    }
                }
            }
        }

        // Premium-Check: Bei Nicht-Premium max. 2 Erweiterungen auf einmal
        if (!user_premium) {
            for (const [buildingId, extensions] of Object.entries(selectedExtensionsByBuilding)) {
                if (extensions.length > 2) {
                    alert(`Ohne Premium-Account kannst du pro Gebäude nur 2 Erweiterungen gleichzeitig bauen.`);
                    updateBuildSelectedButton();
                    return;
                }
            }
        }

        // Währungsabfrage (Credits/Coins) – wir gehen davon aus, dass Erweiterungen und Lagerräume mit Credits gebaut werden sollen
        const userInfo = await getUserCredits();

        // Gesamtkosten berechnen (du kannst auch Coins analog hinzufügen, falls gewünscht)
        let totalCredits = 0;
        // Erweiterungen
        // Erweiterungen bauen
        for (const [buildingId, extensions] of Object.entries(selectedExtensionsByBuilding)) {
            const building = buildingsData.find(b => String(b.id) === String(buildingId));
            if (!building) continue;

            for (const extensionId of extensions) {
                try {
                    await buildExtension(building, extensionId, 'credits');
                    builtCount++;
                    updateProgressBar(progressFill, progressText, builtCount, totalCount);
                } catch (e) {
                    console.error(`Fehler beim Bau der Erweiterung ${extensionId} für Gebäude ${buildingId}`, e);
                }
            }
        }

        // Lagerräume bauen
        for (const [buildingId, lagerKeys] of Object.entries(selectedStorageByBuilding)) {
            const building = buildingsData.find(b => String(b.id) === String(buildingId));
            if (!building) continue;

            for (const lagerKey of lagerKeys) {
                try {
                    await buildStorage(building, lagerKey, 'credits');
                    builtCount++;
                    updateProgressBar(progressFill, progressText, builtCount, totalCount);
                } catch (e) {
                    console.error(`Fehler beim Bau des Lagerraums ${lagerKey} für Gebäude ${buildingId}`, e);
                }
            }
        }

        // Nach Abschluss:
        alert('Bau abgeschlossen!');
        updateBuildSelectedButton();

        // Prüfen ob User genug Credits hat
        if (userInfo.credits < totalCredits) {
            alert(`Du hast nicht genug Credits (${formatNumber(totalCredits)} benötigt).`);
            updateBuildSelectedButton();
            return;
        }

        // Währungsdialog überspringen (immer Credits) – Wenn Coins-Option gewünscht ist, bitte Bescheid geben!
        // Fortschrittsanzeige (optional)
        const totalCount =
              Object.values(selectedExtensionsByBuilding).reduce((a, b) => a + b.length, 0) +
              Object.values(selectedStorageByBuilding).reduce((a, b) => a + b.length, 0);

        let builtCount = 0;
        const { progressContainer, progressText, progressFill } = await createProgressBar(totalCount);

        // Erweiterungen bauen
        for (const [buildingId, extensions] of Object.entries(selectedExtensionsByBuilding)) {
            const building = buildingsData.find(b => String(b.id) === String(buildingId));
            for (const extensionId of extensions) {
                const row = document.querySelector(`.row-${buildingId}-${extensionId}`);
                const extensionCost = row ? parseInt(row.querySelector('.credit-button').innerText.replace(/\D/g, ''), 10) : 0;
                await buildExtension(building, extensionId, 'credits', extensionCost, row);
                builtCount++;
                updateProgress(builtCount, totalCount, progressText, progressFill);
            }
        }

        // Lagerräume bauen
        for (const [buildingId, lagerKeys] of Object.entries(selectedStorageByBuilding)) {
            const building = buildingsData.find(b => String(b.id) === String(buildingId));
            for (const lagerKey of lagerKeys) {
                const selector = `.storage-checkbox[data-building-id="${buildingId}"][data-lager-key="${lagerKey}"]`;
                const row = document.querySelector(selector)?.closest('tr');
                const storageCost = row ? parseInt(row.querySelector('.credit-button').innerText.replace(/\D/g, ''), 10) : 0;
                await buildStorage(building, lagerKey, 'credits', storageCost, row);
                builtCount++;
                updateProgress(builtCount, totalCount, progressText, progressFill);
            }
        }

        removeProgressBar(progressContainer);

        // Nach dem Bau: Tabelle aktualisieren
        renderMissingExtensions(buildingsData);

        // Checkboxen abwählen und Button deaktivieren
        document.querySelectorAll('.extension-checkbox, .storage-checkbox').forEach(cb => cb.checked = false);
        updateBuildSelectedButton();
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

    function updateBuildSelectedButton() {
        document.querySelectorAll('.build-selected-button').forEach(btn => {
            const groupKey = btn.dataset.group;
            const anySelected = document.querySelector(
                `.extension-checkbox[data-group="${groupKey}"]:checked,
             .storage-checkbox[data-group="${groupKey}"]:checked`
            );
            btn.disabled = !anySelected;
        });
    }

    // Event-Listener für Checkbox-Änderungen hinzufügen
    document.addEventListener('change', (event) => {
        if (
            event.target.classList.contains('extension-checkbox') ||
            event.target.classList.contains('storage-checkbox')
        ) {
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

})();
