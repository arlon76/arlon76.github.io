// dreamscape-ui.js

// import { DreamSpell } from '/app/modules/dreamspell/dreamspell-core.js';
import { DreamSpell } from './dreamspell-core.js';

export const DreamSpellUI = (function(){
	
	let $container;

	function init(containerSelector) {
		$container = $(containerSelector);
		if (!$container.length) {
			console.warn("DreamSpellUI: No container found with ID or class 'dreamspell'");
			return;
		}
		
		// Create a box for this UI
		const $box = $('<div class="info-box dreamspell-box" id="dreamspell"></div>');
		$container.append($box);

		// Store this box reference for updates
		$container = $box;

		update(); // Optional: render current date on init
	}
	
	function update(date = new Date()) {
		
		if (!$container.length) return;

		const data = DreamSpell.getDreamSpell(date);
		const moonDate = DreamSpell.get13MoonDate(date);

		$container.empty(); // Clear before re-rendering

		const $main = $('<div class="dreamspell-main"></div>');

		// 🌀 Kin Block
		const $kinBlock = $(`
			<div class="kin-block" style="/*border-left: 5px solid ${data.color.toLowerCase()}*/"><!--optional border color matching kin color - instead do a transparent underlay -->
				<div class="kin-number">Kin ${data.kin}</div>
				<div class="kin-name">${data.tone.name} ${data.seal.kin}</div>
				<div class="kin-glyph">${data.seal.glyph}</div>
				<div class="kin-keywords">${data.seal.keywords.join(', ')}</div>
				<div class="tone-keywords">${data.tone.keywords.join(', ')}</div>
			</div>
		`);
		$main.append($kinBlock);

		// 🔮 Oracle Block
		const $oracle = $(`
			<div class="oracle-block">
				<h3>Oracle</h3>
				<ul>
					<li><strong>Guide:</strong> ${data.oracle.guide.name} ${data.oracle.guide.glyph}</li>
					<li><strong>Analog:</strong> ${data.oracle.analog.name} ${data.oracle.analog.glyph}</li>
					<li><strong>Antipode:</strong> ${data.oracle.antipode.name} ${data.oracle.antipode.glyph}</li>
					<li><strong>Occult:</strong> ${data.oracle.occult.name} ${data.oracle.occult.glyph}</li>
				</ul>
			</div>
		`);
		$main.append($oracle);

		// 📅 Wavespell Block
		const $wavespell = $(`
			<div class="wavespell-block">
				<h3>Wavespell</h3>
				<div>Wavespell starts at Kin ${data.wavespellStartKin}</div>
			</div>
		`);
		$main.append($wavespell);

		// 🌙 13 Moon Calendar Block
		const $moon = $(`
			<div class="moon-calendar">
				<h3>13 Moon Calendar</h3>
				<div>Year: ${moonDate.year}</div>
				<div>Moon: ${moonDate.moon}</div>
				<div>Day: ${moonDate.day} of Moon ${moonDate.moon}</div>
			</div>
		`);
		$main.append($moon);

		$container.append($main);
		
		if('simple colors, shimmer only white'==true){
		// $main.css('background-color', getColorTint(data.color)); // how 'bout a taste of some white checkers, huh?
		let bg = getColorTint(data.color)
		if (bg === 'checkers') {
			$main.css({
				'background-image': `
					linear-gradient(45deg, rgba(255,255,255,0.12) 25%, transparent 25%),
					linear-gradient(-45deg, rgba(255,255,255,0.12) 25%, transparent 25%),
					linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.12) 75%),
					linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.12) 75%)`,
				'background-size': '20px 20px',
				'background-position': '0 0, 0 10px, 10px -10px, -10px 0px',
				'background-color': 'rgba(255,255,255,0.04)'
			});
			
			$main.css({
				'background-image': `
					linear-gradient(45deg, rgba(255,255,255,0.18) 25%, transparent 25%),
					linear-gradient(-45deg, rgba(255,255,255,0.18) 25%, transparent 25%),
					linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.18) 75%),
					linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.18) 75%)`,
				'background-size': '16px 16px',
				'background-position': '0 0, 0 8px, 8px -8px, -8px 0px',
				'background-color': 'rgba(255,255,255,0.06)'
			});
			
			$main.css({
				'background-image': `
					linear-gradient(45deg, rgba(255,255,255,0.38) 25%, transparent 25%),
					linear-gradient(-45deg, rgba(255,255,255,0.38) 25%, transparent 25%),
					linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.38) 75%),
					linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.38) 75%)`,
				'background-size': '16px 16px',
				'background-position': '0 0, 0 8px, 8px -8px, -8px 0px',
				'background-color': 'rgba(255,255,255,0.06)'
			});
			// $main.removeAttr('style'); // Clear inline styles if needed
			$main.addClass('shimmer-bg');
		} else {
			$main.css('background-color', bg );
		}
		}

		function getShimmerBackground(colorName) {
			const shimmerBase = {
				size: '16px 16px',
				position: '0 0, 0 8px, 8px -8px, -8px 0px',
			};

			const backgrounds = {
				white: [
					'linear-gradient(45deg, rgba(255,255,255,0.38) 25%, transparent 25%)',
					'linear-gradient(-45deg, rgba(255,255,255,0.38) 25%, transparent 25%)',
					'linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.38) 75%)',
					'linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.38) 75%)',
				],
				red: [
					'linear-gradient(45deg, rgba(255, 80, 80, 0.12) 25%, transparent 25%)',
					'linear-gradient(-45deg, rgba(255, 80, 80, 0.12) 25%, transparent 25%)',
					'linear-gradient(45deg, transparent 75%, rgba(255, 80, 80, 0.12) 75%)',
					'linear-gradient(-45deg, transparent 75%, rgba(255, 80, 80, 0.12) 75%)',
				],
				blue: [
					'linear-gradient(45deg, rgba(120, 180, 255, 0.12) 25%, transparent 25%)',
					'linear-gradient(-45deg, rgba(120, 180, 255, 0.12) 25%, transparent 25%)',
					'linear-gradient(45deg, transparent 75%, rgba(120, 180, 255, 0.12) 75%)',
					'linear-gradient(-45deg, transparent 75%, rgba(120, 180, 255, 0.12) 75%)',
				],
				yellow: [
					'linear-gradient(45deg, rgba(255, 255, 180, 0.38) 25%, transparent 25%)',
					'linear-gradient(-45deg, rgba(255, 255, 180, 0.38) 25%, transparent 25%)',
					'linear-gradient(45deg, transparent 75%, rgba(255, 255, 180, 0.38) 75%)',
					'linear-gradient(-45deg, transparent 75%, rgba(255, 255, 180, 0.38) 75%)',
				],
			};

			const bg = backgrounds[colorName.toLowerCase()] || backgrounds.white;
			return {
				'background-image': bg.join(', '),
				'background-size': shimmerBase.size,
				'background-position': shimmerBase.position,
				'background-color': 'rgba(255,255,255,0.06)',
			};
		}
		
		$main.removeClass('shimmer-checkers shimmer-white shimmer-red shimmer-blue shimmer-yellow');

		let colorClass = getColorClass(data.color);
		$main.addClass(colorClass);
		
		// Apply dynamic background image + color
		$main.css(getShimmerBackground(data.color));

		$main.css('box-shadow', 'inset 0 0 0 1px rgba(255,255,255,0.15)');

		function getColorTint(colorName) {
			const colors = {
				// red:    'rgba(255, 0, 0, 0.07)',
				// blue:   'rgba(0, 0, 255, 0.07)',
				// yellow: 'rgba(255, 255, 0, 0.07)',
				// white:  'rgba(255, 255, 255, 0.07)',
				white:  'checkers'  // special case
				
				// ,red:    'rgba(255, 100, 100, 0.05)'  // Softer red (less saturation)
				// ,blue:   'rgba(100, 150, 255, 0.05)'  // Soft blue/sky tone
				// ,yellow: 'rgba(255, 255, 150, 0.10)'  // Boosted yellow with higher opacity
				
				
				,red:    'rgba(255, 80, 80, 0.035)'    // Less opacity and softened red
				,blue:   'rgba(120, 180, 255, 0.035)'  // Cooler, gentler blue
				,yellow: 'rgba(255, 255, 180, 0.55)'   // Boosted contrast for yellow
			};
			return colors[colorName.toLowerCase()] || 'rgba(255, 255, 255, 0.05)';
		}
		function getColorClass(colorName) {
			/*
			const classes = {
				red:    'shimmer-checkers shimmer-red',
				blue:   'shimmer-checkers shimmer-blue',
				yellow: 'shimmer-checkers shimmer-yellow',
				white:  'shimmer-checkers shimmer-white'
			};
			return classes[colorName.toLowerCase()] || 'shimmer-checkers shimmer-white';
			*/
			return 'shimmer-checkers'; // this adds only the checker shimmer structure
		}
		$main.css('box-shadow', '0 0 5px rgba(0, 0, 0, 0.05)');
		$main.css('border-radius', '8px'); // if not already done via .info-box
		
		const $tooltip = $('#dreamspell-tooltip');
		
		let emoji_text;
		$main.on('mouseenter', function (e) {
			// const newGlyph = DreamSpell.getColorGlyph(data.color);
			// $main.attr('title', `ⓘ DreamSpell Color: ${data.color} ${newGlyph}`);
			emoji_text = DreamSpell.getColorGlyph(data.color);
			data.colorGlyph=emoji_text;
			const text = `DreamSpell Color: ${data.color} ${emoji_text}`;
			$tooltip.text(text).css({
				display: 'block',
				left: e.pageX + 15,
				top: e.pageY + 15,
				opacity: 1
			});
		});
		$main.on('mousemove', function (e) {
			$tooltip.css({
				left: e.pageX + 15,
				top: e.pageY + 15
			});
		});

		$main.on('mouseleave', function () {
			$main.removeAttr('title'); // or keep last one if you prefer
			$tooltip.css({ opacity: 0, display: 'none' });
		});
		$main.addClass('tooltip');
		$main.prepend(`<div class="color-label">DreamSpell Color: ${data.color}</div>`);

		// console.log(data.color)
		// console.log("🔎 data.color is:", data.color, typeof data.color);
		if( data.color!='White')$tooltip.css({
			background:getColorTint(data.color.toLowerCase() || 'white')
		});
		
		let $emoji;
		$main.on('mouseenter', function(e) {		
		// Remove any existing floating emoji to avoid duplicates
		$('.floating-color-emoji').remove();

		// Create a new emoji span
		$emoji = $('<span class="floating-color-emoji" style="width:100px;height:100px;color:red;">'+emoji_text+'</span>')
			// .text(data.colorGlyph)
			.appendTo('body');
			
		console.log("🌀 Emoji appended", $emoji.get(0));
		});
		
		// Position it near the hovered element
		$main.on('mousemove', function(e) {
			// console.log("mousemove!", e.pageX, e.pageY);
			$emoji.css({
				left: e.pageX + 198 + 'px', /* Change the integer here to position the larger emoji icon over the smaller one */
				top: e.pageY + 22 + 'px'
			});
			// $emoji.css({transform: `translate(${e.clientX + 32}px, ${e.clientY + 48}px)`});
		});
		
		// console.log("Color Glyph:", DreamSpell.getColorGlyph('Red')); // works fine
		
		// Clean up when mouse leaves
		$main.on('mouseleave', function() {
			$emoji.remove();
		});


	}

	return {
		init,
		update
	};
	
})();
