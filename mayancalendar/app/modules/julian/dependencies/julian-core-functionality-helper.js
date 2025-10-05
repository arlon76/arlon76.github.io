// app/modules/julian/julian-core-functionality-helper.js
export const JulianFunctionalityHelper = (function () {

// Mayan Epoch: August 11, 3114 BCE Gregorian = JDN 584283
const MAYAN_EPOCH_JDN = 584283;

/**
 * Converts a Mayan Long Count to Julian Day Number (JDN)
 * @param {number} baktun 
 * @param {number} katun 
 * @param {number} tun 
 * @param {number} uinal 
 * @param {number} kin 
 * @returns {number} JDN
 */
function longCountToJDN(baktun, katun, tun, uinal, kin) {
    const totalDays = baktun * 144000 + katun * 7200 + tun * 360 + uinal * 20 + kin;
    return MAYAN_EPOCH_JDN + totalDays;
}

/**
 * Converts a JDN to a Gregorian date
 * @param {number} jdn 
 * @returns {{year: number, month: number, day: number}}
 */
function jdnToGregorian(jdn) {
    let j = jdn + 32044;
    let g = Math.floor(j / 146097);
    let dg = j % 146097;
    let c = Math.floor(dg / 36524.25);
    let dc = dg - Math.floor(36524.25 * c);
    let b = Math.floor(dc / 1461);
    let db = dc % 1461;
    let a = Math.floor(db / 365);
    let da = db % 365;

    let y = 400 * g + 100 * c + 4 * b + a;
    let m = Math.floor((5 * da + 308) / 153) - 2;
    let d = da - Math.floor((153 * m + 2) / 5) + 1;

    let year = y - 4800 + Math.floor((m + 2) / 12);
    let month = (m + 2) % 12 + 1; // Convert 0-indexed to 1-indexed
    let day = d;

    return { year, month, day };
}

/**
 * Converts JDN to a string in YYYY-MM-DD format
 * @param {number} jdn 
 * @returns {string}
 */
function jdnToGregorianString(jdn) {
    const { year, month, day } = jdnToGregorian(jdn);
    return `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}
  return {
    MAYAN_EPOCH_JDN
	,longCountToJDN
	,jdnToGregorian
	,jdnToGregorianString
	
  };
})();
