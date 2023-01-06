import create from 'zustand';
import {
    Connection,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    addEdge,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    applyNodeChanges,
    applyEdgeChanges
} from 'reactflow';
import ActivityNode from "./modules/flow/nodes/ActivityNode";
import StartNode from "./modules/flow/nodes/StartNode";
import DecisionNode from "./modules/flow/nodes/DecisionNode";
import EndNode from "./modules/flow/nodes/EndNode";
import {v4 as uuidv4} from 'uuid';

export type RFState = {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    updateNodeData: <NodeData>(nodeId: string, data: NodeData) => void;
    getNextNodeId: () => string
    getNodeById: (nodeId: string) => Node | null;
}

export const useStore = create<RFState>((set, get) => ({
    nodes: [],
    edges: [],
    nodeTypes: {
        textInput: ActivityNode,
        start: StartNode,
        end: EndNode,
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
    getNextNodeId: () => {
        return uuidv4();
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