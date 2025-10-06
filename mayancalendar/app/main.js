// main.js
import { MayanCalendarController } from './mayan-calendar-controller.js';
export const Main = (function() {
	
		// Modular init: use MayanCalendarController if defined
	$(function() {
		// console.log("DOM ready. Initializing calendar...");
		if (typeof MayanCalendarController !== "undefined") {
			
			// console.log("Using MayanCalendarController...");
			MayanCalendarController.init("#mayan-calendar");
		} 

	});
			
	return {  };
	
})();
