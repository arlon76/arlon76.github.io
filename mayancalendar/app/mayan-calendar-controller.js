// mayan-calendar.js

console.log("✅ mayan-calendar-controller.js loaded, line 12 of the controller");

	// UI plugins (rendering)
// import { TzolkinUI } from '/app/modules/tzolkin/tzolkin-ui.js'; // line 12
// import { HaabUI } from '/app/modules/haab/haab-ui.js';
// import { LongCountUI } from '/app/modules/longcount/longcount-ui.js';
// import { DreamSpellUI } from '/app/modules/dreamspell/dreamspell-ui.js';
// import { GregorianUI } from '/app/modules/gregorian/gregorian-ui.js';
// import { JulianUI } from '/app/modules/julian/julian-ui.js';
import { TzolkinUI } from './modules/tzolkin/tzolkin-ui.js'; // line 12
import { HaabUI } from './modules/haab/haab-ui.js';
import { LongCountUI } from './modules/longcount/longcount-ui.js';
import { DreamSpellUI } from './modules/dreamspell/dreamspell-ui.js';
import { GregorianUI } from './modules/gregorian/gregorian-ui.js';
import { JulianUI } from './modules/julian/julian-ui.js';

//next/prev/today buttons
// import { CalendarNavigation } from '/app/util/calendar-navigation.js';
import { CalendarNavigation } from './util/calendar-navigation.js';

export const MayanCalendarController = (function() {
	
	// console.log("✅ mayan-calendar-controller.js loaded, line 25 of the controller");
	
	function init(containerSelector) {
		// console.log("✅ MayanCalendarController.init called, line 28 of the controller");
		const $container = $(containerSelector);
		if (!$container.length) {
			console.error(`Container ${containerSelector} not found.`);
			return;
		}
		// console.log("✅ MayanCalendarController init happening, line 34 of the controller");
		
		let allUIs = [];
		
		/*	// loop this instead of how it is, see below:
		if (typeof TzolkinUI !== "undefined") {
			console.log("→ Initializing TzolkinUI");
			TzolkinUI.init(containerSelector);
			allUIs.push(TzolkinUI)
		}
		if (typeof HaabUI !== "undefined") {
			console.log("→ Initializing HaabUI");
			HaabUI.init(containerSelector);
			allUIs.push(HaabUI)
		}
		if (typeof LongCountUI !== "undefined") {
			LongCountUI.init(containerSelector);
			allUIs.push(LongCountUI)
		}
		if (typeof DreamScapeUI !== "undefined") {
			DreamScapeUI.init(containerSelector);
			allUIs.push(DreamScapeUI)
		}
		if (typeof GregorianUI !== "undefined") {
			GregorianUI.init(containerSelector);
			allUIs.push(GregorianUI)
		}
		if (typeof JulianUI !== "undefined") {
			JulianUI.init(containerSelector);
			allUIs.push(JulianUI)
		}
		*/
		
		const uiModules = {
			TzolkinUI
			,HaabUI
			,LongCountUI
			,DreamSpellUI
			,GregorianUI
			,JulianUI
		};

		// for (const ui of uiModules) { // when it was an array
		for (const [name, ui] of Object.entries(uiModules)) {
			// if (ui && typeof ui !== "undefined" && typeof ui.init === "function") {
			if (ui && typeof ui.init === "function") {
				console.log(`→ Initializing ${name}`);
				ui.init(containerSelector);
				allUIs.push(ui);
			}
		}

		// Initialize CalendarNavigation if it exists
		if (typeof CalendarNavigation !== "undefined") {
			CalendarNavigation.init(containerSelector, allUIs);
		}

		scheduleDailyUpdate(() => {
			for (const ui of allUIs) {
				if (typeof ui.update === "function") {
					ui.update();
				}
			}
		});
	}

	return { init };
})();

window.MayanCalendarController = MayanCalendarController;

