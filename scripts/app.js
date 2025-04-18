import Main from '@components/Main.js';
import { H5PContext } from '@context/H5PContext.js';
import { sanitizeContentTypeParameters } from '@utils/sanitization.js';
import React from 'react';
import { createRoot } from 'react-dom/client';

export default class Wrapper extends H5P.EventDispatcher {
  constructor(params, contentId, extras = {}) {
    super('modelviewer');

    this.params = sanitizeContentTypeParameters(params);
    this.contentId = contentId;
    this.extras = extras;
    this.glbModelInput = params.glbModel;
  }

  render() {
    this.root = this.root ?? createRoot(this.wrapper);
    const modelPath = this.params.glbModel?.path;

    const content = modelPath ? (
      <Main
        initialModelPath={H5P.getPath(modelPath, this.contentId)}
        paramInteractions={this.params.modelViewerWidget.interactions}
        modelDescriptionARIA={this.params.modelDescriptionARIA}
        exposureValue={this.params.modelViewerWidget.exposureValue}
      />
    ) : (
      <p>{this.params.l10n.noModel}</p>
    );

    this.root.render(<H5PContext.Provider value={this}>{content}</H5PContext.Provider>);

    window.requestAnimationFrame(() => {
      this.trigger('resize');
    });
  }

  attach($container) {
    this.container = $container.get(0);

    const createElements = () => {
      this.wrapper = document.createElement('div');
      this.wrapper.classList.add('h5p-editor-modelviewer');

      this.render();

      this.isAttached = true;
    };

    document.body.style.overflow = '';

    if (!this.wrapper) {
      createElements();
    }

    // Append elements to DOM
    $container[0].appendChild(this.wrapper);
    $container[0].classList.add('h5p-modelviewer');
  }

  getRect() {
    return this.wrapper.getBoundingClientRect();
  }

  /**
   * Get current size ratio of wrapper.
   * @returns {number} Current size ratio of wrapper.
   */
  getRatio() {
    const rect = this.wrapper.getBoundingClientRect();
    return rect.width / rect.height;
  }

  resize() {
    if (!this.wrapper) {
      return;
    }

    const mobileThreshold = 815;
    const wrapperSize = this.wrapper.getBoundingClientRect();
    if (wrapperSize.width < mobileThreshold) {
      this.wrapper.classList.add('mobile');
    } 
    else {
      this.wrapper.classList.remove('mobile');
    }
  }
}
