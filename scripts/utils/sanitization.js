import { extend, purifyHTML } from '@utils/utils.js';

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
        modelId: null,
        modelname: '',
      },
      modelDescriptionARIA: '',
      behaviour: {
        audioType: 'audio',
        label: {
          labelPosition: 'right',
          showLabel: true,
        },
      },
      l10n: {
        title: 'ModelViewer',
        close: 'Close',
        play: 'Play',
        pause: 'Pause',
      },
    },
    params
  );

  for (const key in params.l10n) {
    params.l10n[key] = purifyHTML(params.l10n[key]);
  }

  params.modelViewerWidget.modelname = purifyHTML(params.modelViewerWidget.modelname);
  params.modelDescriptionARIA = purifyHTML(params.modelDescriptionARIA);

  return params;
};
