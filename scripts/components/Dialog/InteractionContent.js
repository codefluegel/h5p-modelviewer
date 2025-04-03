import PropTypes from 'prop-types';
import React from 'react';
import { H5PContext } from '../../context/H5PContext.js';
import './InteractionContent.scss';

export default class InteractionContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isInitialized: false,
    };
  }

  /**
   * Make it easy to bubble events from child to parent.
   * @param {object} origin Origin of event.
   * @param {string} eventName Name of event.
   * @param {object} target Target to trigger event on.
   */
  bubbleUp(origin, eventName, target) {
    origin.on(eventName, (event) => {
      // Prevent target from sending event back down
      target.bubblingUpwards = true;

      // Trigger event
      target.trigger(eventName, event);

      // Reset
      target.bubblingUpwards = false;
    });
  }

  /**
   * Make it easy to bubble events from parent to children.
   * @param {object} origin Origin of event.
   * @param {string} eventName Name of event.
   * @param {object[]} targets Targets to trigger event on.
   */
  bubbleDown(origin, eventName, targets) {
    origin.on(eventName, (event) => {
      if (origin.bubblingUpwards) {
        return; // Prevent send event back down.
      }

      targets.forEach((target) => {
        // If not attached yet, some contents can fail (e. g. CP).
        target.trigger(eventName, event);
      });
    });
  }

  initializeContent(contentRef) {
    if (!contentRef || this.state.isInitialized) {
      return;
    }

    while (contentRef.firstChild) {
      contentRef.removeChild(contentRef.firstChild);
    }

    const library = this.props.hotspot.action;

    if (library.library.includes('H5P.Audio')) {
      library.params.playerMode = 'full';
    }

    this.instance = H5P.newRunnable(library, this.context.contentId, H5P.jQuery(contentRef));

    this.setState({
      isInitialized: true,
    });

    if (this.instance.libraryInfo.machineName === 'H5P.Image') {
      const img = contentRef.children[0];
      const rect = this.context.getRect();
      const contentRatio = rect.width / rect.height;
      const imageRatio = this.instance.width / this.instance.height;
      const isWide = imageRatio > contentRatio;
      img.style.width = isWide ? '100%' : 'auto';
      img.style.height = isWide ? 'auto' : '100%';

      this.instance.on('loaded', () => this.props.onResize(!isWide));
    }

    // Resize parent when children resize
    this.bubbleUp(this.instance, 'resize', this.context);

    // Resize children to fit inside parent
    this.bubbleDown(this.context, 'resize', [this.instance]);
  }

  render() {
    return <div ref={(el) => this.initializeContent(el)} />;
  }
}

InteractionContent.contextType = H5PContext;

InteractionContent.propTypes = {
  hotspot: PropTypes.shape({
    action: PropTypes.shape({
      library: PropTypes.string.isRequired,
      metadata: PropTypes.shape({
        contentType: PropTypes.string.isRequired,
      }).isRequired,
      params: PropTypes.shape({
        playerMode: PropTypes.string, // Add playerMode validation
      }),
    }).isRequired,
  }).isRequired,
  onResize: PropTypes.func.isRequired,
};
