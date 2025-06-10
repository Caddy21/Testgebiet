In einem bereits existierenden Script habe ich für den Verdienst und die Einsatzzählung folgenden Funktionen:

 // Hauptfunktion zur Missionszählung
    async function updateMissionCounts() {
        const accessedElements = document.querySelectorAll('.missionSideBarEntry .glyphicon-user:not(.hidden)');

        let todayMissions = await GM.getValue('today_missions', 0);
        let weekMissions = await GM.getValue('week_missions', 0);
        let monthMissions = await GM.getValue('month_missions', 0);
        let yearMissions = await GM.getValue('year_missions', 0);
        let countedFinishedMissions = await GM.getValue('counted_finished_missions', []);
        let lastSavedDate = await GM.getValue('last_saved_date_missions', '');
        let lastSavedWeek = await GM.getValue('last_saved_week_missions', '');
        let lastSavedMonth = await GM.getValue('last_saved_month_missions', '');
        let lastSavedYear = await GM.getValue('last_saved_year_missions', '');
        if (!Array.isArray(countedFinishedMissions)) countedFinishedMissions = [];

        const today = new Date();
        const todayDateString = today.toISOString().slice(0, 10);
        const currentMonth = today.toISOString().slice(0, 7);
        const currentYear = today.getFullYear().toString();

        const getISOWeek = (date) => {
            const target = new Date(date.valueOf());
            const dayNr = (date.getDay() + 6) % 7;
            target.setDate(target.getDate() - dayNr + 3);
            const firstThursday = new Date(target.getFullYear(), 0, 4);
            const diff = (target - firstThursday) / 86400000;
            return 1 + Math.floor(diff / 7);
        };

        const currentWeek = getISOWeek(today);
        const currentWeekYearKey = ${currentYear}-KW${currentWeek.toString().padStart(2, '0')};

        // LOG optional
        //console.log('[Check]', { lastSavedDate, todayDateString, lastSavedWeek, currentWeekYearKey });

        if (lastSavedDate !== todayDateString) {
            console.log('→ Neuer Tag erkannt. Tageszähler wird zurückgesetzt.');

            todayMissions = 0;
            countedFinishedMissions = [];
            await GM.setValue('today_missions', 0);
            await GM.setValue('counted_finished_missions', []);
            await GM.setValue('last_saved_date_missions', todayDateString);

            if (lastSavedWeek !== currentWeekYearKey) {
                // console.log('→ Neue Woche erkannt. Wochenzähler wird zurückgesetzt.');
                weekMissions = 0;
                await GM.setValue('week_missions', 0);
                await GM.setValue('last_saved_week_missions', currentWeekYearKey);
            }

            if (lastSavedMonth !== currentMonth) {
                // console.log('→ Neuer Monat erkannt. Monatszähler wird zurückgesetzt.');
                monthMissions = 0;
                await GM.setValue('month_missions', 0);
                await GM.setValue('last_saved_month_missions', currentMonth);
            }

            if (lastSavedYear !== currentYear) {
                //console.log('→ Neues Jahr erkannt. Jahreszähler wird zurückgesetzt.');
                yearMissions = 0;
                await GM.setValue('year_missions', 0);
                await GM.setValue('last_saved_year_missions', currentYear);
            }
        }

        // Einsätze zählen
        for (const element of accessedElements) {
            const missionEntry = element.closest('.missionSideBarEntry');
            if (!missionEntry) continue;

            const elementId = missionEntry.id;
            if (!countedFinishedMissions.includes(elementId)) {
                todayMissions++;
                weekMissions++;
                monthMissions++;
                yearMissions++;
                countedFinishedMissions.push(elementId);
            }
        }

        // Speichern
        await GM.setValue('today_missions', todayMissions);
        await GM.setValue('week_missions', weekMissions);
        await GM.setValue('month_missions', monthMissions);
        await GM.setValue('year_missions', yearMissions);
        await GM.setValue('counted_finished_missions', countedFinishedMissions);

        // Anzeige aktualisieren
        const missionCountsContainer = document.getElementById('today_missions_display');
        if (missionCountsContainer) {
            const currentMonthName = today.toLocaleString('de-DE', { month: 'long' });
            missionCountsContainer.innerHTML = 
        <div style="display: flex; gap: 10px; align-items: center;">
            <span style="color: red; font-weight: bold;">Einsätze:</span>
            <span title="Heute abgeschlossen">🗓️ <b>Heutige:</b> ${todayMissions} Stück</span>
            <span title="Diese Woche abgeschlossen">📆 <b>Diese Woche:</b> ${weekMissions} Stück</span>
            <span title="Diesen Monat abgeschlossen">📅 <b>Alle Einsätze im ${currentMonthName}:</b> ${monthMissions} Stück</span>
            <span title="Dieses Jahr abgeschlossen">📆 <b>Alle Einsätze im Jahr ${currentYear}:</b> ${yearMissions} Stück</span>
        </div>
    ;
        }
    }

    // Geplanten Mitternachts-Reset ausführen
    function scheduleMidnightReset() {
        const now = new Date();
        const nextMidnight = new Date(now);
        nextMidnight.setHours(24, 0, 0, 0); // nächste Mitternacht

        const timeUntilMidnight = nextMidnight - now;

        //console.log(🕛 Nächster geplanter Reset in ${(timeUntilMidnight / 1000 / 60).toFixed(2)} Minuten);

        setTimeout(async () => {
            //console.log('🕛 Mitternacht erreicht – führe automatischen Reset aus');
            await updateMissionCounts(); // führt interne Resets durch
            scheduleMidnightReset();     // nächsten Reset planen
        }, timeUntilMidnight + 1000); // +1 Sekunde Puffer
    }

async function updateAverageEarnings() {
        const missionElements = document.querySelectorAll('.missionSideBarEntry:not(.mission_deleted)');
        const finishedElements = document.querySelectorAll('.missionSideBarEntry.mission_deleted');

        let totalCredits = 0;
        let actualCredits = 0;
        let allCredits = 0;
        let allActualCredits = 0;
        let todayEarnings = await GM.getValue('today_earnings', 0);
        let weekEarnings = await GM.getValue('week_earnings', 0);
        let monthEarnings = await GM.getValue('month_earnings', 0);
        let yearEarnings = await GM.getValue('year_earnings', 0);
        let countedMissions = await GM.getValue('counted_missions', []);
        let lastSavedDate = await GM.getValue('last_saved_date', '');
        let lastSavedWeek = await GM.getValue('last_saved_week', '');
        let lastSavedMonth = await GM.getValue('last_saved_month', '');
        let lastSavedYear = await GM.getValue('last_saved_year', '');
        if (!Array.isArray(countedMissions)) countedMissions = [];

        const today = new Date();
        const todayDateString = today.toISOString().slice(0, 10);
        const currentMonth = today.toISOString().slice(0, 7);  // z.B. "2025-04"
        const currentYear = today.getFullYear().toString();     // z.B. "2025"

        // Hilfsfunktion: ISO-Woche berechnen
        const getISOWeek = (date) => {
            const target = new Date(date.valueOf());
            const dayNr = (date.getDay() + 6) % 7;
            target.setDate(target.getDate() - dayNr + 3);
            const firstThursday = new Date(target.getFullYear(), 0, 4);
            const diff = (target - firstThursday) / 86400000;
            return 1 + Math.floor(diff / 7);
        };

        const currentWeek = getISOWeek(today);

        // Tageswechsel: Reset nur Tageswerte
        if (lastSavedDate !== todayDateString) {
            todayEarnings = 0;
            countedMissions = [];
            await GM.setValue('today_earnings', 0);
            await GM.setValue('counted_missions', []);
            await GM.setValue('last_saved_date', todayDateString);

            // Wochenwechsel: Reset Wochenverdienst
            if (lastSavedWeek !== currentWeek.toString()) {
                weekEarnings = 0;
                await GM.setValue('week_earnings', 0);
                await GM.setValue('last_saved_week', currentWeek.toString());
            }

            // Monatlicher Reset bei Monatswechsel
            if (lastSavedMonth !== currentMonth) {
                monthEarnings = 0;
                await GM.setValue('month_earnings', 0);
                await GM.setValue('last_saved_month', currentMonth);
            }

            // Jahresreset bei Jahreswechsel
            if (lastSavedYear !== currentYear) {
                yearEarnings = 0;
                await GM.setValue('year_earnings', 0);
                await GM.setValue('last_saved_year', currentYear);
            }
        }

        let currentMissions = new Set();

        missionElements.forEach(element => {
            if (element.style.display === 'none' || element.classList.contains('hidden')) return;

            const missionId = element.getAttribute('mission_type_id');
            const additiveOverlay = element.getAttribute('data-additive-overlays');

            if (missionId && missionData[missionId]) {
                let credits = missionData[missionId].base_credits ?? 0;

                if (additiveOverlay && missionData[missionId].overlays[additiveOverlay]) {
                    credits = missionData[missionId].overlays[additiveOverlay];
                }

                if (!credits) {
                    credits = 250;
                }

                allCredits += credits;

                const idNum = element.id.replace(/\D/g, '');
                const participantIcon = document.getElementById(mission_participant_${idNum});
                const isParticipating = participantIcon && !participantIcon.classList.contains('hidden');

                if (isParticipating) {
                    allActualCredits += credits;
                }

                if (element.style.display !== 'none') {
                    totalCredits += credits;
                    if (isParticipating) {
                        actualCredits += credits;
                    }
                    currentMissions.add(missionId);
                }
            }
        });

        // Nur neue beendete Missionen heute zählen
        for (const element of finishedElements) {
            const elementId = element.id;
            if (!countedMissions.includes(elementId)) {
                const missionId = element.getAttribute('mission_type_id');
                const additiveOverlay = element.getAttribute('data-additive-overlays');

                if (missionId && missionData[missionId]) {
                    let credits = missionData[missionId].base_credits ?? 0;

                    if (additiveOverlay && missionData[missionId].overlays[additiveOverlay]) {
                        credits = missionData[missionId].overlays[additiveOverlay];
                    }

                    if (!credits) {
                        credits = 250;
                    }

                    todayEarnings += credits;
                    weekEarnings += credits;
                    monthEarnings += credits;
                    yearEarnings += credits;
                }

                countedMissions.push(elementId);
            }
        }

        // Werte speichern
        await GM.setValue('today_earnings', todayEarnings);
        await GM.setValue('week_earnings', weekEarnings);
        await GM.setValue('month_earnings', monthEarnings);
        await GM.setValue('year_earnings', yearEarnings);
        await GM.setValue('counted_missions', countedMissions);

        // Bestehende DOM-Elemente aktualisieren
        const standardContainer = document.getElementById('standard_earnings_display');
        const fullContainer = document.getElementById('full_earnings_display');
        const todayEarningsContainer = document.getElementById('today_earnings_display');

        if (standardContainer) {
            standardContainer.innerHTML = 
            <span title="Verdienst der aktuellen Kategorie oder Gruppe">💰 ${totalCredits.toLocaleString()} Credits</span>
            /
            <span title="Verdienst aus angefahrenen Einsätzen der aktuellen Kategorie oder Gruppe">
                <span class="glyphicon glyphicon-user" style="color: #8bc34a;" aria-hidden="true"></span> ${actualCredits.toLocaleString()} Credits
            </span>
        ;
        }

        if (fullContainer) {
            fullContainer.innerHTML = 
            <span title="Gesamtverdienst aller Einsätze">💲${allCredits.toLocaleString()} Credits</span>
            /
            <span title="Gesamtverdienst aus allen angefahrenen Einsätzen">
                <span class="glyphicon glyphicon-user" style="color: #4caf50;" aria-hidden="true"></span>💲${allActualCredits.toLocaleString()} Credits
            </span>
        ;
        }

        if (todayEarningsContainer) {
            const currentMonthName = today.toLocaleString('de-DE', { month: 'long' }); // z.B. "April"
            const currentYear = today.getFullYear(); // z.B. "2025"

            todayEarningsContainer.innerHTML = 
            <div style="display: flex; gap: 10px;">
            <span style="color: green; font-weight: bold;">Verdienst:</span>
                <span title="Heutiger Verdienst">🗓️ <b>Heute:</b> ${todayEarnings.toLocaleString()} Credits</span>
                <span title="Wochenverdienst">📆 <b>Diese Woche:</b> ${weekEarnings.toLocaleString()} Credits</span>
                <span title="Monatsverdienst">📅 <b> Im Monat ${currentMonthName}:</b> ${monthEarnings.toLocaleString()} Credits</span>
                <span title="Jahresverdienst">📆 <b> Im Jahr ${currentYear}:</b> ${yearEarnings.toLocaleString()} Credits</span>
            </div>
        ;
        }
    }

Das würde ich gern in einem Extrascript haben wollen so das ich das aus dem alten Entfernen kann da es mit der eingentlichen Funktion nichts zu tun hat
