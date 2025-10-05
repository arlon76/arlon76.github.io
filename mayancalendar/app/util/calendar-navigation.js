// calendar-navigation.js
export const CalendarNavigation = (function () {
	let $container;
	let currentDate = new Date();
	let allUIs;
	// console.log("✅ CalendarNavigation loaded, line 6 of calendar-navigation.js");
	function init(containerSelector, allUIsParam) {
		allUIs=allUIsParam;
		// console.log("✅ CalendarNavigation init() happening, line 9 of calendar-navigation.js");
		$container = $(containerSelector);

		if ($container.find(".calendar-nav").length === 0) {
			const navHtml = `
				<div class="calendar-nav" style="margin-top: 1rem;">
					<button class="prev-day">⏮️ Prev</button>
					<button class="today">🔄 Today</button>
					<button class="next-day">⏭️ Next</button>
				</div>
			`;
			$container.append(navHtml);
		}

		$container.find(".prev-day").on("click", () => shiftDate(-1));
		$container.find(".today").on("click", () => setDate(new Date()));
		$container.find(".next-day").on("click", () => shiftDate(1));

		updateAll();
	}

	function shiftDate(days) {
		currentDate.setDate(currentDate.getDate() + days);
		updateAll();
	}

	function setDate(date) {
		currentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
		updateAll();
	}

	function updateAll() {
		for (const ui of allUIs) {
			ui.update(currentDate);
		}
	}

	return {
		init
	};
})();

