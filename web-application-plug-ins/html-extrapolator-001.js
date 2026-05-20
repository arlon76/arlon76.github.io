/**
 * ============================================================================
 *  ⚡ HTML EXTRAPOLATOR (SBR-DOM-ENGINE-v1)
 * ============================================================================
 * An artistic, ultra-elegant micro-framework for declarative DOM generation.
 * Uses ES6 Proxies for fluent tag extrapolation & native DOM generation.
 *
 * @authorship  SBR Architecture
 * @version     1.0.0 (2026 Core Engine)
 * ============================================================================
 */

// --- SELF-CLOSING / VOID HTML TAG DEFINITIONS ---
const VOID_TAGS = new Set(['br', 'hr', 'img', 'input', 'link', 'meta', 'source']);

/**
 * Core Extrapolator Engine using Functional/OO Hybrid Modeling
 */
class HtmlExtrapolator {
    /**
     * Internal factory to build or manipulate a DOM element
     * @param {string} tagName - The target HTML tag (e.g., 'div', 'span')
     * @param {Object} attrs - Element attributes, event listeners, or meta configurations
     * @param {Array|string|Element} children - Nested contents
     * @returns {HTMLElement} The constructed native DOM element
     */
    build(tagName, attrs = {}, ...children) {
        const el = document.createElement(tagName);
        const { to, listen, ...pureAttrs } = attrs;

        // 1. Assign standard attributes elegantly
        Object.entries(pureAttrs).forEach(([k, v]) => 
            k === 'className' ? el.className = v : el.setAttribute(k, v)
        );

        // 2. Attach Event Listeners fluidly if provided: listen: { click: fn }
        if (listen) {
            Object.entries(listen).forEach(([ev, fn]) => el.addEventListener(ev, fn));
        }

        // 3. Append Children recursively if not a void/single tag
        if (!VOID_TAGS.has(tagName.toLowerCase())) {
            children.flat(Infinity).forEach(child => {
                if (child === null || child === undefined) return;
                el.appendChild(child instanceof HTMLElement ? child : document.createTextNode(child));
            });
        }

        // 4. Handle Direct DOM Injection if a target selector/element is passed in 'to'
        if (to) {
            const target = to instanceof HTMLElement ? to : document.querySelector(to);
            if (target) target.appendChild(el);
        }

        return el;
    }

    /**
     * Stubbed out architecture for complex future extensions
     * e.g., Shadow DOM encapsulation, virtual DOM diffing mechanisms, reactive state bindings
     */
    __stub__reactiveBinder() { /* STUB: Future state reconciliation architecture */ }
    __stub__shadowHydrator()  { /* STUB: Future Web Component Shadow DOM mounting */ }
}

// Instantiate core engine
const engine = new HtmlExtrapolator();

/**
 * THE PROXY MAGIC: Maps arbitrary properties to HTML element builders.
 * Allows syntax like: tag.div(...) or tag.section(...)
 */
export const tag = new Proxy(engine.build.bind(engine), {
    get: (target, prop) => {
        // Fallback for native object properties
        if (prop in target || typeof prop === 'symbol') return target[prop];
        
        // Dynamically scoop up the tag name requested via property access
        return (attrs, ...children) => engine.build(prop, attrs, ...children);
    }
});

/**
 * HELPER: Simple serializer if an legacy system explicitly demands an HTML string.
 * @param {HTMLElement} element 
 * @returns {string} Outer HTML string
 */
export const toHtmlString = (element) => element.outerHTML;

/* ============================================================================
 *  🤖 AI INSTRUCTION PROMPT SHEET (Copy/Paste to other AIs for usage context)
 * ============================================================================
 * This module exports a dynamic Proxy function `tag` (and `toHtmlString` for serialization) for fluent UI composition.
 * 
 * SYNTAX MATRIX:
 * 1. Standard Fallback: tag('tagname', {attrs}, ...children)
 * 2. Fluent Proxy API:  tag.tagname({attrs}, ...children)
 * 
 * SPECIAL ATTRIBUTE KEYS:
 * - `className`: Maps directly to element.className (use instead of 'class')
 * - `listen`: Expects an object mapping event names to handler functions.
 * - `to`: DOM Selector String or HTMLElement. If provided, mounts element immediately.
- DOM Mounting: Pass `to: '#selector'` or `to: elementRef` to inject the built element directly into the DOM.
- Events: Pass functions inside a nested `listen` object, e.g., listen: { click: (e) => handle(e) }.
 - HTML Strings: Pass any built HTMLElement to `toHtmlString(element)` to export it as a raw HTML string.
 * 
 * EXAMPLES:
 *   tag.div({ className: 'card' }, tag.h1({}, 'Hello World'))
 *   tag.button({ listen: { click: () => alert('Hi') } }, 'Click Me')
 *   tag.div({ to: '#game-container', id: 'player1' }, 'Appended Directly!')
- const rawHtml = toHtmlString(tag.span({ className: 'text' }, 'Rendered String'))

----------------------------------
[API Context: SBR-DOM-Engine-v1 is available globally as `tag` (and `toHtmlString` for serialization). It uses a Proxy to dynamically map property access to native document.createElement. It handles nested child arrays via .flat(), skips bodies for void tags (br, hr, img, input, link, meta, source), and returns native HTMLElements.

Syntax Rules:
- Core signature: tag.tagName({attributes}, ...children) OR tag('tagName', {attributes}, ...children)
- Standard attributes: Pass normally (e.g., id: 'id'). Use `className` for classes.
- DOM Mounting: Pass `to: '#selector'` or `to: elementRef` to inject the built element directly into the DOM.
- Events: Pass functions inside a nested `listen` object, e.g., listen: { click: (e) => handle(e) }.
- HTML Strings: Pass any built HTMLElement to `toHtmlString(element)` to export it as a raw HTML string.

Usage Examples for code generation:
- tag.div({ className: 'card' }, tag.h3({}, 'Title'), tag.br())
- tag.button({ className: 'btn', listen: { click: openMenu } }, 'Open')
- tag.section({ to: '#hud', id: 'score' }, 'Points: 0')
- const rawHtml = toHtmlString(tag.span({ className: 'text' }, 'Rendered String'))

Generate all UI code using this functional pattern instead of raw HTML strings or native imperative DOM manipulation.]
 * ============================================================================
 */