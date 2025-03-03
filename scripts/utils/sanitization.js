import { extend, purifyHTML } from './utils.js';

/**
 * Sanitize the content type's parameters.
 * @param {object} params Parameters.
 * @returns {object} Sanitized parameters.
 */
export const sanitizeContentTypeParameters = (params = {}) => {
  params = extend(
    {
      glbModel: {},
      modelViewerWidget: {
        interactions: [],
      },
      behaviour: {
        audioType: 'audio',
        label: {
          labelPosition: 'right',
          showLabel: true,
        },
      },
      l10n: {
        title: 'ModelViewer',
      },
    },
    params
  );

  // Sanitize localization
  for (const key in params.l10n) {
    params.l10n[key] = purifyHTML(params.l10n[key]);
  }

  return params;
};
