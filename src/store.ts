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
        let lowest = 999999
        let highest = -1
        get().nodes.forEach((node) => {
            if (Number(node.id) > highest) {
                highest = Number(node.id)
            }
            if (Number(node.id) < lowest) {
                lowest = Number(node.id)
            }
        })
        if (lowest > 0 && lowest < highest) {
            return String(lowest-1)
        }
        return String(highest+1)
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