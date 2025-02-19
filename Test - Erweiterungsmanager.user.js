// ==UserScript==
// @name         [LSS] Erweiterungs-Manager (Betaversion)
// @namespace    http://tampermonkey.net/
// @version      0.5 (Beta)
// @description  Listet Wachen auf, bei denen bestimmte Erweiterungen fehlen und ermöglicht das Hinzufügen dieser Erweiterungen.
// @author       Caddy21
// @match        https://www.leitstellenspiel.de/
// @grant        GM_xmlhttpRequest
// @connect      api.lss-manager.de
// @connect      leitstellenspiel.de
// @icon         https://github.com/Caddy21/-docs-assets-css/raw/main/yoshi_icon__by_josecapes_dgqbro3-fullview.png
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    // Manuelle Konfiguration der Erweiterungen

    // Hier könnt Ihr auswählen welche Erweiterung in der Tabelle angezeigt werden soll, dafür die nicht benötigten einfach mit // ausklammern.
    const manualExtensions = {
        '0_normal': [ // Feuerwache (normal)
            //            { id: 0, name: 'Rettungsdienst', cost: 100000, coins: 20 },
            //            { id: 1, name: 'AB-Stellplatz', cost: 100000, coins: 20 },
            //            { id: 2, name: 'AB-Stellplatz', cost: 100000, coins: 20 },
            //            { id: 3, name: 'AB-Stellplatz', cost: 100000, coins: 20 },
            //            { id: 4, name: 'AB-Stellplatz', cost: 100000, coins: 20 },
            //            { id: 5, name: 'AB-Stellplatz', cost: 100000, coins: 20 },
            //            { id: 6, name: 'Wasserrettung', cost: 400000, coins: 25 },
            //            { id: 7, name: 'AB-Stellplatz', cost: 100000, coins: 20 },
            //            { id: 8, name: 'Flughafenfeuerwehr', cost: 300000, coins: 25 },
            //            { id: 9, name: 'Großwache', cost: 1000000, coins: 50 },
            //            { id: 10, name: 'AB-Stellplatz', cost: 100000, coins: 20 },
            //            { id: 11, name: 'AB-Stellplatz', cost: 100000, coins: 20 },
            //            { id: 12, name: 'AB-Stellplatz', cost: 100000, coins: 20 },
            //            { id: 13, name: 'Werkfeuerwehr', cost: 100000, coins: 20 },
            //            { id: 14, name: 'Netzersatzanlage 50', cost: 100000, coins: 20 },
            { id: 15, name: 'Netzersatzanlage 200', cost: 100000, coins: 20 },
            { id: 16, name: 'Großlüfter', cost: 75000, coins: 25 },
            { id: 17, name: 'AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 18, name: 'Drohneneinheit', cost: 150000, coins: 25 },
            { id: 19, name: 'Verpflegungsdienst', cost: 200000, coins: 25 },
            { id: 20, name: 'Anhänger Stellplatz', cost: 75000, coins: 15 },
            { id: 21, name: 'Anhänger Stellplatz', cost: 75000, coins: 15 },
            { id: 22, name: 'Anhänger Stellplatz', cost: 75000, coins: 15 },
            { id: 23, name: 'Anhänger Stellplatz', cost: 75000, coins: 15 },
            { id: 24, name: 'Anhänger Stellplatz', cost: 75000, coins: 15 },
            { id: 25, name: 'Bahnrettung', cost: 125000, coins: 25 },
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
            { id: 0, name: 'Zelle', cost: 25000, coins: 5 },
            { id: 1, name: 'Zelle', cost: 25000, coins: 5 },
            { id: 2, name: 'Zelle', cost: 25000, coins: 5 },
            { id: 3, name: 'Zelle', cost: 25000, coins: 5 },
            { id: 4, name: 'Zelle', cost: 25000, coins: 5 },
            { id: 5, name: 'Zelle', cost: 25000, coins: 5 },
            { id: 6, name: 'Zelle', cost: 25000, coins: 5 },
            { id: 7, name: 'Zelle', cost: 25000, coins: 5 },
            { id: 8, name: 'Zelle', cost: 25000, coins: 5 },
            { id: 9, name: 'Zelle', cost: 25000, coins: 5 },
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
            { id: 1, name: 'AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 2, name: 'AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 3, name: 'Wasserrettung', cost: 400000, coins: 25 },
            { id: 4, name: 'Flughafenfeuerwehr', cost: 300000, coins: 25 },
            { id: 5, name: 'Werkfeuerwehr', cost: 100000, coins: 20 },
            { id: 6, name: 'Netzersatzanlage 50', cost: 100000, coins: 20 },
            { id: 7, name: 'Großlüfter', cost: 75000, coins: 25 },
            { id: 8, name: 'Drohneneinheit', cost: 150000, coins: 25 },
            { id: 9, name: 'Verpflegungsdienst', cost: 200000, coins: 25 },
            { id: 10, name: 'Anhänger Stellplatz', cost: 75000, coins: 15 },
            { id: 11, name: 'Anhänger Stellplatz', cost: 75000, coins: 15 },
            { id: 12, name: 'Bahnrettung', cost: 125000, coins: 25 },
        ],

        '6_small': [ // Polizei (Kleinwache)
            { id: 0, name: 'Zelle', cost: 25000, coins: 5 },
            { id: 1, name: 'Zelle', cost: 25000, coins: 5 },
            //            { id: 10, name: 'Diensthundestaffel', cost: 100000, coins: 10 },
            //            { id: 11, name: 'Kriminalpolizei', cost: 100000, coins: 20 },
            //            { id: 12, name: 'Dienstgruppenleitung', cost: 200000, coins: 25 },
            //            { id: 13, name: 'Motorradstaffel', cost: 75000, coins: 15 },
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

    // Ab hier nichts mehr ändern! (Es sei denn Ihr wisst was Ihr tut)

    // Stile für das Interface
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
            max-width: 1200px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
        }
        #extension-lightbox #extension-lightbox-content.dark {
            background: #2c2f33;
            color: #ffffff;
            border-color: #23272a;
        }
        #extension-lightbox #extension-lightbox-content.light {
            background: #ffffff;
            color: #000000;
            border-color: #dddddd;
        }
        #extension-lightbox #close-extension-helper {
            position: absolute;
            top: 10px;
            right: 10px;
            background: red;
            color: white;
            border: none;
            padding: 5px;
            cursor: pointer;
        }
        :root {
            --background-color: #f2f2f2;  /* Standard Light Mode Hintergrund */
            --text-color: #000;           /* Standard Light Mode Textfarbe */
            --border-color: #ccc;         /* Standard Light Mode Randfarbe */
        }
        #extension-lightbox table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 16px;
        }
        #extension-lightbox table th,
        #extension-lightbox table td {
            background-color: var(--background-color);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            padding: 8px;
            text-align: left;
        }
        #extension-lightbox table th {
            font-weight: bold;
        }
        #extension-lightbox .extension-button {
            background-color: var(--button-background-color, #007bff);
            color: var(--button-text-color, #ffffff);
            border: none;
            padding: 5px 10px;
            cursor: pointer;
            border-radius: 4px;
        }
        #extension-lightbox .extension-button:disabled {
            background-color: gray;
            cursor: not-allowed;
        }
        #extension-lightbox .extension-button:hover:enabled {
            background-color: var(--button-hover-background-color, #0056b3);
        }
        #extension-lightbox .build-all-button {
            background-color: red; /* Always red */
            color: var(--button-text-color, #ffffff);
            border: none;
            padding: 5px 10px;
            cursor: pointer;
            border-radius: 4px;
            margin-top: 10px;
        }
        #extension-lightbox .build-all-button:disabled {
            background-color: gray;
            cursor: not-allowed;
        }
        #extension-lightbox .build-all-button:hover:enabled {
            background-color: red; /* Keep it red on hover */
        }
        #extension-lightbox .spoiler-button {
            background-color: green;
            color: #ffffff;
            border: none;
            padding: 5px 10px;
            cursor: pointer;
            border-radius: 4px;
            margin-top: 10px;
        }
        #extension-lightbox .spoiler-content {
            display: none;
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
    `;

    // Funktion zum Abrufen der Benutzereinstellungen vom API
    async function getUserMode() {
        try {
            console.log("Versuche, Benutzereinstellungen von der API abzurufen...");
            const response = await fetch('https://www.leitstellenspiel.de/api/settings');
            const data = await response.json();
            console.log("Benutzereinstellungen abgerufen:", data);
            return data; // Gibt die vollständige Antwort zurück
        } catch (error) {
            console.error("Fehler beim Abrufen der Einstellungen: ", error);
            return null;
        }
    }

    // Funktion zum Anwenden des Dark- oder Light-Modus basierend auf der API-Antwort
    async function applyMode() {
        console.log("Wende Modus an...");

        const userSettings = await getUserMode();
        if (!userSettings) {
            console.log("Keine Benutzereinstellungen gefunden oder Fehler beim Abrufen.");
            return;
        }

        const mode = userSettings.design_mode; // Benutze jetzt "design_mode" anstelle von "mode"
        console.log("Aktueller Design-Modus:", mode);

        // Warten auf das Lightbox-Element
        const lightboxContent = document.getElementById('extension-lightbox-content');
        if (!lightboxContent) {
            console.log("Lightbox-Inhalt nicht gefunden.");
            return;
        }

        console.log("Lightbox-Inhalt gefunden, entferne alte Modus-Klassen...");
        // Entferne alle möglichen Modus-Klassen
        lightboxContent.classList.remove('dark', 'light');

        // Modus anwenden
        if (mode === 1 || mode === 4) { // Dunkelmodus
            console.log("Dunkelmodus aktivieren...");
            lightboxContent.classList.add('dark');

            // Dark Mode für Tabelle
            document.documentElement.style.setProperty('--background-color', '#333');
            document.documentElement.style.setProperty('--text-color', '#fff');
            document.documentElement.style.setProperty('--border-color', '#444');
        } else if (mode === 2 || mode === 3) { // Hellmodus
            console.log("Hellmodus aktivieren...");
            lightboxContent.classList.add('light');

            // Light Mode für Tabelle
            document.documentElement.style.setProperty('--background-color', '#f2f2f2');
            document.documentElement.style.setProperty('--text-color', '#000');
            document.documentElement.style.setProperty('--border-color', '#ccc');
        } else { // Standardmodus (wenn der Modus unbekannt ist)
            console.log("Unbekannter Modus, standardmäßig Hellmodus aktivieren...");
            lightboxContent.classList.add('light'); // Standardmäßig hell

            // Standard Light Mode für Tabelle
            document.documentElement.style.setProperty('--background-color', '#f2f2f2');
            document.documentElement.style.setProperty('--text-color', '#000');
            document.documentElement.style.setProperty('--border-color', '#ccc');
        }
    }

    // Funktion zur Beobachtung der Lightbox auf Änderungen (für dynamisch geladene Elemente)
    function observeLightbox() {
        console.log("Beobachte die Lightbox auf Änderungen...");

        const lightboxContainer = document.getElementById('extension-lightbox');
        if (!lightboxContainer) {
            console.log("Lightbox-Container nicht gefunden.");
            return;
        }

        const observer = new MutationObserver(() => {
            console.log("MutationObserver ausgelöst - Überprüfe, ob das Content-Element da ist...");
            // Überprüfe, ob das Content-Element in der Lightbox existiert
            const lightboxContent = document.getElementById('extension-lightbox-content');
            if (lightboxContent) {
                console.log("Lightbox-Inhalt gefunden, wende Modus an...");
                applyMode(); // Wenn das Lightbox-Inhalt gefunden wird, Modus anwenden
                observer.disconnect(); // Beende die Beobachtung, wenn die Lightbox gefunden wurde
            }
        });

        // Beobachte das Hinzufügen von neuen Kindelementen (wie die Lightbox-Inhalte)
        observer.observe(lightboxContainer, { childList: true, subtree: true });
    }

    // Wende den Modus an, wenn das DOM bereit ist
    window.addEventListener('load', () => {
        console.log("DOM vollständig geladen. Wende Modus an...");
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
                <h2>Erweiterungshelfer<br><h5>Hier findet Ihr die Wachen wo noch Erweiterungen fehlen.
                <br>
                <br>Über den roten Button könnt Ihr bei allen Wachen gleichzeitig sämtliche Erweiterugen bauen, dies kann je nach Anzahl der Gebäude und fehlenden Erweiterungen ein wenig dauern.
                <br>Wenn Ihr auf den grünen Button klickt öffnet sich eine Tabelle wo Wachen mit fehlender Erweiterung aufgelistet werden. Dort könnt Ihr auch einzelne Ausbauten vornehmen.</h5>
                <div id="extension-list">Lade Daten...</div>
            </div>
        `;
    document.body.appendChild(lightbox);

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
            console.log("Die Variable 'user_premium' ist definiert."); // Debugging-Info

            if (!user_premium) {
                console.warn("Der Nutzer hat keinen Premium-Account.");
                createCustomAlert("Hallo\n\nHier kommt bald noch mehr Text", isDarkMode, () => {
                    const lightbox = document.getElementById('extension-lightbox');
                    lightbox.style.display = 'flex';
                    fetchBuildingsAndRender(); // API-Daten abrufen, wenn das Script geöffnet wird
                });
            } else {
                console.log("Der Nutzer hat einen Premium-Account.");
                const lightbox = document.getElementById('extension-lightbox');
                lightbox.style.display = 'flex';
                fetchBuildingsAndRender(); // API-Daten abrufen, wenn das Script geöffnet wird
            }
        } else {
            console.error("Die Variable 'user_premium' ist nicht definiert. Bitte prüfe, ob sie korrekt geladen wurde.");
        }
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
            // Remove href attribute to prevent default link behavior
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
            console.log('Abgerufene Gebäudedaten:', data); // Protokolliere die abgerufenen Daten
            buildingsData = data; // Speichern der Gebäudedaten in einer globalen Variablen
            renderMissingExtensions(data); // Weiterverarbeiten der abgerufenen Daten
        })
            .catch(error => {
            console.error('Es ist ein Fehler aufgetreten:', error);
            const list = document.getElementById('extension-list');
            list.innerHTML = 'Fehler beim Laden der Gebäudedaten.';
        });
    }

    // Funktion zum Rendern der Erweiterungen und des Spoilers
    function renderMissingExtensions(buildings) {
        const list = document.getElementById('extension-list');
        list.innerHTML = '';

        buildings.sort((a, b) => {
            if (a.building_type === b.building_type) {
                return a.caption.localeCompare(b.caption);
            }
            return a.building_type - b.building_type;
        });

        buildings.forEach(building => {
            const buildingTypeKey = `${building.building_type}_${building.small_building ? 'small' : 'normal'}`;
            const extensions = manualExtensions[buildingTypeKey];
            if (!extensions) return;

            const existingExtensions = new Set(building.extensions.map(e => e.type_id));

            // Hier wird gefiltert, ob die Erweiterung gebaut werden darf
            const allowedExtensions = extensions.filter(extension => {
                // Überprüfen, ob die Erweiterung nicht limitiert ist
                if (isExtensionLimitReached(building, extension.id)) {
                    return false; // Diese Erweiterung kann nicht gebaut werden
                }
                return !existingExtensions.has(extension.id); // Nur Erweiterungen, die noch nicht gebaut wurden
            });

            if (allowedExtensions.length > 0) {
                if (!buildingGroups[buildingTypeKey]) {
                    buildingGroups[buildingTypeKey] = [];
                }
                buildingGroups[buildingTypeKey].push({ building, missingExtensions: allowedExtensions });
            }
        });

        const buildingTypeNames = {
            '0_normal': 'Feuerwache (Normal)',
            '0_small': 'Feuerwache (Kleinwache)',
            '1_normal': 'Feuerwehrschule',
            '2_normal': 'Rettungswache',
            '3_normal': 'Rettungsschule',
            '4_normal': 'Krankenhaus',
            '5_normal': 'Rettungshubschrauber-Station',
            '6_normal': 'Polizeiwache',
            '6_small': 'Polizeiwache (Klein)',
            '8_normal': 'Polizeischule',
            '9_normal': 'THW',
            '10_normal': 'THW-Bundesschule',
            '11_normal': 'Bereitschaftspolizei',
            '12_normal': 'SEG',
            '13_normal': 'Polizeihubschrauberstation',
            '17_normal': 'Polizei-Sondereinheiten',
            '24_normal': 'Reiterstaffel',
            '25_normal': 'Bergrettungswache',
            '27_normal': 'Schule für Seefahrt und Seenotrettung',
        };

        Object.keys(buildingGroups).forEach(groupKey => {
            const group = buildingGroups[groupKey];
            const buildingType = buildingTypeNames[groupKey] || 'Unbekannt';

            const buildingHeader = document.createElement('h4');
            buildingHeader.textContent = `Typ: ${buildingType}`;
            list.appendChild(buildingHeader);

            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.gap = '10px'; // Abstand zwischen den Buttons

            const spoilerButton = document.createElement('button');
            spoilerButton.textContent = 'Erweiterungen anzeigen';
            spoilerButton.classList.add('spoiler-button');
            buttonContainer.appendChild(spoilerButton);

            const buildAllButton = document.createElement('button');
            buildAllButton.textContent = 'Erweiterung bei allen Wachen bauen';
            buildAllButton.classList.add('build-all-button');
            buildAllButton.onclick = () => showCurrencySelectionForAll(groupKey); // Korrigierte Funktion
            buttonContainer.appendChild(buildAllButton);

            list.appendChild(buttonContainer);

            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'spoiler-content';
            contentWrapper.style.display = 'none'; // Standardmäßig ausgeblendet

            const searchInput = document.createElement('input');
            searchInput.type = "text";
            searchInput.placeholder = "🔍 Nach Wachennamen oder Erweiterungen suchen...";
            searchInput.style.width = "100%";
            searchInput.style.marginBottom = "10px";
            searchInput.style.padding = "5px";
            searchInput.style.fontSize = "14px";
            searchInput.style.display = 'block';

            // Toggle-Spoiler-Button
            spoilerButton.addEventListener('click', () => {
                if (contentWrapper.style.display === 'none') {
                    contentWrapper.style.display = 'block'; // Zeige die Erweiterungen an
                    spoilerButton.textContent = 'Erweiterungen ausblenden';
                } else {
                    contentWrapper.style.display = 'none'; // Verstecke die Erweiterungen
                    spoilerButton.textContent = 'Erweiterungen anzeigen';
                }
            });

            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Wache</th>
                        <th>Fehlende Erweiterung</th>
                        <th>Credits</th>
                        <th>Coins</th>
                    </tr>
                </thead>
                <tbody></tbody>
            `;
            const tbody = table.querySelector('tbody');

            group.forEach(({ building, missingExtensions }) => {
                missingExtensions.forEach(extension => {
                    if (isExtensionLimitReached(building, extension.id)) {
                        return; // Überspringe die Erweiterung, wenn sie nicht gebaut werden kann
                    }

                    const row = document.createElement('tr');
                    row.classList.add(`row-${building.id}-${extension.id}`); // Eine eindeutige Klasse für jede Erweiterung hinzufügen

                    const nameCell = document.createElement('td');
                    nameCell.textContent = building.caption;
                    row.appendChild(nameCell);

                    const extensionCell = document.createElement('td');
                    extensionCell.textContent = extension.name;
                    row.appendChild(extensionCell);

                    // Credits Button
                    const creditCell = document.createElement('td');
                    const creditButton = document.createElement('button');
                    creditButton.textContent = `${formatNumber(extension.cost)} Credits`;
                    creditButton.classList.add('btn', 'btn-xl', 'credit-button'); // btn btn-xs Klassen hinzugefügt
                    creditButton.style.backgroundColor = '#28a745'; // Grüner Hintergrund
                    creditButton.style.color = 'white';
                    creditButton.disabled = isExtensionLimitReached(building, extension.id); // Erweiterung kann nicht gebaut werden
                    creditButton.onclick = () => buildExtension(building, extension.id, 'credits', extension.cost, row); // Button klick Event
                    creditCell.appendChild(creditButton);
                    row.appendChild(creditCell);

                    // Coins Button
                    const coinsCell = document.createElement('td');
                    const coinsButton = document.createElement('button');
                    coinsButton.textContent = `${extension.coins} Coins`;
                    coinsButton.classList.add('btn', 'btn-xl', 'coins-button'); // btn btn-xs Klassen hinzugefügt
                    coinsButton.style.backgroundColor = '#dc3545'; // Roter Hintergrund
                    coinsButton.style.color = 'white';
                    coinsButton.disabled = isExtensionLimitReached(building, extension.id); // Erweiterung kann nicht gebaut werden
                    coinsButton.onclick = () => buildExtension(building, extension.id, 'coins', extension.coins, row); // Button klick Event
                    coinsCell.appendChild(coinsButton);
                    row.appendChild(coinsCell);

                    tbody.appendChild(row);
                });
            });

            contentWrapper.appendChild(searchInput);
            contentWrapper.appendChild(table);
            list.appendChild(contentWrapper);

            searchInput.addEventListener("input", function() {
                const searchTerm = searchInput.value.toLowerCase();
                filterTable(tbody, searchTerm);
            });
        });
    }

    // Schließen-Button-Funktionalität
    document.getElementById('close-extension-helper').addEventListener('click', () => {
        const lightbox = document.getElementById('extension-lightbox');
        lightbox.style.display = 'none';
    });

    // Initial den Button hinzufügen
    addMenuButton();

    // Funktion zur Unterscheidung der Erweiterungswarteschlange zwischen Premium und Nicht Premium User
    function isExtensionLimitReached(building, extensionId) {
        const fireStationSmallAlwaysAllowed = [1, 2, 10, 11];
        const fireStationSmallLimited = [0, 3, 4, 5, 6, 7, 8, 9, 12];

        const policeStationSmallAlwaysAllowed = [0, 1];
        const policeStationSmallLimited = [10, 11, 12, 13];

        const thwAllExtensions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]; // Alle THW-Erweiterungen
        const bpolAllExtensions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Alle BPol-Erweiterungen
        const polSonderEinheitAllExtensions = [0, 1, 2, 3, 4]; // Alle PolSondereinheit-Erweiterungen

        // Falls Premium aktiv ist, gibt es keine Einschränkungen für THW, B-Pol, Schulen und Pol-Sondereinheit
        if (typeof user_premium !== "undefined" && user_premium) {
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

 // Funktion zum Bauen aller Erweiterungen
    async function buildExtension(building, extensionId, currency, amount, row) {
        const userInfo = await getUserCredits();
        if ((currency === 'credits' && userInfo.credits < amount) || (currency === 'coins' && userInfo.coins < amount)) {
            alert(`Nicht genügend ${currency === 'credits' ? 'Credits' : 'Coins'}.`);
            return;
        }

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
                    console.log(`Erweiterung in Gebäude ${building.id} gebaut. Response:`, response);

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
                    if (building.building_type === 0 && building.small_building && [0, 3, 4, 5, 6, 7, 8, 9, 12].includes(extensionId)) {
                        // Alle Erweiterungen der Feuerwehr-Kleinwache ausblenden, die noch nicht gebaut wurden
                        const allRows = document.querySelectorAll(
                            `.row-${building.id}-0,
                         .row-${building.id}-3,
                         .row-${building.id}-4,
                         .row-${building.id}-5,
                         .row-${building.id}-6,
                         .row-${building.id}-7,
                         .row-${building.id}-8,
                         .row-${building.id}-9,
                         .row-${building.id}-12`
                        );
                        allRows.forEach(otherRow => {
                            if (otherRow !== row) {
                                otherRow.style.display = 'none'; // Alle anderen Zeilen ausblenden
                            }
                        });
                    }

                    row.style.display = 'none'; // Die ausgebaute Zeile wird ausgeblendet
                    resolve(response);
                },
                onerror: function(error) {
                    console.error(`Fehler beim Bauen der Erweiterung in Gebäude ${building.id}.`, error);
                    reject(error);
                }
            });
        });
    }

    // Funktion, um eine Erweiterung in einem Gebäude zu bauen
async function confirmAndBuildExtension(buildingId, extensionId, amount, currency) {
    try {
        const userInfo = await getUserCredits();
        const currencyText = currency === 'credits' ? 'Credits' : 'Coins';
        console.log(`Benutzer hat ${userInfo.credits} Credits und ${userInfo.coins} Coins`);

        if ((currency === 'credits' && userInfo.credits < amount) || (currency === 'coins' && userInfo.coins < amount)) {
            alert(`Nicht genügend ${currencyText}.`);
            console.log(`Nicht genügend ${currencyText}.`);
            return;
        }

        console.log('Übergebene buildingId:', buildingId);
        console.log('Aktuelle Gebäudedaten:', buildingsData);
        if (confirm(`Möchten Sie wirklich ${formatNumber(amount)} ${currencyText} für diese Erweiterung ausgeben?`)) {
            const buildingCaption = getBuildingCaption(buildingId);
            console.log('Gefundener Gebäudename:', buildingCaption);

            buildExtension(buildingId, extensionId, currency, buildingCaption, null, null, true);
        }
    } catch (error) {
        console.error('Fehler beim Überprüfen der Credits und Coins:', error);
        alert('Fehler beim Überprüfen der Credits und Coins.');
    }
}

    async function calculateAndBuildAllExtensions(groupKey, currency) {
        const group = buildingGroups[groupKey];
        const totalCost = group.reduce((sum, { missingExtensions }) => {
            return sum + missingExtensions.reduce((extSum, extension) => extSum + extension[currency], 0);
        }, 0);

        try {
            const userInfo = await getUserCredits();
            if ((currency === 'credits' && userInfo.credits < totalCost) || (currency === 'coins' && userInfo.coins < totalCost)) {
                alert(`Nicht genügend ${currency === 'credits' ? 'Credits' : 'Coins'}.`);
                return;
            }

            // Baue alle Erweiterungen nur für den spezifischen Wachentyp
            group.forEach(({ building, missingExtensions }) => {
                missingExtensions.forEach(extension => {
                    // Überprüfe, ob die Erweiterung gebaut werden kann
                    if (!isExtensionLimitReached(building, extension.id)) {
                        // Baue die Erweiterung
                        buildExtension(building, extension.id, currency, extension[currency]);
                    }
                });
            });
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
        progressFill.style.width = `${(builtCount / totalExtensions) * 100}%`;
    }

    // Funktion zum Entfernen der Fortschrittsanzeige
    function removeProgressBar(progressContainer) {
        document.body.removeChild(progressContainer);
    }

    // Neue Funktion zum Bauen aller Erweiterungen für alle Wachen mit Pause und Anzeige
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

    // Anpassung der Funktion "showCurrencySelectionForAll", um die neue Funktion zu verwenden und sich dem UserMode anzupassen
    async function showCurrencySelectionForAll(groupKey) {
        const group = buildingGroups[groupKey];
        const totalCostCredits = group.reduce((sum, { missingExtensions }) => {
            return sum + missingExtensions.reduce((extSum, extension) => extSum + extension.cost, 0);
        }, 0);
        const totalCostCoins = group.reduce((sum, { missingExtensions }) => {
            return sum + missingExtensions.reduce((extSum, extension) => extSum + extension.coins, 0);
        }, 0);

        const userSettings = await getUserMode();
        const isDarkMode = userSettings && (userSettings.design_mode === 1 || userSettings.design_mode === 4);

        const selectionDiv = document.createElement('div');
        selectionDiv.className = 'currency-selection';
        selectionDiv.style.background = isDarkMode ? '#333' : '#fff';
        selectionDiv.style.color = isDarkMode ? '#fff' : '#000';
        selectionDiv.style.borderColor = isDarkMode ? '#444' : '#ccc';

        const creditsButton = document.createElement('button');
        creditsButton.className = 'currency-button credits-button';
        creditsButton.textContent = `Mit Credits zahlen (Gesamt: ${formatNumber(totalCostCredits)} Credits)`;
        creditsButton.onclick = () => {
            buildAllExtensionsWithPause(groupKey, 'credits');
            document.body.removeChild(selectionDiv);
        };

        const coinsButton = document.createElement('button');
        coinsButton.className = 'currency-button coins-button';
        coinsButton.textContent = `Mit Coins zahlen (Gesamt: ${totalCostCoins} Coins)`;
        coinsButton.onclick = () => {
            buildAllExtensionsWithPause(groupKey, 'coins');
            document.body.removeChild(selectionDiv);
        };

        const cancelButton = document.createElement('button');
        cancelButton.className = 'cancel-button';
        cancelButton.textContent = 'Abbrechen';
        cancelButton.onclick = () => {
            document.body.removeChild(selectionDiv);
        };

        const progressDiv = document.createElement('div');
        progressDiv.id = 'progress-div';
        progressDiv.style.marginTop = '10px';
        progressDiv.textContent = 'Erweiterungen gebaut: 0 von 0';
        selectionDiv.appendChild(progressDiv);

        selectionDiv.appendChild(creditsButton);
        selectionDiv.appendChild(coinsButton);
        selectionDiv.appendChild(cancelButton);

        document.body.appendChild(selectionDiv);
    }

    // Funktion zur Filterung der Tabelle
    function filterTable(tbody, searchTerm) {
        const rows = tbody.querySelectorAll("tr");

        rows.forEach(row => {
            const wachenName = row.cells[0]?.textContent.toLowerCase() || "";
            const erweiterung = row.cells[1]?.textContent.toLowerCase() || "";

            if (wachenName.includes(searchTerm) || erweiterung.includes(searchTerm)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    }

    // Funktion um die aktuelle Credits und Coins des USERs abzurufen
    async function getUserCredits() {

        try {
            const response = await fetch('https://www.leitstellenspiel.de/api/userinfo');
            if (!response.ok) {
                throw new Error('Fehler beim Abrufen der Credits und Coins');
            }
            const data = await response.json();
            console.log('Benutzer Credits und Coins abgerufen:', data);
            return {
                credits: data.credits_user_current,
                coins: data.coins_user_current
            };
        } catch (error) {
            console.error('Fehler beim Abrufen der Credits und Coins:', error);
            throw error;
        }
    }

    // Funktion, um den Namen eines Gebäudes anhand der ID zu bekommen
    function getBuildingCaption(buildingId) {

        console.log('Übergebene buildingId:', buildingId);  // Überprüfen, welche ID übergeben wird
        const building = buildingsData.find(b => String(b.id) === String(buildingId));
        if (building) {
            console.log('Gefundenes Gebäude:', building);  // Protokolliere das gefundene Gebäude
            return building.caption; // Direkt den Gebäudennamen zurückgeben
        }
        console.log('Gebäude nicht gefunden. ID:', buildingId); // Wenn das Gebäude nicht gefunden wird
        return 'Unbekanntes Gebäude';
    }


})();
