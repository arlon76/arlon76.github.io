// gregorian-core.js

export const Gregorian = (function () {
	// Creation date in Gregorian: August 11, 3114 BCE
	const MAYAN_EPOCH = new Date(Date.UTC(-3113, 7, 11)); // Month is zero-indexed (7 = August)

	function getLongCount(date) {
		const targetDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
		const daysSinceEpoch = Math.floor((targetDate - MAYAN_EPOCH) / (1000 * 60 * 60 * 24));

		let remainingDays = daysSinceEpoch;

		const baktun = Math.floor(remainingDays / 144000);
		remainingDays %= 144000;

		const katun = Math.floor(remainingDays / 7200);
		remainingDays %= 7200;

		const tun = Math.floor(remainingDays / 360);
		remainingDays %= 360;

		const uinal = Math.floor(remainingDays / 20);
		remainingDays %= 20;

		const kin = remainingDays;

		return { baktun, katun, tun, uinal, kin };
	}

		// Day of Year
	function getDayOfYear(date) {
		const start = new Date(date.getFullYear(), 0, 0);
		const diff = date - start + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
		return Math.floor(diff / (1000 * 60 * 60 * 24));
	}

	// ISO Week Number (ISO-8601)
	function getISOWeekNumber(date) {
		const tmp = new Date(date.valueOf());
		const dayNum = (date.getDay() + 6) % 7;
		tmp.setDate(tmp.getDate() - dayNum + 3);
		const firstThursday = new Date(tmp.getFullYear(), 0, 4);
		const diff = tmp - firstThursday;
		return 1 + Math.round(diff / (7 * 24 * 60 * 60 * 1000));
	}

	// Leap Year
	function isLeapYear(year) {
		return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
	}

	// Moon phase (approximate algorithm)
	function getMoonPhaseName(date) {
		const synodicMonth = 29.53058867; // Average moon cycle in days
		const newMoonRef = new Date(Date.UTC(2000, 0, 6, 18, 14)); // Known new moon

		const daysSinceNew = (date - newMoonRef) / (1000 * 60 * 60 * 24);
		const currentPhase = daysSinceNew % synodicMonth;
		const phase = Math.floor((currentPhase / synodicMonth) * 8);

		const phases = [
			"🌑 New Moon",
			"🌒 Waxing Crescent",
			"🌓 First Quarter",
			"🌔 Waxing Gibbous",
			"🌕 Full Moon",
			"🌖 Waning Gibbous",
			"🌗 Last Quarter",
			"🌘 Waning Crescent"
		];

		return phases[phase] || "Unknown";
	}

	return { getLongCount,getDayOfYear,getISOWeekNumber,isLeapYear,getMoonPhaseName };
	
})();

