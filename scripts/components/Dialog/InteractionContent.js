import React from 'react';
import { H5PContext } from '../../context/H5PContext';
import './InteractionContent.scss';

export default class InteractionContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isInitialized: false,
    };
  }

  initializeContent(contentRef) {
    if (!contentRef || this.state.isInitialized) {
      return;
    }

    // Remove any old content
    while (contentRef.firstChild) {
      contentRef.removeChild(contentRef.firstChild);
    }

    const library = this.props.hotspot.action;
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

    this.instance.on('resize', () => this.props.onResize());
  }

  render() {
    return <div ref={(el) => this.initializeContent(el)} />;
  }
}

InteractionContent.contextType = H5PContext;
