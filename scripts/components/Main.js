import React from 'react';
import PropTypes from 'prop-types';
import './Main.scss';
import { H5PContext } from '../context/H5PContext';
import ModelViewer from './ModelViewer/ModelViewer';
import Dialog from './Dialog/Dialog';
import InteractionContent from './Dialog/InteractionContent';
import ToolBar from './Toolbar/Toolbar';

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.audioPlayers = {};

    this.state = {
      modelPath: this.props.initialModelPath,
      modelViewerInstance: null,
      animations: [],
      interactions: this.props.paramInteractions,
      showHotspotDialog: false,
      showInteractionDialog: false,
      audioIsPlaying: null,
    };
  }

  componentDidMount() {
    const modelViewer = document.getElementById('model-viewer');
    if (!modelViewer) {
      return;
    }
    modelViewer.autoRotate = false;

    modelViewer.addEventListener('load', () => {
      // create hotspots and set model viewer instance

      this.setState({
        interactions: this.state.interactions,
        modelViewerInstance: modelViewer,
        animations: modelViewer.availableAnimations,
      });
    });
  }

  componentWillUnmount() {
    // remove event listener
    this.state.modelViewerInstance.removeEventListener('load');
  }

  /**
   * Get the audio player for the current track.
   *
   * @param {string} id
   * @param {Object} [hotspot] Parameters (Only needed initially)
   * @return {AudioElement} or 'null' if track isn't playable.
   */
  getAudioPlayer(id, hotspot) {
    // Create player if none exist
    if (this.audioPlayers[id] === undefined) {
      if (
        !hotspot ||
        !hotspot.action ||
        !hotspot.action.params ||
        !hotspot.action.params.files ||
        !hotspot.action.params.files.length
      ) {
        return; // No track to play
      }
      this.audioPlayers[id] = AudioButton.createAudioPlayer(
        this.context.contentId,
        hotspot.action.params.files,
        () => {
          this.setState({
            audioIsPlaying: id, // Set state on starting to play
          });
        },
        () => {
          if (this.state.audioIsPlaying === id) {
            this.setState({
              audioIsPlaying: null, // Clear state on playing ended
            });
          }
        },
        false
      );
    }
    return this.audioPlayers[id];
  }

  handleModelClick(event) {
    // retrieve clicked point on 3D Model from model-viewer instance
    if (this.state.editingLibrary) {
      const clickedPoint = this.state.modelViewerInstance.surfaceFromPoint(
        event.clientX,
        event.clientY
      );

      this.setState({
        showHotspotDialog: true,
      });
    }
  }

  // handle play/pause of animations contained by the model
  handlePlayPause() {
    const { modelViewerInstance } = this.state;

    if (modelViewerInstance.paused) {
      modelViewerInstance.play();
    } else {
      modelViewerInstance.pause();
    }
  }

  handleCloseTextDialog() {
    this.setState({
      showHotspotDialog: false,
      currentText: null,
    });
  }

  hideInteraction() {
    this.setState((prevState) => ({
      showInteractionDialog: false,
      hotspot: null,
    }));
  }

  handleAudioIsPlaying(id) {
    this.setState({
      audioIsPlaying: id, // Change the player
    });
  }

  showContentModal(hotspot, index) {
    if (hotspot.action.metadata.contentType === 'Audio' || 'Video') {
      const playerId = 'interaction' + '-' + index;
      if (this.state.audioIsPlaying === playerId) {
        // Pause and reset player
        const lastPlayer = this.getAudioPlayer(playerId, hotspot);
        if (lastPlayer) {
          lastPlayer.pause();
          lastPlayer.currentTime = 0;
        }
      } else {
        // Start current audio playback
        const player = this.getAudioPlayer(playerId, hotspot);
        if (player) {
          player.play();
        }
      }

      this.setState({
        showInteractionDialog: true,
      });
    } else {
      this.setState({
        showHotspotDialog: true,
      });
    }

    this.setState({
      hotspot: hotspot,
      editingLibrary: hotspot.action.library,
    });
  }

  playAnimation() {
    const mv = this.modelViewerInstance;
    console.log(this.modelViewerInstance);

    if (mv) {
      mv.availableAnimations.length && mv.paused ? mv.play() : mv.pause();
      this.setState({
        animationButtonText: mv.paused ? 'Play' : 'Pause',
      });
    }
  }

  render() {
    let dialogClasses = [];
    if (this.state.showInteractionDialog) {
      const library = H5P.libraryFromString(this.state.hotspot.action.library);
      const interactionClass = library.machineName.replace('.', '-').toLowerCase();

      dialogClasses.push(interactionClass);
    }

    return (
      <div className='model-viewer-container'>
        {this.state.showInteractionDialog && (
          <Dialog
            title={'Test'}
            onHideTextDialog={this.hideInteraction.bind(this)}
            dialogClasses={dialogClasses}
          >
            <InteractionContent
              hotspot={this.state.hotspot}
              audioIsPlaying={this.state.audioIsPlaying}
              onAudioIsPlaying={this.handleAudioIsPlaying.bind(this)}
            />
          </Dialog>
        )}
        <div className='container'>
          <div className='mv-container'>
            <ModelViewer
              id={'model-viewer'}
              handleClick={this.handleModelClick.bind(this)}
              hotspots={this.state.interactions}
              modelPath={this.state.modelPath}
              showContentModal={this.showContentModal.bind(this)}
            />
            <ToolBar
              animations={this.state.animations}
              modelViewerInstance={this.state.modelViewerInstance}
            />
          </div>
        </div>
      </div>
    );
  }
}

Main.contextType = H5PContext;

Main.propTypes = {
  modelPath: PropTypes.string,
};
