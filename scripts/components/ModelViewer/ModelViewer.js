import '@google/model-viewer';
import React from 'react';
import './ModelViewer.scss';

const ModelViewer = (props) => {
  const { handleClick, hotspots, modelPath, id, showContentModal } = props;

  const openModalByType = (hotspot, index) => {
    showContentModal(hotspot, index);
  };

  const handleKeyDown = (event, hotspot, index) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openModalByType(hotspot, index);
    }
  };

  return (
    <model-viewer
      id={id}
      onClick={handleClick}
      style={{ width: '100%', height: '100%' }}
      src={modelPath}
      auto-rotate
      ar
      ar-scale='fixed'
      alt={modelPath.split('/').pop().split('.').slice(0, -1).join('.')}
      camera-controls
    >
      {hotspots &&
        hotspots.map((hotspot, index) => {
          return (
            hotspot.interactionpos && (
              <div
                className={`hotspot h5p_${hotspot.action.metadata.contentType
                  .replace(/[ ,]+/g, '_')
                  .toLowerCase()}`}
                key={index}
                slot={`hotspot-${index}`}
                data-surface={hotspot.interactionpos}
                role='button'
                tabIndex={0}
                onClick={() => openModalByType(hotspot, index)}
                onKeyDown={(event) => handleKeyDown(event, hotspot, index)}
              >
                <span
                  className='hotspot-label'
                  onClick={() => openModalByType(hotspot, index)}
                  onKeyDown={(event) => handleKeyDown(event, hotspot, index)}
                  role='button'
                  tabIndex={0}
                >
                  {`${hotspot.labelText}`}
                </span>
              </div>
            )
          );
        })}
    </model-viewer>
  );
};

export default ModelViewer;
