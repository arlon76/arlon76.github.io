// info-pages.js
import { InfoNavigation } from './navigation/info-navigation.js';
export const InfoPages = (function () {
	
	let $container;
	// Page Info Section:
	let currentPage = 0;
	let pages = [];

	// console.log("✅ InfoPages loaded, line 6 of info-pages.js");
	function init() {
		const containerSelector='#calendar-info'; // not sure what to do about this quite yet
		// console.log("✅ InfoPages init() happening, line 9 of info-pages.js");
		$container = $(containerSelector);
		if (!$container.length) {
			console.error(`InfoPages: container '${containerSelector}' not found.`);
			return;
		}

		// console.log("✅ index, line 510");
		$.getJSON("app/resources/info.json", function(JSONdata) { //so far I've tried app/res..., /app/re... and ./app/... This is index.html app is in the directory with index.html
			// console.log("✅ index, line 512, JSON info loaded");
			pages = JSONdata;
			loadPage(0);
			// console.log("✔ index, line 515,  Pages loaded, and #pages is: "+pages.length, pages);
			
			// Init floating nav
			// console.log("✅ index, line 28, containerSelector: "+containerSelector);
			InfoNavigation.init(containerSelector, goPrev, goNext);
				
		}).fail(function(jqxhr, textStatus, error) {
			console.error("❌ Failed to load JSON:", textStatus, error); // this is line 156
		});

	}
	function goPrev() {
		const prev = (currentPage - 1 + pages.length) % pages.length;
		loadPage(prev);
	}

	function goNext() {
		const next = (currentPage + 1) % pages.length;
		loadPage(next);
	}

	// console.log("✅ index, line 485");
	function loadPage(n) {
		// console.log("✅ index, line 487, loadPage happening");
		if (pages.length === 0) return;
		const page = pages[n];
		// $("#calendar-info").html(`
		// $("#"+containerSelector).html(`
		$container.html(`
			<h3>${page.title}</h3>
			<div style="margin-top: 1em;">
				<button class="arrow-button" id="prev-info">⬅️</button>
				<button class="arrow-button" id="next-info">➡️</button>
			</div>
			<p>${page.body}</p>
		`);
		currentPage = n;

		// $("#prev-info").on("click", () => {
			// if (currentPage > 0) loadPage(currentPage - 1);
			// else loadPage(pages.length - 1);
		// });
		// $("#next-info").on("click", () => {
			// if (currentPage < pages.length - 1) loadPage(currentPage + 1);
			// else loadPage(0);
		// });
				// Inline buttons
		$container.find("#prev-info").on("click", goPrev);
		$container.find("#next-info").on("click", goNext);
	}
	
	return {
		init
	};
	
})();

