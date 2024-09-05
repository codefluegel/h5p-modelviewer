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
        playAudioTrack: 'Play Audio Track',
        pauseAudioTrack: 'Pause Audio Track',
        sceneDescription: 'Scene Description',
        resetCamera: 'Reset Camera',
        submitDialog: 'Submit Dialog',
        closeDialog: 'Close Dialog',
        expandButtonAriaLabel: 'Expand the visual label',
        unlockedStateAction: 'Continue',
        backgroundLoading: 'Loading background image...',
        noContent: 'No content',
        hint: 'Hint',
        lockedContent: 'Locked content',
        back: 'Back',
        buttonFullscreenEnter: 'Enter fullscreen mode',
        buttonFullscreenExit: 'Exit fullscreen mode',
        buttonZoomIn: 'Zoom in',
        buttonZoomOut: 'Zoom out',
        zoomToolbar: 'Zoom toolbar',
        zoomAria: ':num% zoomed in',
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
