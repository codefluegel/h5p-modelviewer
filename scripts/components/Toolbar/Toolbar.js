// component to render hotspots from main a functional component
import React, { useState } from 'react';
import './Toolbar.scss';
const ToolBar = (props) => {
  const { animations, modelViewerInstance } = props;
  // buttonstate
  const [buttonState, setButtonState] = useState(false);

  const playLabel = H5P.t('H5P.ModelViewer-1.7', 'play');
  const pauseLabel = H5P.t('H5P.ModelViewer-1.7', 'pause');

  const handlePlayPause = () => {
    setButtonState(!buttonState);

    if (modelViewerInstance) {
      modelViewerInstance.availableAnimations.length && modelViewerInstance.paused
        ? modelViewerInstance.play()
        : modelViewerInstance.pause();
    }
  };

  return (
    <div className='tool-bar'>
      <div>
        {animations.length > 0 && (
          <button
            className='toolbar-btn'
            aria-label={buttonState ? pauseLabel : playLabel}
            onClick={handlePlayPause}
          >
            {buttonState ? 'pause' : 'play'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ToolBar;
