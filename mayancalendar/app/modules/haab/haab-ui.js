// haab-ui.js

//import the functionality library:
// import { Haab } from '/app/modules/haab/haab-core.js';
import { Haab } from './haab-core.js';

export const HaabUI = (function() {
	
	let $container;
	
	function init(containerSelector) {
		$container = $(containerSelector);
		if (!$container.length) {
			console.error(`Container ${containerSelector} not found.`);
			return;
		}

		update();

		// Optionally, update once per day
		const now = new Date();
		const msUntilMidnight =	new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;

		setTimeout(function() {
			update();
			setInterval(update, 24 * 60 * 60 * 1000);
		}, msUntilMidnight);
		
	}
		
	function update(date = new Date()) {
		// console.log("HaabUI.update() fired");
		const now = date;
		const { dayNumber, monthName, glyph } = Haab.getHaab(now);
		
		// console.log(`Haab → ${glyph} ${dayNumber} ${monthName}`);
		// Add to the container — create or update UI elements
		let $haabDiv = $container.find(".haab");
		if (!$haabDiv.length) {
			$haabDiv = $('<div class="info-box haab"></div>').appendTo($container);
		}
		
		$haabDiv.text(`Haab: ${glyph} ${convertToMayanGlyphs(dayNumber)} (${dayNumber}) ${monthName}`);
	}

	return { init,update };
	
})();

