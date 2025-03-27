import React from 'react';
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
    // Save the last focused element before opening the dialog
    this.lastFocusedElement = document.activeElement;

    // Focus the dialog
    this.focusFirstElement();

    // Add event listener for keyboard events
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    // Restore focus to the last focused element
    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus();
    }

    // Remove event listener for keyboard events
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(event) {
    if (event.key === 'Escape') {
      // Close the dialog when Escape is pressed
      this.props.onHideTextDialog();
    } else if (event.key === 'Tab') {
      // Trap focus within the dialog
      this.trapFocus(event);
    }
  }

  trapFocus(event) {
    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[this.focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      // Shift + Tab: Move focus to the last element
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      // Tab: Move focus to the first element
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
            aria-label='Close'
            className='close-button-wrapper'
            onClick={onHideTextDialog}
          ></button>
        </div>
      </div>
    );
  }
}
