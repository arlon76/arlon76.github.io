
import { Gregorian } from './gregorian-core.js';

export const GregorianUI = (function() {
	let $container;

	function init(containerSelector) {
		$container = $(containerSelector);

		$container.append(`
			<div class="info-box" id="gregorian-box">
				<h3>Gregorian Calendar</h3>
				<div><strong>Date:</strong> <span id="gregorian-date"></span></div>
				<div><strong>Day of Year:</strong> <span id="day-of-year"></span></div>
				<div><strong>ISO Week #:</strong> <span id="iso-week"></span></div>
				<div><strong>Leap Year:</strong> <span id="leap-year-status"></span></div>
				<div><strong>Moon Phase:</strong> <span id="moon-phase"></span></div>
			</div>
		`);
		update(); // Call initially
	}

	function update(date = new Date()) {
		if (!$container) return;

		const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		const formattedDate = date.toLocaleDateString(undefined, options);

		const dayOfYear = Gregorian.getDayOfYear(date);
		const isoWeek = Gregorian.getISOWeekNumber(date);
		const leapYear = Gregorian.isLeapYear(date.getFullYear());
		const moon = Gregorian.getMoonPhaseName(date);

		$container.find('#gregorian-date').text(formattedDate);
		$container.find('#day-of-year').text(dayOfYear);
		$container.find('#iso-week').text(isoWeek);
		$container.find('#leap-year-status').text(leapYear ? "Yes" : "No");
		$container.find('#moon-phase').text(moon);
	}


	return {
		init,
		update
	};
})();
