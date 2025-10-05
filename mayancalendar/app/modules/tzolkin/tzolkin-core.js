// tzolkin-core.js

export const Tzolkin = (function() {
	// 20 day names in order
	const dayNames = [
		"Imix", "Ik'", "Ak'b'al", "K'an", "Chikchan", "Kimi", "Manik'",
		"Lamat", "Muluk", "Ok", "Chuwen", "Eb'", "B'en", "Ix", "Men",
		"K'ib'", "Kab'an", "Etz'nab'", "Kawak", "Ajaw"
	];
	// Emoji glyphs for each Tzolk'in day — meaningful icons for each day name
	const tzolkinGlyphs = {
		"Imix":   { glyph: "🌊🐊", desc: "Darkness, Water, Lily, Crocodile" },
		"Ik'":    { glyph: "🌬️", desc: "Wind, Breath, Spirit" },
		"Ak'b'al":{ glyph: "🌌🌑", desc: "Night, Darkness, Mystery" },
		"K'an":   { glyph: "🌽", desc: "Corn, Abundance, Seed" },
		"Chikchan": { glyph: "🐍", desc: "Serpent, Life Force" },
		"Kimi":   { glyph: "💀", desc: "Death, Transformation" },
		"Manik'": { glyph: "🦌✋", desc: "Deer, Healing, Sacrifice" },
		"Lamat":  { glyph: "🌟", desc: "Star, Venus, Rabbit" },
		"Muluk":  { glyph: "💧", desc: "Water, Offering" },
		"Ok":     { glyph: "🐕🐺", desc: "Dog, Loyalty, Guidance" },
		"Chuwen": { glyph: "🐒", desc: "Monkey, Creativity, Play" },
		"Eb'":    { glyph: "🦅🪜", desc: "Path, Ascension" },
		"B'en":   { glyph: "🌿", desc: "Reed, Growth, Journey" },
		"Ix":     { glyph: "🐆🐯", desc: "Jaguar, Magic, Feminine" },
		"Men":    { glyph: "🦅", desc: "Eagle, Vision, Sky" },
		"K'ib'":  { glyph: "🗡️📘", desc: "Wisdom, Forgiveness, Flint" },
		"Kab'an": { glyph: "🌍", desc: "Earth, Earthquake, Movement" },
		"Etz'nab'": { glyph: "🔪🗡️", desc: "Obsidian, Reflection" },
		"Kawak":  { glyph: "🌧️🌩️", desc: "Storm, Rain, Cleansing" },
		"Ajaw":   { glyph: "🌞", desc: "Sun, Lord, Light" }
	};
	function getGlyphForDayName(dayName) {
		
		// console.log("Line 36 of Tzolkin core - 🔍 getGlyphForDayName → input:", dayName);
		// console.log("Line 37 of Tzolkin core - 🧠 Keys in tzolkinGlyphs:", Object.keys(tzolkinGlyphs));
		// console.log("Line 38 of Tzolkin core",tzolkinGlyphs[dayName]);

		return tzolkinGlyphs[dayName].glyph+' '+tzolkinGlyphs[dayName].desc || "❓";
	}
	// Reference date for Mayan calendar — usually August 11, 3114 BCE in proleptic Gregorian (Mayan creation date)
	// We'll use a simpler modern reference for demonstration:
	// Let's pick December 21, 2012 (the end of the Mayan long count cycle) as a reference point for day 4 Ajaw.
	// That date corresponds to Tzolk'in: 4 Ajaw.
	
	// The epoch date (reference date)
	const epoch = new Date(Date.UTC(2012, 11, 21)); // Dec 21, 2012 (month is 0-based)
	const epochTonalNumber = 4; // tone number at epoch date
	const epochDayNameIndex = 19; // Ajaw is 20th day, index 19 (0-based)

	function daysSinceEpoch(date) {
		// Difference in days between date and epoch
		const msPerDay = 1000 * 60 * 60 * 24;
		return Math.floor((date - epoch) / msPerDay);
	}

	function getTzolkin(date) {
		date = stripTime(date); // <== Important!
		const offset = daysSinceEpoch(date);

		// Calculate the tone number (1-13)
		// The cycle is mod 13, but with offset from epoch tone number
		let toneNumber = ((epochTonalNumber - 1 + offset) % 13) + 1;
		if (toneNumber <= 0) toneNumber += 13;

		// Calculate the day name index (0-19)
		let dayNameIndex = (epochDayNameIndex + offset) % 20;
		if (dayNameIndex < 0) dayNameIndex += 20;

		return {
			toneNumber,
			dayName: dayNames[dayNameIndex],
			glyph: getGlyphForDayName(dayNames[dayNameIndex])
		};
	}

	return {
		getTzolkin
	};
})();

