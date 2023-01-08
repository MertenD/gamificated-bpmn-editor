import create from 'zustand';
import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Connection,
    Edge,
    EdgeChange,
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
    getPreviousNodes: (nodeId: string) => Node[];
    getNodeById: (nodeId: string) => Node | null;
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
        set({
            edges: addEdge(connection, get().edges)
        });
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
    getPreviousNodes: (nodeId: string): Node[] => {
        const inputEdges = get().edges.filter((edge) => edge.target === nodeId)
        const nodes = inputEdges.map((edge) => get().getNodeById(edge.source)).filter((node) => node !== null) as Node[]
        nodes.push(...nodes.flatMap((node) =>
            get().getPreviousNodes(node.id)
        ))
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