// dreamspell-core.js

export const DreamSpell = (function () {
	
	const seals = [
		{
			num: 1,
			kin: "Imix",
			name: "Dragon",
			color: "Red",
			glyph: "🐉",
			keywords: ["Birth", "Nurturing", "Being"]
		},
		{
			num: 2,
			kin: "Ik’",
			name: "Wind",
			color: "White",
			glyph: "🌬️ 💨",
			keywords: ["Spirit", "Communication", "Breath"]
		},
		{
			num: 3,
			kin: "Ak’bal",
			name: "Night",
			color: "Blue",
			glyph: "🌌",
			keywords: ["Dream", "Intuition", "Abundance"]
		},
		{
			num: 4,
			kin: "K’an",
			name: "Seed",
			color: "Yellow",
			glyph: "🌱",
			keywords: ["Target", "Awareness", "Flowering"]
		},
		{
			num: 5,
			kin: "Chikchan",
			name: "Serpent",
			color: "Red",
			glyph: "🐍",
			keywords: ["Life Force", "Survival", "Instinct"]
		},
		{
			num: 6,
			kin: "Kimi",
			name: "Worldbridger",
			color: "White",
			glyph: "🌉",
			keywords: ["Death", "Opportunity", "Equality"]
		},
		{
			num: 7,
			kin: "Manik’",
			name: "Hand",
			color: "Blue",
			glyph: "✋ 🤲",
			keywords: ["Healing", "Accomplishment", "Knowledge"]
		},
		{
			num: 8,
			kin: "Lamat",
			name: "Star",
			color: "Yellow",
			glyph: "⭐",
			keywords: ["Beauty", "Elegance", "Art"]
		},
		{
			num: 9,
			kin: "Muluk",
			name: "Moon",
			color: "Red",
			glyph: "🌙 🌕",
			keywords: ["Purification", "Flow", "Universal Water"]
		},
		{
			num: 10,
			kin: "Ok",
			name: "Dog",
			color: "White",
			glyph: "🐕",
			keywords: ["Love", "Loyalty", "Heart"]
		},
		{
			num: 11,
			kin: "Chuwen",
			name: "Monkey",
			color: "Blue",
			glyph: "🐒",
			keywords: ["Play", "Magic", "Illusion"]
		},
		{
			num: 12,
			kin: "Eb",
			name: "Human",
			color: "Yellow",
			glyph: "👤",
			keywords: ["Wisdom", "Free Will", "Influence"]
		},
		{
			num: 13,
			kin: "B’en",
			name: "Skywalker",
			color: "Red",
			glyph: "🚀",
			keywords: ["Explore", "Space", "Wakefulness"]
		},
		{
			num: 14,
			kin: "Ix",
			name: "Wizard",
			color: "White",
			glyph: "🧙‍♂️",
			keywords: ["Receptivity", "Timelessness", "Enchantment"]
		},
		{
			num: 15,
			kin: "Men",
			name: "Eagle",
			color: "Blue",
			glyph: "🦅",
			keywords: ["Vision", "Creativity", "Mind"]
		},
		{
			num: 16,
			kin: "K’ib",
			name: "Warrior",
			color: "Yellow",
			glyph: "🛡️ ⚔️",
			keywords: ["Intelligence", "Fearlessness", "Question"]
		},
		{
			num: 17,
			kin: "Kaban",
			name: "Earth",
			color: "Red",
			glyph: "🌍",
			keywords: ["Navigation", "Synchronicity", "Evolution"]
		},
		{
			num: 18,
			kin: "Etz’nab",
			name: "Mirror",
			color: "White",
			glyph: "🪞",
			keywords: ["Endlessness", "Reflection", "Order"]
		},
		{
			num: 19,
			kin: "Kawak",
			name: "Storm",
			color: "Blue",
			glyph: "🌩️ ⛈️",
			keywords: ["Catalyst", "Energy", "Self-generation"]
		},
		{
			num: 20,
			kin: "Ajaw",
			name: "Sun",
			color: "Yellow",
			glyph: "☀️",
			keywords: ["Enlightenment", "Life", "Universal Fire"]
		}
	];

	const tones = [
		{ num: 1, name: "Magnetic", keywords: ["Unify", "Attract", "Purpose"] },
		{ num: 2, name: "Lunar", keywords: ["Polarize", "Stabilize", "Challenge"] },
		{ num: 3, name: "Electric", keywords: ["Activate", "Bond", "Service"] },
		{ num: 4, name: "Self-Existing", keywords: ["Define", "Measure", "Form"] },
		{ num: 5, name: "Overtone", keywords: ["Empower", "Command", "Radiance"] },
		{ num: 6, name: "Rhythmic", keywords: ["Organize", "Balance", "Equality"] },
		{ num: 7, name: "Resonant", keywords: ["Channel", "Inspire", "Attunement"] },
		{ num: 8, name: "Galactic", keywords: ["Harmonize", "Model", "Integrity"] },
		{ num: 9, name: "Solar", keywords: ["Pulse", "Realize", "Intention"] },
		{ num: 10, name: "Planetary", keywords: ["Perfect", "Produce", "Manifestation"] },
		{ num: 11, name: "Spectral", keywords: ["Dissolve", "Release", "Liberation"] },
		{ num: 12, name: "Crystal", keywords: ["Dedicate", "Universalize", "Cooperation"] },
		{ num: 13, name: "Cosmic", keywords: ["Endure", "Transcend", "Presence"] }
	];
	
	function getColorGlyph(color) {
		const glyphs = {
			blue:   ['🌀', '🔮', '🌍', '💧', '📘', '💎', '🌊', '🐟', '🔷', '🛸', '🏞️'],
			red:    ['🌶️', '🧱', '🧰', '🔴', '🌉', '🧨', '⛩️', '💅', '🏵️', '🎯'],
			yellow: ['👉', '☀️', '💡', '🟡', '⚠️', '✨', '🌞', '💥', '😎', '🌽', '💫', '🌙', '🪔'],
			white:  ['🌫️', '👻', '📈', '📉', '💀']
		};

		const options = glyphs[color.toLowerCase()];
		if (!options) return '';
		
		// Pick one at random
		const i = Math.floor(Math.random() * options.length);
		return options[i];
	}

	function daysSinceDreamSpellEpoch(date) {
		const epoch = new Date(Date.UTC(1987, 7, 16));
		const msPerDay = 86400000;
		return Math.floor((stripTime(date) - epoch) / msPerDay);
	}

	function stripTime(date) {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate());
	}

	function getDreamSpell(date = new Date()) {
		const offset = daysSinceDreamSpellEpoch(date);
		const kinNumber = ((offset % 260) + 260) % 260 || 260;
		const toneNumber = ((kinNumber - 1) % 13) + 1;
		const sealIndex = ((kinNumber - 1) % 20);

		const tone = tones[toneNumber - 1];
		const seal = seals[sealIndex];

		const oracle = getOracle(seal.num);

		const wavespellStartKin = kinNumber - ((toneNumber - 1) % 13);

		return {
			kin: kinNumber,
			tone,
			seal,
			color: seal.color,
			// colorGlyph: getColorGlyph(seal.color), // update this faster, don't pre-calculate
			oracle,
			wavespellStartKin
		};
	}

	function getOracle(sealNum) {
		const mod = n => ((n - 1 + 20) % 20);
		return {
			guide: seals[mod(sealNum)], // simplified
			analog: seals[mod(21 - sealNum)],
			antipode: seals[mod(sealNum + 10)],
			occult: seals[mod(21 - sealNum)]
		};
	}

	function get13MoonDate(date = new Date()) {
		const start = new Date(Date.UTC(date.getFullYear(), 6, 26));
		let year = date.getFullYear();
		if (date < start) year--;

		const yearStart = new Date(Date.UTC(year, 6, 26));
		const dayOfYear = Math.floor((stripTime(date) - yearStart) / 86400000);
		const moon = Math.floor(dayOfYear / 28) + 1;
		const day = (dayOfYear % 28) + 1;

		return { year, moon, day };
	}

	return {
		getDreamSpell,
		get13MoonDate,
		seals,
		tones,
		getColorGlyph
	};
})();
