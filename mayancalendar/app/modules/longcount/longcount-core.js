// longcount-core.js
/*
export const LongCountALT = (function () {
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

		return { baktun, katun, tun, uinal, kin,
			full: `${baktun}.${katun}.${tun}.${uinal}.${kin}` };
	}

	return { getLongCount };
})();
*/
export const LongCount = (function() {

	function getLongCount(date) {
		// GMT correlation constant
		const CORRELATION_CONSTANT = 584283;

		// Calculate number of days since Long Count base date (August 11, 3114 BCE)
		const msPerDay = 1000 * 60 * 60 * 24;
		const utcDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
		const baseDate = Date.UTC(-3113, 7, 11); // August 11, 3114 BCE (Year -3113 in JS)
		const daysSinceCreation = Math.floor((utcDate - baseDate) / msPerDay);

		// Adjust using GMT constant
		const totalDays = daysSinceCreation + CORRELATION_CONSTANT;

		const baktun = Math.floor(totalDays / 144000);
		const katun = Math.floor((totalDays % 144000) / 7200);
		const tun = Math.floor((totalDays % 7200) / 360);
		const uinal = Math.floor((totalDays % 360) / 20);
		const kin = totalDays % 20;

		return {
			baktun,
			katun,
			tun,
			uinal,
			kin,
			full: `${baktun}.${katun}.${tun}.${uinal}.${kin}`
		};
	}

	return { getLongCount };

})();
