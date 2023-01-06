import React, {ChangeEvent, useRef} from 'react';
import useStore from "../../../store";
import {Node, Edge, useReactFlow} from "reactflow";
import {getNextKeyDef} from "@testing-library/user-event/dist/keyboard/getNextKeyDef";

type BpmnDto = {
    nodes: Node[],
    edges: Edge[]
}

export default function ControlsToolbar() {
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);
    const getNextNodeId = useStore((state) => state.getNextNodeId)
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

                // This whole process changes the id's of the nodes and adapts the edges as well to that change
                // This is necessary so that the loaded nodes will be re-rendered and the loaded data is loaded into the node component
                const idPairs = bpmnDto.nodes.reduce((accumulator, node) => {
                    // @ts-ignore
                    accumulator[node.id] = getNextNodeId()
                    // @ts-ignore
                    reactFlowInstance.addNodes({ ...node, id: accumulator[node.id] })
                    return accumulator;
                }, {});
                const newNodes = bpmnDto.nodes.map((node) => {
                    // @ts-ignore
                    return { ...node, id: idPairs[node.id] }
                })
                const newEdges = bpmnDto.edges.map((edge) => {
                    // @ts-ignore
                    return { ...edge, source: idPairs[edge.source], target: idPairs[edge.target]}
                })

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