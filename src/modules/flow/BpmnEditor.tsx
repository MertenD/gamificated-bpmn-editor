import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    BackgroundVariant,
    ReactFlowProvider,
    useReactFlow, Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import shallow from 'zustand/shallow';
import useStore from '../../store';
import ColorChooserNode from './nodes/ColorChooserNode';
import {useCallback, useRef} from "react";
import ActivityBar from "./ActivityBar";
import TextInputNode from "./nodes/TextInputNode";

const nodeTypes = {
    colorChooser: ColorChooserNode,
    textInput: TextInputNode
};

const selector = (state: any) => ({
    nodes: state.nodes,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
});

let nodeId = 0;

function Flow() {
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(selector, shallow);

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

        console.log( nodeType )

        // check if the dropped element is valid
        if (typeof nodeType === 'undefined' || !nodeType) {
            return;
        }

        const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        });

        const newNode = {
            id: "Node" + nodeId++,
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
                <ActivityBar />
            </Panel>
        </ReactFlow>
    );
}

export default function BpmnEditor() {
    return (
        <ReactFlowProvider>
            <Flow />
        </ReactFlowProvider>
    )
}