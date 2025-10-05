// tzolkin-ui.js

//import the functionality library:
// import { Tzolkin } from '/app/modules/tzolkin/tzolkin-core.js';
import { Tzolkin } from './tzolkin-core.js';

export const TzolkinUI = (function() {
	
		let $container;
		
		function init(containerSelector) {
			
			console.log("🔁 TzolkinUI.init() fired, line 6 TzolkinUI, containerSelector is:"+containerSelector);
			
			$container = $(containerSelector);
			if (!$container.length) {
				console.error(`TzolkinUI: Container ${containerSelector} not found.`);
				return;
			}

			// Create a box for this UI
			const $box = $('<div class="info-box tzolkin-box"></div>');
			$container.append($box);

			// Store this box reference for updates
			$container = $box;
			
			update();

			const now = new Date();
			const msUntilMidnight =
				new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;

			setTimeout(() => {
				update();
				setInterval(update, 24 * 60 * 60 * 1000);
			}, msUntilMidnight);
		}
		function update(date=new Date()) {
			
			// console.log("TzolkinUI.update() fired, line 33 TzolkinUI, date is:"+date);
			
			const now = date;
			const { toneNumber: tone, dayName, glyph } = Tzolkin.getTzolkin(date);

			console.log(`Tzolkin → Tone: ${tone}, Day: ${dayName}, Glyph: ${glyph}`);
			
			let $dayDiv = $container.find(".day-name"); // line 34
			let $toneDiv = $container.find(".tone");
			let $glyphDiv = $container.find(".glyph");

			if (!$dayDiv.length) {
				$dayDiv = $('<div class="day-name"></div>').appendTo($container);
			}
			if (!$toneDiv.length) {
				$toneDiv = $('<div class="tone"></div>').appendTo($container);
			}
			if (!$glyphDiv.length) {
				$glyphDiv = $('<div class="glyph"></div>').appendTo($container);
			}

			$dayDiv.text(`Tzolk'in Day: ${dayName}`);
			$toneDiv.text(`Tone: ${convertToMayanGlyphs(tone)} (${tone})`);
			$glyphDiv.text(glyph);
		}

	return { init,	update };
})();

