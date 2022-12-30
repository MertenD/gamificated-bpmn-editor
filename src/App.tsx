import React from 'react';
import './App.css';
import BpmnEditor from "./modules/flow/BpmnEditor";

function App() {
  return (
    <div className="App">
        <div style={{ height: "100vh"}}>
            <BpmnEditor />
        </div>
    </div>
  );
}

export default App;
