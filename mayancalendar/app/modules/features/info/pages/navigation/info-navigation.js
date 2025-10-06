// info-navigation.js

export const InfoNavigation = (function () {
	let observer;
	let $navContainer;
	function injectStyles() {
		const style = document.createElement('style');
		style.textContent = `
			#info-nav-buttons {
				position: fixed;
				bottom: 2rem;
				right: 2rem;
				display: none;
				z-index: 1000;
			}

			#info-nav-buttons .arrow-button {
				font-size: 1.5rem;
				padding: 0.5rem 1rem;
				margin: 0 0.25rem;
				cursor: pointer;
				background: #f0f0f0;
				border: 1px solid #ccc;
				border-radius: 5px;
				transition: background 0.2s ease;
			}

			#info-nav-buttons .arrow-button:hover {
				background: #e0e0e0;
			}
		`;
		document.head.appendChild(style);
	}
	
	function createNavButtons1(onPrev, onNext) {
		$navContainer = $('<div id="info-nav-buttons" style="position: fixed; bottom: 1.5em; right: 1.5em; z-index: 1000; display: none;">' +
			'<button id="floating-prev-info" class="arrow-button">⬅️</button>' +
			'<button id="floating-next-info" class="arrow-button">➡️</button>' +
		'</div>');

		$("body").append($navContainer);

		$("#floating-prev-info").on("click", onPrev);
		$("#floating-next-info").on("click", onNext);
	}
	function createNavButtons(onPrev, onNext) {
		$navContainer = document.createElement("div");
		$navContainer.id = "info-nav-buttons";

		const prevBtn = document.createElement("button");
		prevBtn.className = "arrow-button";
		prevBtn.textContent = "⬅️";
		prevBtn.addEventListener("click", () => {
			// window.dispatchEvent(new CustomEvent("info-nav-prev"));
			onPrev();
		});

		const nextBtn = document.createElement("button");
		nextBtn.className = "arrow-button";
		nextBtn.textContent = "➡️";
		nextBtn.addEventListener("click", () => {
			// window.dispatchEvent(new CustomEvent("info-nav-next"));
			onNext();
		});

		$navContainer.appendChild(prevBtn);
		$navContainer.appendChild(nextBtn);
		document.body.appendChild($navContainer);
	}

	function observeVisibility(targetSelector) {
		
		const target = document.querySelector(targetSelector);
		
		console.log("📌 Line 23 info-navigation.js Observing visibility of:", target);
		
		if (!target) {
			console.warn("InfoNavigation: target not found for visibility observer:", targetSelector);
			return;
		}

		observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
					console.log("📌 Line 33 info-navigation.js fading in");
					$navContainer.fadeIn();
					console.log("📌 Line 35 info-navigation.js faded in");
				} else {
					console.log("📌 Line 37 info-navigation.js fading out");
					$navContainer.fadeOut();
					console.log("📌 Line 39 info-navigation.js faded out");
				}
			});
		}, {
			root: null,
			threshold: [0.3] // Show only if ~30% of #calendar-info is visible
		});

		observer.observe(target);
	}

	function init(targetSelector, onPrev, onNext) {
		console.log("📌 InfoNavigation.init Line 47 info-navigation.js targetSelector:", targetSelector);
		const target = document.querySelector(targetSelector);
		if (!target) {
			console.warn(`❌ InfoNavigation: Target element ${containerSelector} not found.`);
			return;
		}
		injectStyles();
		createNavButtons(onPrev, onNext);
		// observeVisibility(targetSelector);
		monitorViewportCoverage(
			target,
			() => $navContainer.style.display = "block",
			() => $navContainer.style.display = "none",
			0.7 // ← means: show when calendar-info covers at least 70% of the viewport
			,200    // lift nav when within 200px of bottom
		);
	}

	function destroy() {
		if (observer) observer.disconnect();
		if ($navContainer) $navContainer.remove();
	}

	function monitorViewportCoverage(targetElement, onShow, onHide, threshold = 0.7, liftDistance = 200) {
		function checkVisibility() {
			const rect = targetElement.getBoundingClientRect();
			const viewportHeight = window.innerHeight;

			// Clamp top and bottom to viewport
			const visibleTop = Math.max(rect.top, 0);
			const visibleBottom = Math.min(rect.bottom, viewportHeight);

			const visibleHeight = Math.max(0, visibleBottom - visibleTop);
			const percentOfViewport = visibleHeight / viewportHeight;

			// Debug (optional)
			// console.log(`Visible: ${Math.round(percentOfViewport * 100)}% of viewport`);

			if (percentOfViewport >= threshold) {
				onShow();
			} else {
				onHide();
			}
			
			// Scroll position from bottom logic
			const scrollTop = window.scrollY || window.pageYOffset;
			const scrollHeight = document.documentElement.scrollHeight;
			const clientHeight = document.documentElement.clientHeight;
			const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

			if (distanceFromBottom < liftDistance) {
				$navContainer.style.bottom = `${liftDistance - distanceFromBottom + 16}px`; // lift upward
			} else {
				$navContainer.style.bottom = `2rem`; // default
			}
		
		}

		// Listen to scroll and resize
		window.addEventListener("scroll", checkVisibility, { passive: true });
		window.addEventListener("resize", checkVisibility);

		// Initial check
		checkVisibility();
	}


	return {
		init,
		destroy
	};
})();
