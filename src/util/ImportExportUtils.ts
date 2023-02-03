import {Edge, Node, ReactFlowInstance} from "reactflow";
import {BpmnDto} from "../model/Bpmn";
import {serializeToDto} from "./SerializationUtils";
import {v4 as uuidv4} from 'uuid';
import {NodeTypes} from "../model/NodeTypes";
import {ActivityNodeData} from "../modules/flow/nodes/ActivityNode";
import {InfoNodeData} from "../modules/flow/nodes/InfoNode";

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
                                        return {
                                            "bpmn:startEvent": {
                                                id: "Id_" + node.id.replaceAll("-", ""),
                                                children: [
                                                    ...edges.filter((edge) => edge.source === node.id).map(edge => {
                                                        return {
                                                            "bpmn:outgoing": {
                                                                children: "IdFlow_" + edge.id.replaceAll("-", "")
                                                            }
                                                        }
                                                    }),
                                                ]
                                            }
                                        }
                                    case NodeTypes.END_NODE:
                                        return {
                                            "bpmn:endEvent": {
                                                id: "Id_" + node.id.replaceAll("-", ""),
                                                children: [
                                                    ...edges.filter((edge) => edge.target === node.id).map(edge => {
                                                        return {
                                                            "bpmn:incoming": {
                                                                children: "IdFlow_" + edge.id.replaceAll("-", "")
                                                            }
                                                        }
                                                    }),
                                                ]
                                            }
                                        }
                                    case NodeTypes.ACTIVITY_NODE:
                                        const activityNodeData = node.data as ActivityNodeData
                                        return {
                                            "bpmn:task": {
                                                id: "Id_" + node.id.replaceAll("-", ""),
                                                name: activityNodeData.task,
                                                children: [
                                                    ...edges.filter((edge) => edge.source === node.id).map(edge => {
                                                        return {
                                                            "bpmn:outgoing": {
                                                                children: "IdFlow_" + edge.id.replaceAll("-", "")
                                                            }
                                                        }
                                                    }),
                                                    ...edges.filter((edge) => edge.target === node.id).map(edge => {
                                                        return {
                                                            "bpmn:incoming": {
                                                                children: "IdFlow_" + edge.id.replaceAll("-", "")
                                                            }
                                                        }
                                                    }),
                                                ]
                                            }
                                        }
                                    case NodeTypes.INFO_NODE:
                                        const infoNodeData = node.data as InfoNodeData
                                        return {
                                            "bpmn:task": {
                                                id: "Id_" + node.id.replaceAll("-", ""),
                                                name: "Info: " + infoNodeData.infoText,
                                                children: [
                                                    ...edges.filter((edge) => edge.target === node.id).map(edge => {
                                                        return {
                                                            "bpmn:incoming": {
                                                                children: "IdFlow_" + edge.id.replaceAll("-", "")
                                                            }
                                                        }
                                                    }),
                                                    ...edges.filter((edge) => edge.source === node.id).map(edge => {
                                                        return {
                                                            "bpmn:outgoing": {
                                                                children: "IdFlow_" + edge.id.replaceAll("-", "")
                                                            }
                                                        }
                                                    })
                                                ]
                                            }
                                        }
                                    case NodeTypes.GATEWAY_NODE:
                                        console.log("Gateway")
                                        break
                                    case NodeTypes.CHALLENGE_NODE:
                                        console.log("Challenge")
                                        break
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
                                                    //id: "Id_Shape" + node.id.replaceAll("-", "") + "_di",
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
                                                    //id: "IdFlow_" + edge.id.replaceAll("-", "") + "_di",
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
    const xml = jsonToXml(bpmn);
    console.log(xml);
}

function jsonToXml(json: any): string {
    let xml = '';

    for (const key in json) {

        if (json.hasOwnProperty(key)) {
            const value = json[key];
            xml += `<${key}`;

            for (const property in value) {
                if (value.hasOwnProperty(property) && property !== 'children') {
                    xml += ` ${property}="${value[property]}"`;
                }
            }

            if (value.children) {
                xml += '>\n';
                if (typeof value.children === "string") {
                    xml += value.children
                } else {
                    for (const child of value.children) {
                        xml += jsonToXml(child);
                    }
                }
                xml += `</${key}>\n`;
            } else {
                xml += ' />\n'
            }
        }
    }

    return xml;
}
