import {Node, Edge, ReactFlowInstance} from "reactflow";
import {BpmnDto} from "../model/Bpmn";
import {serializeToDto} from "./SerializationUtils";
import { v4 as uuidv4 } from 'uuid';

export const onSave = (nodes: Node[], edges: Edge[]) => {
    const content = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(serializeToDto(nodes, edges), null, 2));
    const anchorElement = document.getElementById('downloadSave');
    if (anchorElement !== null) {
        anchorElement.setAttribute("href", content);
        anchorElement.setAttribute("download", "bpmn-diagram.json");
        anchorElement.click();
    }
}

export const onLoad = (changeEvent: any, reactFlowInstance: ReactFlowInstance) => {
    const fileReader = new FileReader();
    fileReader.readAsText(changeEvent.target.files[0], "UTF-8");
    fileReader.onload = progressEvent => {
        if (progressEvent.target !== null) {
            const bpmnDto = JSON.parse(String(progressEvent.target.result)) as BpmnDto

            // This whole process changes the id's of the nodes and adapts the edges as well to that change.
            // This is necessary so that the loaded nodes will be re-rendered and the loaded data is loaded into the node components
            const newIdPairs = bpmnDto.nodes.reduce((accumulator: Record<string, string>, node) => {
                accumulator[node.id] = uuidv4()
                return accumulator;
            }, {});
            const newNodes = bpmnDto.nodes.map((node) => {
                // @ts-ignore
                return { ...node, id: newIdPairs[node.id], parentNode: node.parentNode !== undefined ? newIdPairs[node.parentNode] : undefined }
            })
            const newEdges = bpmnDto.edges.map((edge) => {
                // @ts-ignore
                return { ...edge, source: newIdPairs[edge.source], target: newIdPairs[edge.target]}
            })

            reactFlowInstance.setNodes(newNodes)
            reactFlowInstance.setEdges(newEdges)
        }
    };
}

export const onExport = () => {

}