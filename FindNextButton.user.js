// ==UserScript==
// @name         Leitstellenspiel - K für "Nächstes" (flexible Suche)
// @namespace    http://tampermonkey.net/
// @version      1.10
// @description  Drücke "K", um den Button mit "Nächstes" zu klicken
// @author       Dein Name
// @match        https://www.leitstellenspiel.de/buildings/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log("[Tampermonkey] Skript gestartet. Drücke 'K' für 'Nächstes'.");

    function clickNextButton() {
        console.log("[Tampermonkey] Suche nach dem Button mit 'Nächstes'...");

        let navContainer = document.getElementById('building-navigation-container');

        if (navContainer) {
            console.log("[Tampermonkey] Gebäude-Navigation gefunden.");

            // Suche nach allen Buttons mit der Klasse "btn btn-xs btn-success"
            let buttons = navContainer.querySelectorAll('a.btn.btn-xs.btn-success');

            // Button mit Text suchen, der mit "Nächstes" beginnt
            let nextButton = Array.from(buttons).find(btn => btn.innerText.trim().startsWith("Nächstes"));

            if (nextButton) {
                console.log("[Tampermonkey] Button gefunden, klicke darauf...");
                nextButton.click();
            } else {
                console.warn("[Tampermonkey] Kein Button mit 'Nächstes' gefunden!");
            }
        } else {
            console.warn("[Tampermonkey] Gebäude-Navigationscontainer nicht gefunden!");
        }
    }

    // Event-Listener für Tastendruck "K"
    document.addEventListener('keydown', function(event) {
        if (event.key.toLowerCase() === 'k') {
            console.log("[Tampermonkey] 'K' wurde gedrückt. Suche nach Button...");
            clickNextButton();
        }
    });

})();
