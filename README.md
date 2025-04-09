# H5P Model Viewer Integration

## Overview
This module integrates Google's [Model Viewer](https://modelviewer.dev/) into H5P, allowing interactive 3D models to be displayed within H5P content types. It enables users to load, interact with, and animate 3D models directly in their H5P projects.

## Features
- Load 3D models in `.glb` and `.gltf` formats.
- Interactive camera controls (zoom, rotate, pan).
- Support for animations and hotspot interactions.
- Customizable toolbar for additional controls.

## Installation
1. Clone the repository:
   ```sh
   git clone <repository-url>
   ```
2. Navigate into the project directory:
   ```sh
   cd h5p-model-viewer
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Build the project:
   ```sh
   npm run build
   ```

## Usage
1. Add the `Model Viewer` module to your H5P library.
2. Configure the module by specifying the 3D model path.
3. Customize interactions and animations within the H5P editor.

## Development
To run the project in development mode:
```sh
npm run dev
```

## Dependencies
- [Model Viewer](https://modelviewer.dev/)
- React
- H5P Core

## Contributing
Feel free to open issues or submit pull requests to improve this module.

## License
This project is licensed under the MIT License.

