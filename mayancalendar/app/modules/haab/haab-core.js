// haab-core.js

export const Haab = (function() {
	const monthNames = [
		"Pop", "Wo'", "Sip", "Sotz'", "Sek", "Xul", "Yaxk'in",
		"Mol", "Ch'en", "Yax", "Sak'", "Keh", "Mak", "K'ank'in",
		"Muwan", "Pax", "K'ayab", "Kumk'u", "Wayeb'"
	];
	
	const haabGlyphs = {
		"Pop": { glyph: "🪶🧘         🌀🌿", desc: "Beginning, Mat, Ceremony"},
		"Wo'": { glyph: "🌑🌌         🌊🌙", desc: "Water, Night, Black, Conjunction, Darkness"},
		"Sip": { glyph: "🔴🔥         🌿🩸", desc: "Growth, Blood, Red, Fire"},
		"Sotz'": { glyph: "🦇🌙         🦇🌘", desc: "Bat, Darkness, Night"},
		"Sek": { glyph: "💀⚰️         🌾🔥", desc: "Maize, Fire, Death, End"},
		"Xul": { glyph: "🧍‍♂️📿         🦎💀", desc: "Dog, Death, Person, Offering"},
		"Yaxk'in": { glyph: "🌞 🪷 🌄", desc: "Sun, Warmth, New Sun, First Light"}, // ****
		"Mol": { glyph: "💧 🌧️ ⛅", desc: "Rain, Clouds"}, // ****
		"Ch'en": { glyph: "🌌 🏞️ 🌘", desc: "Cave, Darkness, Night"}, // ****
		"Yax": { glyph: " 🪷 🟢 🌱 🕊️", desc: "Green, Renewal, First"}, // ****
		"Sak'": { glyph: "🤍🌕         ✨⚪", desc: "White, Purity, Bright"},
		"Keh": { glyph: "🌿🦌         🦌🌲", desc: "Deer, Nature"},
		"Mak": { glyph: "🔒🕳️         🌄🔒", desc: "Closed, Hidden"},
		"K'ank'in": { glyph: "🌕 🔥 🌻", desc: "Sun, Fire, Yellow"}, // ****
		"Muwan": { glyph: "🔥🦅         🦉🌩️", desc: "Owl, Storm, Fire, Bird"},
		"Pax": { glyph: "🪖🎶         ⚔️🌿", desc: "War, Forest, Music"},
		"K'ayab": { glyph: "🐟🌊         🐠🌊", desc: "Fish, Water, Turtle, Beach"},
		"Kumk'u": { glyph: "🌾🌧️         🌽🪵", desc: "Maize, Wood, Granary, Abundance"},
		"Wayeb'": { glyph: "😱🚫         ⚠️🕳️", desc: "Unlucky, Void, Ominous"}
	};
	
	function getGlyphForMonthName(monthName) {
		return haabGlyphs[monthName].glyph+' '+haabGlyphs[monthName].desc || "❓";
	}	
	// Dec 21, 2012 was 3 K'ank'in
	const epoch = new Date(Date.UTC(2012, 11, 21)); // Dec 21, 2012
	const epochDay = 3;
	const epochMonthIndex = 13; // K'ank'in is 14th month (0-based = 13)

	function daysSinceEpoch(date) {
		const msPerDay = 1000 * 60 * 60 * 24;
		const strippedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
		const strippedEpoch = new Date(epoch.getFullYear(), epoch.getMonth(), epoch.getDate());

		return Math.floor((strippedDate - strippedEpoch) / msPerDay);
	}

	function getHaab(date) {
		date = stripTime(date); // <== Important!
		const offset = daysSinceEpoch(date);
		const haabDayNumber = (epochMonthIndex * 20 + epochDay + offset) % 365;
		console.log('Line 49 of haab-core.js says haabDayNumber is:'+haabDayNumber)
		if (haabDayNumber >= 360) {
			// Wayeb'
			return {
				dayNumber: haabDayNumber - 360,
				monthName: "Wayeb'",
				glyph: getGlyphForDayName(monthName)
			};
		} else {
			const monthIndex = Math.floor(haabDayNumber / 20);
			const dayNumber = haabDayNumber % 20;
			return {
				dayNumber,
				monthName: monthNames[monthIndex],
				glyph: getGlyphForMonthName(monthNames[monthIndex])
			};
		}
	}

	return {
		getHaab
	};
})();

