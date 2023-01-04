import React from 'react';
import {Handle, NodeProps, Position} from 'reactflow';

export type EndNodeData = {}

export default function EndNode({ id, data}: NodeProps<EndNodeData>) {

    return (
        <div style={endNodeShapeStyle} >
            <Handle type="target" position={Position.Left} />
        </div>
    )
}

export const endNodeShapeStyle = {
    width: 30,
    height: 30,
    backgroundColor: "white",
    borderRadius: "50%",
    border: "6px solid black"
}