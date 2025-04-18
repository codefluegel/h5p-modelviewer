import '@components/ModelViewer/ModelViewer.scss';
import { purifyHTML } from '@utils/utils.js';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

const ModelViewer = (props) => {
  const {
    handleClick,
    hotspots,
    modelPath,
    id,
    showContentModal,
    modelDescriptionARIA,
    exposureValue,
  } = props;

  const openModalByType = (hotspot, index) => {
    showContentModal(hotspot, index);
  };

  useEffect(() => {
    if (!window.modelViewerLoaded) {
      if (!customElements.get('model-viewer')) {
        import(/* webpackMode: "eager" */ '@google/model-viewer').then(() => {
          window.modelViewerLoaded = true;
        });
      }
    }
  }, []);

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
      class='modelViewer'
      src={modelPath}
      auto-rotate
      ar
      exposure={exposureValue ?? '1.0'}
      ar-scale='fixed'
      alt={modelDescriptionARIA}
      camera-controls
    >
      {hotspots &&
        hotspots.map((hotspot, index) => {
          return (
            hotspot.interactionpos && (
              <div
                className='hotspot'
                key={index}
                slot={`hotspot-${index}`}
                data-surface={hotspot.interactionpos}
              >
                <button
                  className={`hotspot h5p_${hotspot.action.metadata.contentType
                    .replace(/[ ,]+/g, '_')
                    .toLowerCase()}`}
                  aria-label={purifyHTML(hotspot.labelText)}
                  onClick={() => openModalByType(hotspot, index)}
                  onKeyDown={(event) => handleKeyDown(event, hotspot, index)}
                />
                <div className='hotspot-label'>{purifyHTML(hotspot.labelText)}</div>
              </div>
            )
          );
        })}
    </model-viewer>
  );
};

export default ModelViewer;

ModelViewer.propTypes = {
  handleClick: PropTypes.func.isRequired,
  hotspots: PropTypes.arrayOf(
    PropTypes.shape({
      interactionpos: PropTypes.string,
      action: PropTypes.shape({
        metadata: PropTypes.shape({
          contentType: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
      labelText: PropTypes.string,
    })
  ).isRequired,
  modelPath: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  showContentModal: PropTypes.func.isRequired,
  modelDescriptionARIA: PropTypes.string.isRequired,
  exposureValue: PropTypes.number.isRequired,
};
