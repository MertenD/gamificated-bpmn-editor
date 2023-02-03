import {Edge, Node, ReactFlowInstance} from "reactflow";
import {BpmnDto} from "../model/Bpmn";
import {serializeToDto} from "./SerializationUtils";
import {v4 as uuidv4} from 'uuid';
import {NodeTypes} from "../model/NodeTypes";
import {ActivityNodeData} from "../modules/flow/nodes/ActivityNode";
import {InfoNodeData} from "../modules/flow/nodes/InfoNode";
import {GatewayNodeData} from "../modules/flow/nodes/GatewayNode";
import {setRef} from "@mui/material";


export const onSave = (nodes: Node[], edges: Edge[]) => {
    const downloadableContent = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(serializeToDto(nodes, edges), null, 2));
    const anchorElement = document.getElementById('downloadSave');
    if (anchorElement !== null) {
        anchorElement.setAttribute("href", downloadableContent);
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

export const onExport = (nodes: Node[], edges: Edge[]) => {

    const bpmn = {
        "bpmn:definitions": {
            id: "Definitions_0hjm41d",
            targetNamespace: "http://bpmn.io/schema/bpmn",
            exporter: "bpmn-js (https://demo.bpmn.io)",
            exporterVersion: "11.1.0",
            children: [
                {
                    "bpmn:process": {
                        id: "Process_1b8z10m",
                        isExecutable: "false",
                        children: [
                            ...nodes.map((node: Node) => {
                                switch (node.type as NodeTypes) {
                                    case NodeTypes.START_NODE:
                                        return createStartNode(node, edges)
                                    case NodeTypes.END_NODE:
                                        return createEndNode(node, edges)
                                    case NodeTypes.ACTIVITY_NODE:
                                        return createActivityNode(node, edges)
                                    case NodeTypes.INFO_NODE:
                                        return createInfoNode(node, edges)
                                    case NodeTypes.GATEWAY_NODE:
                                        return createGatewayNode(node, edges)
                                    case NodeTypes.CHALLENGE_NODE:
                                        return createChallengeNode(node, edges)
                                }
                            }),
                            ...edges.map((edge: Edge) => {
                                return {
                                    "bpmn:sequenceFlow": {
                                        id: "IdFlow_" + edge.id.replaceAll("-", ""),
                                        sourceRef: "Id_" + edge.source.replaceAll("-", ""),
                                        targetRef: "Id_" + edge.target.replaceAll("-", ""),
                                        children: []
                                    }
                                }
                            })
                        ]
                    },
                    "bpmndi:BPMNDiagram": {
                        id: "BPMNDiagram_1",
                        children: [
                            {
                                "bpmndi:BPMNPlane": {
                                    id: "BPMNPlane_1",
                                    bpmnElement: "Process_1b8z10m",
                                    children: [
                                        ...nodes.map((node: Node) => {
                                            return {
                                                "bpmndi:BPMNShape": {
                                                    bpmnElement: "Id_" + node.id.replaceAll("-", ""),
                                                    children: [
                                                        {
                                                            "dc:Bounds": {
                                                                x: node.position.x,
                                                                y: node.position.y,
                                                                width: node.width,
                                                                height: node.height
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        }),
                                        ...edges.map((edge: Edge) => {
                                            return {
                                                "bpmndi:BPMNEdge": {
                                                    bpmnElement: "IdFlow_" + edge.id.replaceAll("-", ""),
                                                }
                                            }
                                        })
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        }
    }

    const downloadableContent = "data:text/xml;charset=utf-8," + encodeURIComponent(jsonToPrettyXml(bpmn));
    const anchorElement = document.getElementById('downloadExport');
    if (anchorElement !== null) {
        anchorElement.setAttribute("href", downloadableContent);
        anchorElement.setAttribute("download", "bpmn-diagram-export.bpmn");
        anchorElement.click();
    }

    function createStartNode(node: Node, edges: Edge[]): any {
        return {
            "bpmn:startEvent": {
                id: "Id_" + node.id.replaceAll("-", ""),
                children: [
                    ...getOutgoingEdgeChildren(edges, node),
                ]
            }
        }
    }

    function createEndNode(node: Node, edges: Edge[]): any {
        return {
            "bpmn:endEvent": {
                id: "Id_" + node.id.replaceAll("-", ""),
                children: [
                    ...getIncomingEdgeChildren(edges, node),
                ]
            }
        }
    }

    function createActivityNode(node: Node, edges: Edge[]): any {
        const activityNodeData = node.data as ActivityNodeData
        return {
            "bpmn:task": {
                id: "Id_" + node.id.replaceAll("-", ""),
                name: activityNodeData.task,
                children: [
                    ...getIncomingEdgeChildren(edges, node),
                    ...getOutgoingEdgeChildren(edges, node),
                ]
            }
        }
    }

    function createInfoNode(node: Node, edges: Edge[]): any {
        const infoNodeData = node.data as InfoNodeData
        return {
            "bpmn:task": {
                id: "Id_" + node.id.replaceAll("-", ""),
                name: "Info: " + infoNodeData.infoText,
                children: [
                    ...getIncomingEdgeChildren(edges, node),
                    ...getOutgoingEdgeChildren(edges, node)
                ]
            }
        }
    }

    function createGatewayNode(node: Node, edges: Edge[]): any {
        const gatewayNodeData = node.data as GatewayNodeData
        return {
            "bpmn:exclusiveGateway": {
                id: "Id_" + node.id.replaceAll("-", ""),
                name: gatewayNodeData.variableName + " " + gatewayNodeData.comparison + " " + gatewayNodeData.valueToCompare,
                children: [
                    ...getIncomingEdgeChildren(edges, node),
                    ...getOutgoingEdgeChildren(edges, node)
                ]
            }
        }
    }

    function createChallengeNode(node: Node, edges: Edge[]): any {
        // TODO
        console.log("Challenge")
    }

    function getOutgoingEdgeChildren(edges: Edge[], currentNode: Node): any {
        return edges.filter((edge) => edge.source === currentNode.id).map(edge => {
            return {
                "bpmn:outgoing": {
                    children: "IdFlow_" + edge.id.replaceAll("-", "")
                }
            }
        })
    }

    function getIncomingEdgeChildren(edges: Edge[], currentNode: Node): any {
        return edges.filter((edge) => edge.target === currentNode.id).map(edge => {
            return {
                "bpmn:incoming": {
                    children: "IdFlow_" + edge.id.replaceAll("-", "")
                }
            }
        })
    }
}

function jsonToPrettyXml(json: any, spacing: string = ""): string {
    // Initialize a variable to store the generated XML code
    let xml = '';

    // Loop through each key in the JSON object
    for (const key in json) {

        // Check if the key is a property of the JSON object
        if (json.hasOwnProperty(key)) {
            // Get the value of the key in the JSON object
            const value = json[key];
            // Add the key as an XML element to the generated XML code
            xml += `${spacing}<${key}`;

            // Loop through each property in the value of the key
            for (const property in value) {
                // Check if the property is a property of the value and not "children"
                if (value.hasOwnProperty(property) && property !== 'children') {
                    // Add the property as an XML attribute to the element
                    xml += ` ${property}="${value[property]}"`;
                }
            }

            // Check if the value has a "children" property
            if (value.children) {
                // If it does, add a closing bracket and a newline character to the element
                xml += '>\n';
                // Check if the value of "children" is a string
                if (typeof value.children === "string") {
                    // If it is, add the string as a text node to the element
                    xml += spacing + "\t" + value.children + "\n"
                } else {
                    // If it's not a string, loop through each child in the "children" array
                    for (const child of value.children) {
                        // Recursively convert the child to XML and add it to the element
                        xml += jsonToPrettyXml(child, spacing + "\t");
                    }
                }
                // Add the closing tag of the element
                xml += `${spacing}</${key}>\n`;
            } else {
                // If the value doesn't have a "children" property, add a closing tag with a forward slash
                xml += ' />\n'
            }
        }
    }

    // Return the generated XML code
    return xml;
}
