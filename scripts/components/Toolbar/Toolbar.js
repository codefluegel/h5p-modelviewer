// component to render hotspots from main a functional component
import React, { useState } from 'react';

const ToolBar = (props) => {
  const { animations, modelViewerInstance } = props;
  // buttonstate
  const [buttonState, setButtonState] = useState(false);

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
            className='button'
            aria-label={buttonState ? 'Pause model animation' : 'Play model animation'}
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
