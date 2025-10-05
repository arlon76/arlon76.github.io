// longcount-ui.js
/*
export const LongCountUIALT = (function () {
	let $container;

	function init(containerSelector) {
		$container = $(containerSelector);
		if ($container.length === 0) {
			console.error("LongCountUI: container not found:", containerSelector);
			return;
		}

		// Create a UI slot for Long Count if it doesn't exist
		if ($container.find(".long-count").length === 0) {
			$container.append('<div class="long-count"></div>');
		}

		update();
	}

	function update(date = new Date()) {
		if (typeof LongCount === "undefined") {
			console.error("LongCount core module is missing.");
			return;
		}

		const { baktun, katun, tun, uinal, kin } = LongCount.getLongCount(date);
		const longCountStr = `${baktun}.${katun}.${tun}.${uinal}.${kin}`;

		$container.find(".long-count").text(`Long Count: ${longCountStr}`);
	}

	return {
		init,
		update
	};
})();
*/

// import { LongCount } from '/app/modules/longcount/longcount-core.js';
import { LongCount } from './longcount-core.js';
// import { convertToMayanGlyphs } from '/app/util/util.js';

export const LongCountUI = (function() {

	let $container;

	function init(containerSelector) {
		$container = $(containerSelector);

		// Initial layout
		$container.append(`
			<div class="info-box">
				<div class="longcount-label" style="margin-bottom: 0.5em;">
					Long Count:<br>
				</div>
				<div class="longcount-line">
					<span class="glyph-stack" id="baktun-glyph"></span>
					<span class="glyph-stack" id="katun-glyph"></span>
					<span class="glyph-stack" id="tun-glyph"></span>
					<span class="glyph-stack" id="uinal-glyph"></span>
					<span class="glyph-stack" id="kin-glyph"></span>
				</div>
				<div class="longcount-text" id="longcount-text"></div>
			</div>
		`);
	}

	function update(date=new Date()) {
		if (!$container) return;

		// console.log("Line 66 of longcount-ui.js says date is:",date);
		const data = LongCount.getLongCount(date);
		const glyphMap = {
			'baktun-glyph': convertToMayanGlyphs(data.baktun),
			'katun-glyph':  convertToMayanGlyphs(data.katun),
			'tun-glyph':    convertToMayanGlyphs(data.tun),
			'uinal-glyph':  convertToMayanGlyphs(data.uinal),
			'kin-glyph':    convertToMayanGlyphs(data.kin)
		};

		for (const [id, glyphs] of Object.entries(glyphMap)) {
			const $el = $container.find(`#${id}`);
			$el.empty();
			for (let i = glyphs.length - 1; i >= 0; i--) {
				$el.append(`<div class="mayan-numeral">${glyphs[i]}</div>`);
			}
		}

		$container.find('#longcount-text').text(`${data.full}`);
	}

	return {
		init,
		update
	};

})();
