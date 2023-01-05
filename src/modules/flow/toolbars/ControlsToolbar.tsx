import React, {ChangeEvent} from 'react';
import useStore from "../../../store";
import {Node, Edge, useReactFlow} from "reactflow";

type BpmnDto = {
    nodes: Node[],
    edges: Edge[]
}

export default function ControlsToolbar() {
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);
    const reactFlowInstance = useReactFlow();

    function serializeToDto(nodes: Node[], edges: Edge[]): BpmnDto {
        return {
            nodes: nodes,
            edges: edges
        }
    }

    const onSave = () => {
        const content = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(serializeToDto(nodes, edges)));
        const anchorElement = document.getElementById('downloadSave');
        if (anchorElement !== null) {
            anchorElement.setAttribute("href", content);
            anchorElement.setAttribute("download", "bpmn-diagram.json");
            anchorElement.click();
        }
    }

    const onLoad = (changeEvent: any) => {
        const fileReader = new FileReader();
        fileReader.readAsText(changeEvent.target.files[0], "UTF-8");
        fileReader.onload = progressEvent => {
            if (progressEvent.target !== null) {
                const bpmnDto = JSON.parse(String(progressEvent.target.result)) as BpmnDto
                const newNodes = bpmnDto.nodes
                const newEdges = bpmnDto.edges
                reactFlowInstance.setNodes(newNodes)
                reactFlowInstance.setEdges(newEdges)
            }
        };
    }

    const onExport = () => {

    }

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
                <button style={{ width: "100%", marginBottom: 10 }} onClick={onSave}>
                    Save
                    <a id="downloadSave" style={{ display: "none"}}></a>
                </button>
                <input style={{ width: "100%", marginBottom: 10 }} type="file" onChange={onLoad} />
                <button style={{ width: "100%" }} onClick={onExport}>
                    Export for Engine
                </button>
            </div>
        </aside>
    );
};