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
			const OLDnavHtml = `
				<div class="calendar-nav" style="margin-top: 1rem;">
					<button class="prev-day">⏮️ Prev</button>
					<button class="today">🔄 Today</button>
					<button class="next-day">⏭️ Next</button>
				</div>
			`;
			const navHtml = `
				<div class="floating-nav-wrapper">
					<div class="calendar-nav-fixed floating-nav">
						<button class="prev-day">⬅️</button>
						<button class="today">💫</button>
						<button class="next-day">➡️</button>
					</div>
				</div>
			`;
			$container.append(navHtml);
		}

		$container.find(".prev-day").on("click", () => shiftDate(-1));
		$container.find(".today").on("click", () => setDate(new Date()));
		$container.find(".next-day").on("click", () => shiftDate(1));

		updateAll();
		updateFloatingNavPosition();
		
		function disappearNavAtBottom(){
	
		  const nav = document.querySelector('.floating-nav-wrapper');
		  const calendar = document.getElementById('mayan-calendar');

		  // Set up an IntersectionObserver to monitor the visibility of #mayan-calendar
		  
		  let threshold=0.05;
		  const observer = new IntersectionObserver(
			(entries) => {
			  const entry = entries[0];
			  if (entry.intersectionRatio < threshold) {
				// Less than 10% visible — fade nav out
				nav.classList.add('hidden');
			  } else {
				// At least 10% visible — show nav
				nav.classList.remove('hidden');
			  }
			},
			{
			  threshold: [threshold], // triggers when 10% of the element is visible or not
			}
		  );

		  observer.observe(calendar);
  
		}
		
		disappearNavAtBottom();
		
		window.addEventListener('scroll', updateFloatingNavPosition);
		window.addEventListener('resize', updateFloatingNavPosition);

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

	function updateFloatingNavPosition() {
		
		const nav = document.querySelector('.floating-nav');
		if (!nav) return;
		
		const footerHeight = 310; // Height of the footer or bottom banner
		// const headerHeight = 100; // amount of space you'd want to clear (e.g. site banner)
		// const headerHeight = 26; // amount of space you'd want to clear (e.g. site banner)
		// const headerHeight = 326; // amount of space you'd want to clear (e.g. site banner)
		// const headerHeight = 342; // amount of space you'd want to clear (e.g. site banner)
		// const headerHeight = 393; // amount of space you'd want to clear (e.g. site banner)
		// const headerHeight = 345; // amount of space you'd want to clear (e.g. site banner)
		const headerHeight = 100; // amount of space you'd want to clear (e.g. site banner)
		const buffer = 40; // Additional padding to avoid overlap
		const startOffset = 32; // normal floating position in px
		
		const viewportHeight = window.innerHeight;
		const scrollPosition = window.scrollY + window.innerHeight;
		const pageHeight = document.body.scrollHeight;

		const distanceFromBottom = pageHeight - (window.scrollY + viewportHeight);

		const maxOffset = footerHeight + buffer;

		let bottomOffset;
		let topOffset;

		// if ((pageHeight - scrollPosition) < (footerHeight + buffer)) { // for bottom stickyness
			if (window.scrollY <= maxOffset) { // for top stickyness
			// Near the bottom – avoid covering the footer
			// nav.classList.add('floating-nav--shifted');

			// We're nearing the bottom: start lifting the nav up
			const ratio = distanceFromBottom / maxOffset;
			bottomOffset = startOffset + (1 - ratio) * (footerHeight); // smoothly increase bottom offset

			// Still near top of page, start lifting nav up toward header
			const topRatio = window.scrollY / maxOffset;
			topOffset = startOffset + (1 - topRatio) * headerHeight;

		} else {
			// Safe to float
			// nav.classList.remove('floating-nav--shifted');
			
			// Plenty of room: keep it at default position
			bottomOffset = startOffset;
			topOffset = startOffset;
		}
		
		// nav.style.bottom = `${bottomOffset}px`;
		nav.style.top = `${topOffset}px`;
		nav.style.bottom = 'auto';
	}


	return {
		init
		,updateFloatingNavPosition
	};
	
})();

/*
if(false)document.addEventListener('DOMContentLoaded', () => {		//		Replaced the need for this with the next two lines called above in init()
	window.addEventListener('scroll', MayanCalendarController.CalendarNavigation.updateFloatingNavPosition);
	window.addEventListener('resize', MayanCalendarController.CalendarNavigation.updateFloatingNavPosition);
	
	// document.addEventListener('DOMContentLoaded', MayanCalendarController.CalendarNavigation.updateFloatingNavPosition);
	
	// Initial position update
	// MayanCalendarController.CalendarNavigation.updateFloatingNavPosition();
});
*/