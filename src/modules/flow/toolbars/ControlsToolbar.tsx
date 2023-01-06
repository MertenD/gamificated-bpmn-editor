import React from 'react';
import useStore from "../../../store";
import {useReactFlow} from "reactflow";
import {onExport, onLoad, onSave} from "../../../util/ImportExportUtils";

export default function ControlsToolbar() {
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);
    const reactFlowInstance = useReactFlow();

    return (
        <aside>
            <div style={{
                borderRadius: 10,
                padding: 16,
                background: "white",
                border: "1px solid black",
                display: "flex",
                flexDirection: "column",
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <button style={{ width: "100%", marginBottom: 10 }} onClick={_ => onSave(nodes, edges)}>
                    Save
                    <a id="downloadSave" style={{ display: "none"}}></a>
                </button>
                <input style={{ width: "100%", marginBottom: 10 }} type="file" onChange={event => onLoad(event, reactFlowInstance)} />
                <button style={{ width: "100%" }} onClick={_ => onExport()}>
                    Export for Engine
                </button>
            </div>
        </aside>
    );
};