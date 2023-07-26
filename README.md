# GBPMN Editor

This repository contains a BPMN (Business Process Model and Notation) editor built using React, TypeScript, and [React Flow](https://reactflow.dev/). The editor is designed to create and edit BPMN diagrams, which contains gamification elements and can then be used with the [Gamificated BPMN Engine](https://github.com/MertenD/gamificated-bpmn-engine).

You can try the editor at [http://gbpmneditor.mertendieckmann.de/](http://gbpmneditor.mertendieckmann.de/).

## Overview

The BPMN Editor is a node-based editor that allows users to create and edit BPMN diagrams. The editor uses React Flow, a library for building node-based applications, to create a user-friendly interface for manipulating BPMN elements.

The main entry point of the application is `src/App.tsx`, which sets up the React application and includes the main components.

The core functionality of the editor is encapsulated in the `Editor` component. This component manages the state of the BPMN diagram and provides the user interface for editing the diagram.

The `Toolbar` component provides a set of tools for manipulating the BPMN diagram, such as adding elements by dragging them onto the canvas.

The application includes utility functions for importing and exporting BPMN files (`src/util/Importer.ts` and `src/util/Exporter.ts`). These utilities are used to load project files into the application and export the edited BPMN diagrams.

## Getting Started

To get started with this project, clone the repository and install the dependencies:

```bash
git clone https://github.com/MertenD/bpmn-editor.git
cd bpmn-editor
npm install
```

Then, you can start the application:

```bash
npm start
```

The application will be available at http://localhost:3000.
