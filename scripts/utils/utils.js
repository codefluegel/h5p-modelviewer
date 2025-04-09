import he from 'he';

/**
 * Extend an array just like JQuery's extend.
 * @param {object[]} theArgs Objects to be extended.
 * @returns {object} Merged objects.
 */
export const extend = (...theArgs) => {
  for (let i = 1; i < theArgs.length; i++) {
    for (let key in theArgs[i]) {
      if (Object.prototype.hasOwnProperty.call(theArgs[i], key)) {
        if (typeof theArgs[0][key] === 'object' && typeof theArgs[i][key] === 'object') {
          extend(theArgs[0][key], theArgs[i][key]);
        }
        else {
          theArgs[0][key] = theArgs[i][key];
        }
      }
    }
  }
  return theArgs[0];
};

/**
 * HTML decode and strip HTML.
 * @param {string|object} html html.
 * @returns {string} html value.
 */
export const purifyHTML = (html) => {
  if (typeof html !== 'string') {
    return '';
  }

  let text = he.decode(html);
  const div = document.createElement('div');
  div.innerHTML = text;
  text = div.textContent || div.innerText || '';

  return text;
};
