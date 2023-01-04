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

export type RFState = {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    getNodeById: (nodeID: string) => Node | null
};

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