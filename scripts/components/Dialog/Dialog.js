import PropTypes from 'prop-types';
import React from 'react';
import { H5PContext } from '../../context/H5PContext';
import './Dialog.scss';

export default class Dialog extends React.Component {
  constructor(props) {
    super(props);
    this.dialogRef = React.createRef();
    this.focusableElements = [];
    this.lastFocusedElement = null;

    // Bind methods to the class instance
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.trapFocus = this.trapFocus.bind(this);
    this.focusFirstElement = this.focusFirstElement.bind(this);
  }

  componentDidMount() {
    this.lastFocusedElement = document.activeElement;

    this.focusFirstElement();

    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus();
    }

    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(event) {
    if (event.key === 'Escape') {
      this.props.onHideTextDialog();
    }
    else if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  trapFocus(event) {
    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[this.focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    }
    else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  focusFirstElement() {
    const focusableSelectors =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    this.focusableElements = this.dialogRef.current.querySelectorAll(focusableSelectors);

    if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus();
    }
  }

  render() {
    const { title, children, dialogClasses, onHideTextDialog } = this.props;

    const combinedDialogClasses = ['h5p-text-dialog', ...(dialogClasses || [])];
    return (
      <div
        className='h5p-text-overlay'
        role='dialog'
        aria-labelledby='dialog-title'
        aria-modal='true'
        ref={this.dialogRef}
      >
        <div className={combinedDialogClasses.join(' ')}>
          <div id='dialog-title' className='h5p-dialog-title'>
            {title}
          </div>
          <div className='h5p-text-content'>{children}</div>
          <button
            aria-label={this.context.params.l10n.close}
            className='close-button-wrapper'
            onClick={onHideTextDialog}
          ></button>
        </div>
      </div>
    );
  }
}

Dialog.contextType = H5PContext;

Dialog.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  dialogClasses: PropTypes.arrayOf(PropTypes.string),
  onHideTextDialog: PropTypes.func.isRequired,
};

Dialog.defaultProps = {
  dialogClasses: [],
};
