import ReactFlow, {
    Background,
    BackgroundVariant,
    Controls,
    MiniMap,
    Panel,
    ReactFlowProvider,
    useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import shallow from 'zustand/shallow';
import useStore from '../../store';
import {useCallback, useRef} from "react";
import NodesToolbar from "./toolbars/NodesToolbar";
import ControlsToolbar from "./toolbars/ControlsToolbar";

const selector = (state: any) => ({
    getNextNodeId: state.getNextNodeId,
    nodes: state.nodes,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
    nodeTypes: state.nodeTypes
});

function DragAndDropFlow() {
    const { getNextNodeId, nodes, edges, onNodesChange, onEdgesChange, onConnect, nodeTypes } = useStore(selector, shallow);

    const reactFlowWrapper = useRef(null);
    const reactFlowInstance = useReactFlow();

    const onDragOver = useCallback((event: any) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((event: any) => {
        event.preventDefault();

        // @ts-ignore
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const { nodeType, nodeData } = JSON.parse(event.dataTransfer.getData('application/reactflow'));

        // check if the dropped element is valid
        if (typeof nodeType === 'undefined' || !nodeType) {
            return;
        }

        const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        });

        const newNode = {
            id: getNextNodeId(),
            type: nodeType,
            data: nodeData,
            position: position,
        };

        reactFlowInstance.addNodes(newNode);
    }, [reactFlowInstance]);

    return (
        <ReactFlow ref={reactFlowWrapper}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={{
                type: "step"
            }}
            deleteKeyCode={["Backspace", "Delete"]}
        >
            <MiniMap
                nodeStrokeWidth={3}
                zoomable
                pannable
            />
            <Controls />
            <Background variant={BackgroundVariant.Dots} />
            <Panel position="top-left">
                <NodesToolbar />
            </Panel>
            <Panel position="top-right">
                <ControlsToolbar />
            </Panel>
        </ReactFlow>
    );
}

export default function BpmnEditor() {
    return (
        <ReactFlowProvider>
            <DragAndDropFlow />
        </ReactFlowProvider>
    )
}