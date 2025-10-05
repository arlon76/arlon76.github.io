// // app/modules/julian/julian-core.js
// import { JulianEmojiHelper } from '/app/modules/julian/dependencies/julian-core-emoji-helper.js';
// import { JulianFunctionalityHelper } from '/app/modules/julian/dependencies/julian-core-functionality-helper.js';
import { JulianEmojiHelper } from './dependencies/julian-core-emoji-helper.js';
import { JulianFunctionalityHelper } from './dependencies/julian-core-functionality-helper.js';

export const JulianCore = (function () {
  function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  function getJulianDayNumber(date) {
    const y = date.getUTCFullYear();
    const m = date.getUTCMonth() + 1;
    const d = date.getUTCDate();

    const a = Math.floor((14 - m) / 12);
    const y2 = y + 4800 - a;
    const m2 = m + 12 * a - 3;

    return d + Math.floor((153 * m2 + 2) / 5) + 365 * y2 + Math.floor(y2 / 4) - 32083;
  }

  function getAll(date = new Date()) {
    const doy = getDayOfYear(date);
    const jdn = getJulianDayNumber(date);
    const emojiData = JulianEmojiHelper.getEmojiForDay(doy);

    return {
      formattedDate: date.toDateString(),
      dayOfYear: doy,
      julianDayNumber: jdn,
      emojiData
    };
  }

  return {
    getAll
  };
})();
