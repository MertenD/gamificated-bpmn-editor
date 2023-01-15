import ReactFlow, {
    Background,
    BackgroundVariant,
    Controls,
    MiniMap,
    Node,
    OnConnectStartParams,
    Panel,
    ReactFlowProvider,
    useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import shallow from 'zustand/shallow';
import useStore, {edgeStyle} from '../../store';
import React, {useCallback, useEffect, useRef, useState} from "react";
import NodesToolbar from "./toolbars/NodesToolbar";
import ControlsToolbar from "./toolbars/ControlsToolbar";
import {v4 as uuidv4} from 'uuid';
import OnCanvasNodesToolbar from "./toolbars/OnCanvasNodesSelector";
import {NodeTypes} from "../../model/NodeTypes";

const selector = (state: any) => ({
    getNextNodeId: state.getNextNodeId,
    nodes: state.nodes,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
    nodeTypes: state.nodeTypes,
    getNodeById: state.getNodeById,
    updateNodeParent: state.updateNodeParent
});

function DragAndDropFlow() {
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect, nodeTypes, getNodeById, updateNodeParent } = useStore(selector, shallow);

    const connectStartParams = useRef<OnConnectStartParams | null>(null);
    const reactFlowWrapper = useRef(null);
    const reactFlowInstance = useReactFlow();

    const [openOnCanvasNodeSelector, setOpenOnCanvasNodeSelector] = React.useState(false);
    const [lastEventPosition, setLastEventPosition] = React.useState<{x: number, y: number}>({x: 0, y: 0})
    const [isDragging, setIsDragging] = useState(false)

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

        addNodeAtPosition(position, nodeType, nodeData)
    }, [reactFlowInstance]);

    const onConnectStart = useCallback((event: any, node: OnConnectStartParams) => {
        connectStartParams.current = node;
    }, []);

    const onConnectEnd = useCallback(
        (event: any) => {
            const targetIsPane = event.target.classList.contains('react-flow__pane');
            const targetIsChallengeNode = event.target.parentElement.classList.contains("react-flow__node-challengeNode")

            console.log(event)

            if ((targetIsPane || targetIsChallengeNode) && connectStartParams.current?.handleType === "source" && reactFlowWrapper.current !== null) {
                // @ts-ignore
                const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
                setLastEventPosition({ x: event.clientX - left, y: event.clientY - top })
                setOpenOnCanvasNodeSelector(true)
            }
        },
        [reactFlowInstance.project]
    );

    function addNodeAtPosition(position: {x: number, y: number}, nodeType: NodeTypes, data: any = {}): string {
        let yOffset = 0
        let zIndex = 0
        switch(nodeType) {
            case NodeTypes.START_NODE:
                yOffset = 21
                zIndex = 4
                break
            case NodeTypes.END_NODE:
                yOffset = 21
                zIndex = 3
                break
            case NodeTypes.ACTIVITY_NODE:
                yOffset = 121
                zIndex = 1
                break
            case NodeTypes.DECISION_NODE:
                yOffset = 18
                zIndex = 2
                break
            case NodeTypes.CHALLENGE_NODE:
                yOffset = 200
                zIndex = 0
        }

        const id = uuidv4();
        const newNode = {
            id,
            type: nodeType,
            position: { ...position, y: position.y - yOffset },
            zIndex: zIndex,
            data: data,
        } as Node;

        reactFlowInstance.addNodes(newNode);

        return id
    }

    const onNodeDragStart = useCallback(() => {
        setIsDragging(true)
    }, [])

    const onNodeDragStop = useCallback(() => {
        setIsDragging(false)
    }, [])

    useEffect(() => {
        if (!isDragging) {
            nodes.filter((node: Node) => node.type !== NodeTypes.CHALLENGE_NODE).forEach((node: Node) => {
                const intersectingChallenge = reactFlowInstance.getIntersectingNodes(node).filter((node) => node.type === NodeTypes.CHALLENGE_NODE)[0]
                // If the node had no parent it will be added
                if (intersectingChallenge !== undefined && node.parentNode !== intersectingChallenge.id) {
                    updateNodeParent(node, intersectingChallenge, undefined)
                // If the node had a parent it will be removed
                } else if (intersectingChallenge === undefined && node.parentNode !== undefined) {
                    updateNodeParent(node, undefined, getNodeById(node.parentNode))
                }
            })
        }
    }, [nodes])

    return (
        <ReactFlow ref={reactFlowWrapper}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onConnectStart={onConnectStart}
            onConnectEnd={onConnectEnd}
            onDragOver={onDragOver}
            onNodeDragStart={onNodeDragStart}
            onNodeDragStop={onNodeDragStop}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
            selectNodesOnDrag={false}
            defaultEdgeOptions={{
                type: "smoothstep"
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
            <OnCanvasNodesToolbar
                open={openOnCanvasNodeSelector}
                position={lastEventPosition}
                onClose={(nodeType: NodeTypes | null) => {
                    setOpenOnCanvasNodeSelector(false)

                    if (nodeType !== null && connectStartParams.current !== null && connectStartParams.current?.nodeId !== null) {
                        const id = addNodeAtPosition(reactFlowInstance.project(lastEventPosition), nodeType)
                        reactFlowInstance.addEdges({
                            id,
                            source: connectStartParams.current.nodeId,
                            sourceHandle: connectStartParams.current?.handleId,
                            target: id,
                            ...edgeStyle
                        });
                    }
                }}
            />
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