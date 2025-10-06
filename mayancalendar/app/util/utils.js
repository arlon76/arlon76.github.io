//utils.js

/**
 * stripTime gets the time off a date
 */
function stripTime(date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * ScheduleDailyUpdate changes the day at midnight+0.1 second
 */
function scheduleDailyUpdate(updateFunc) {
	function runAndScheduleNext() {
		const now = new Date();
		updateFunc(stripTime(now));	// always pass stripped date

		const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0.1/* 0.1 seconds - change to 1 if it doesn't change the date at midnight - what this is doing is setting a timer for midnight plus a tenth of a second, so at midnight plus a tenth of a second the calendar will switch days - I'm not sure of the logic, if it will change the day if you're on some random day, or not - but that's what this is doing, so if you load the page, and let it sit, hopefully at midnight the date will change. Whether it changes if you're on another day isn't clear to me at the moment. My guess is it will change it to the new today at midnight no matter what day you're on - which could be construed as a bug - so - to be re-visited if necessary. */);
		 console.log(
			`%c⏰ Next calendar update scheduled for: ${tomorrow.toString()}`,
			'color: green; font-weight: bold'
		);
		 const delay = tomorrow - now;
			setTimeout(runAndScheduleNext, delay);
		}

	runAndScheduleNext();
}


/**
 * Converts a decimal number into an array of Mayan glyph characters (from top to bottom)
 * Each glyph represents a base-20 digit, using Unicode codepoints U+1D2E0 to U+1D2F3
 */
function convertToMayanGlyphs(number) {
  if (isNaN(number) || number < 0) return [];

  let num = Math.floor(number);
  const glyphs = [];

  do {
    const digit = num % 20;
    const codePoint = 0x1D2E0 + digit;  // U+1D2E0 to U+1D2F3
    glyphs.unshift(String.fromCodePoint(codePoint)); // Stack top-to-bottom
    num = Math.floor(num / 20);
  } while (num > 0);

  return glyphs;
}


/**
 * createHtmlTagUtility1 Converts JSON to HTML
 * Usage examples:
 *
tag.div("Hello World", { class: "greeting" });
tag.button("Click me", { onclick: "alert('hi')" });
tag.ul(
  tag.li("Item 1") + tag.li("Item 2"),
  { class: "list" }
);
 */
function createHtmlTagUtility1(){
  return new Proxy(
    function (tag, content, attributes = {}) {
      const attrString = Object.entries(attributes)
        .map(([k, v]) => `${k}="${v}"`)
        .join(" ");
      return `<${tag} ${attrString}>${content}</${tag}>`;
    },
    {
      get: (target, tag) => (content, attributes = {}) =>
        target(tag, content, attributes),
    }
  );
}

/**
 * escapeHtml(str)
 */
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (char) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char];
  });
}

// Set of self-closing tags per HTML spec
/**
 * SELF_CLOSING_TAGS
 et of self-closing tags per HTML spec
 */
const SELF_CLOSING_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img",
  "input", "link", "meta", "source", "track", "wbr"
]);

/**
 * createHtmlTagUtility1 Converts JSON to HTML
 * Usage examples:
 *
tag.div("Hello World", { class: "greeting" });
tag.button("Click me", { onclick: "alert('hi')" });
tag.ul(
  tag.li("Item 1") + tag.li("Item 2"),
  { class: "list" }
  
  🧪 Examples
// Basic tag with attributes
console.log(tag.div("Hello World", { class: "greeting" }));
// → <div class="greeting">Hello World</div>

// Self-closing (auto-detected)
console.log(tag.br());
// → <br>

// Manual self-closing override
console.log(tag.div("", {}, true));
// → <div>

// Custom component
console.log(tag["custom-element"]("Hey!", { "data-id": 123 }));
// → <custom-element data-id="123">Hey!</custom-element>

// Unsafe content becomes safe
console.log(tag.div('<script>alert("x")</script>', { title: `"bad"` }));
// → <div title="&quot;bad&quot;">&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;</div>
💡 Use as You Like
If you want to define shortcuts:

const div = tag.div;
const button = tag.button;

const html = div(
  button("Click Me", { onclick: "doSomething()" }),
  { class: "container" }
);
🤝 You Now Have:
Safety ✔

Elegance ✔

Extendability ✔

No dependencies ✔

And zero React in sight ✔✔✔

);
 */
function createHtmlTagUtility() {
  // Core tag function
  const core = function(tag, content = "", attributes = {}, selfClosing = null) {
    const attrString = Object.entries(attributes)
      .map(([k, v]) => ` ${k}="${escapeHtml(v)}"`)
      .join("");

    // Detect if it's a self-closing tag
    const isSelfClosing = selfClosing ?? SELF_CLOSING_TAGS.has(tag.toLowerCase());

    if (isSelfClosing) {
      return `<${tag}${attrString}>`; // No closing tag for self-closing
    }

    // return `<${tag}${attrString}>${escapeHtml(content)}</${tag}>`;
	  // Only escape if content is not a string that looks like HTML
  const escapedContent = typeof content === "string" && !content.startsWith("<")
    ? escapeHtml(content)
    : content;

  // return `<${tag}${attrString}>${escapedContent}</${tag}>`;
  return `<${tag}${attrString}>${content}</${tag}>`;
  };

  // Proxy so you can call tag.div(...), tag.span(...), etc.
  return new Proxy(core, {
    get: (target, tagName) => (content = "", attributes = {}, selfClosing = null) =>
      target(tagName, content, attributes, selfClosing)
  });
}

// Create the tag utility
// const tag = createHtmlTagUtility(); // replace with the below

// 4. DOM node utility
function createDomTagUtility() {
  return new Proxy(
    function (tag, content = "", attributes = {}, selfClosing = false) {
      const el = document.createElement(tag);
      Object.entries(attributes).forEach(([k, v]) => el.setAttribute(k, v));

      if (typeof content === "string") {
        el.textContent = content;
      } else if (content instanceof Node) {
        el.appendChild(content);
      } else if (Array.isArray(content)) {
        content.forEach(child => {
          if (typeof child === "string") {
            el.appendChild(document.createTextNode(child));
          } else if (child instanceof Node) {
            el.appendChild(child);
          }
        });
      }

      return el;
    },
    {
      get: (target, tag) => (content = "", attributes = {}, selfClosing = false) =>
        target(tag, content, attributes, selfClosing)
    }
  );
}


// 5. Create the final tag utility
const tag = new Proxy({}, {
  get(_, prop) {
    return tag.html[prop]; // legacy support: tag.div == tag.html.div
  }
});

// Attach html & dom as branches
tag.html = createHtmlTagUtility();
tag.dom = createDomTagUtility();




