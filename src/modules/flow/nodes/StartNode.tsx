import React from 'react';
import {Handle, NodeProps, Position} from 'reactflow';

export type StartNodeData = {}

export default function StartNode({ id, data}: NodeProps<StartNodeData>) {

    return (
        <div style={startNodeShapeStyle} >
            <Handle type="source" position={Position.Right} />
        </div>
    )
}

export const startNodeShapeStyle = {
    width: 30,
    height: 30,
    backgroundColor: "white",
    borderRadius: "50%",
    border: "3px solid black"
}