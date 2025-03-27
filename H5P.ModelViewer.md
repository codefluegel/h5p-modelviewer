# Review of H5P.ModelViewer-1.7

## Function

- Audio content plays automatically when the respective hotspot is opened.
- When audio content plays automatically, using the audio button has no effect
- Audio content does not stop when the content is closed, but stops when the content is opened again.
- Should audio really be displayed with a button, not in full player mode?
- Labels are not properly encoded. Try setting the labed to `Foo's Bar` and you will get it HTML encoded as `Foo&#039;s Bar`. H5P's editor core encodes it to prevent scripting attacks. If you need the text of an (HTML) text input field in a non HTML context, you will need to purify it yourself.
- Does not support resume.
- Does not support question type contract and no xAPI.
- When an animation is played, the model viewer library issues a warning in the console, but that might not be related to the content type.

## Accessibility

- Contents cannot be opened with the keyboard.
- The overlay is not a proper modal dialog (https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): No focus trap, Escape does not close the dialog, losing focus when closing the dialog, etc.
- Model does not have a custom alternative text, but uses the inbuilt fallback astronaut text.
- The play button might benfit from an extra aria label that gives more context, e.g. "Play model animation"/"Pause model animation".

# Responsiveness

- YouTube videos do not resize with the overlay.
- Labels have a fixed size. Should they be able to shrink? Otherwise they may be cut off on smaller screens and cover lots of the model. That's actually a UX question that I cannot answer :-)
- Below a certain threshold (determined by container query), the overlay margin could shrink (cmp. e.g. GameMap) or even be removed completely (cmp. Interactive Video) to leave more space for the subcontent.

# Cross browser functionality

Seems to work across the latest three versions of all browsers

# Cross platform functionality

Not checked. Would not know what role the platform might play here.

# Translations

- There's a German translation file, but nothing is translated.
- `Play` and `Pause`, the labels for the play/pause button, are hardcoded into the content type and would need to be translatable.

# Security

- Checked for XSS, nothing detected.
- Some npm dependencies have known vulnerabilities, only for dev though. Should be updated.

# Code

## JavaScript

- Looks fine in general, see separate file for code remarks linked to the specific files/lines of code
- In particular, the reuse of the "AudioButton" component from EscapeRoom does not feel like a good choice. This should be refactored.
- H5P coding style guide should be studied and followed, eslint can help here but needs to be configured properly
- When JSDoc comments are used, they should be complete - and they should be used for all exposed functions at least.
- There's some unused code (calling non-existing functions) that can be removed

## CSS

- Readability might be improved by not using one large main.scss file, but one dedicated .scss file per component.
- Readability might be improved by nesting classing appropriately.
- Using absolute (px) values for element sizes, font sizes and more. Not best practice.

## H5P specific files

- .h5pignore must also cover entries and scripts. Those should not be inside the H5P file.

# Repository

- icon.svg is present, but is merely a placeholder
- In package.json, the script `"test": "echo \"Error: no test specified\" && exit 1"` should be removed, as it does break continuous integration and does not yield a benefit
- eslint should be set up properly set up. eslint-config-ndla-h5p is loaded in package.json, but it is not used in .eslintrc.json. Instead, rules are set there - then eslint-config-ndla-h5p would not be required. Then make eslint happy.
