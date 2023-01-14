import create from 'zustand';
import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Connection,
    Edge,
    EdgeChange,
    MarkerType,
    Node,
    NodeChange,
    OnConnect,
    OnEdgesChange,
    OnNodesChange
} from 'reactflow';
import ActivityNode from "./modules/flow/nodes/ActivityNode";
import StartNode from "./modules/flow/nodes/StartNode";
import DecisionNode from "./modules/flow/nodes/DecisionNode";
import EndNode from "./modules/flow/nodes/EndNode";

export type RFState = {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    updateNodeData: <NodeData>(nodeId: string, data: NodeData) => void;
    getPreviousNodes: (nodeId: string, alreadyAddedNodeIds?: string[]) => Node[];
    getNodeById: (nodeId: string) => Node | null;
}

export const edgeStyle = {
    markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "black",
        width: 100,
        height: 20
    },
    style: {
        stroke: "black",
        strokeWidth: 2
    }
}

export const useStore = create<RFState>((set, get) => ({
    nodes: [],
    edges: [],
    nodeTypes: {
        activityNode: ActivityNode,
        startNode: StartNode,
        endNode: EndNode,
        decisionNode: DecisionNode
    },
    onNodesChange: (changes: NodeChange[]) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },
    onEdgesChange: (changes: EdgeChange[]) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },
    onConnect: (connection: Connection) => {
        // 1. Source and target node can not be the same
        // 2. If the target has already an ingoing connection: delete old connection
        if (connection.source !== connection.target) {
            set({
                edges: get().edges.map((edge) => {
                    if (edge.source == connection.source) {
                        return null
                    }
                    return edge
                }).filter((edge) => edge !== null).map((edge) => edge as Edge)
            })
            set({
                edges: addEdge({
                    ...connection,
                    ...edgeStyle
                }, get().edges)
            });
        }
    },
    updateNodeData: <NodeData>(nodeId: string, data: NodeData) => {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeId) {
                    node.data = data;
                }
                return node;
            }),
        });
    },
    getPreviousNodes: (nodeId: string, alreadyAddedNodeIds: string[] = []): Node[] => {
        if (alreadyAddedNodeIds.includes(nodeId)) {
            return []
        }
        const inputEdges = get().edges.filter((edge) => edge.target === nodeId)
        const nodes = inputEdges.map((edge) => get().getNodeById(edge.source)).filter((node) => node !== null) as Node[]
        nodes.push(...nodes.flatMap((node) => {
            return get().getPreviousNodes(node.id, [...alreadyAddedNodeIds, nodeId])
        }))
        return nodes
    },
    getNodeById: (nodeId: string): Node | null => {
        let resultNode = null
        get().nodes.forEach((node) => {
            if (node.id === nodeId) {
                resultNode = node
            }
        })
        return resultNode;
    },
}));

export default useStore;