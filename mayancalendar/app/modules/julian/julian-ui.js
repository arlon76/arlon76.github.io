// julian-ui.js

// app/modules/julian/julian-ui.js
// import { JulianCore } from '/app/modules/julian/julian-core.js';
import { JulianCore } from './julian-core.js';
// import { createHtmlTagUtility } from '/app/utilities/createHtmlTagUtility.js';

const tag = createHtmlTagUtility();

export const JulianUI = (function () {
  let $container;

  function init(containerSelector) {
    $container = $(containerSelector);
    const html = buildHtml(JulianCore.getAll());
    $container.append(html);
  }

  function update(date = new Date()) {
    const data = JulianCore.getAll(date);
    const $box = $container.find('#julian-box');

    $box.find('[data-field="date"]').text(data.formattedDate);
    $box.find('[data-field="doy"]').text(data.dayOfYear);
    $box.find('[data-field="jdn"]').text(data.julianDayNumber);
    $box.find('[data-field="emoji"]').text(data.emojiData.emoji);
    $box.find('[data-field="label"]').text(data.emojiData.label);
	// console.log('Line 27 of julian-ui.js outputing the prophecy to the console: prophecy: '+data.emojiData.prophecy);
    $box.find('[data-field="prophecy"]').text(data.emojiData.prophecy);
  }

  function buildHtml(data) {
	  // console.log("line 33 julian-ui.js echoing: Found prophecy element?", data.emojiData.prophecy);
    return tag.div([
      tag.h3("Julian Calendar"),
      tag.div(["Date: ", tag.span(data.formattedDate, { 'data-field': 'date' })].join('')),
      tag.div(["Day of Year: ", tag.span(data.dayOfYear, { 'data-field': 'doy' })].join('')),
      tag.div(["Julian Day Number: ", tag.span(data.julianDayNumber, { 'data-field': 'jdn' })].join('')),

      tag.div([
        "Emoji of the Day: ",
        tag.span(data.emojiData.emoji, {
          'data-field': 'emoji',
          style: 'font-size: 1.5em; margin-right: 0.5em;'
        }),
        tag.span(`(${data.emojiData.label})`, { 'data-field': 'label', style: 'opacity: 0.6;' })
      ].join('<br>')),
      tag.div(["Prophecy: ", tag.span(data.emojiData.prophecy, { 'data-field': 'prophecy', class: 'julian-prophecy' })].join(''))

    ].join('<br>'), {
      id: "julian-box",
      class: "info-box"
    });
  }

  return {
    init,
    update
  };
})();

