import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';

export type TextInputNodeData = {}

export default function TextInputNode({ id, data }: NodeProps<TextInputNodeData>) {

    return (
        <div style={textInputShapeStyle}>
            <Handle type="source" position={Position.Right}/>
            <Handle type="target" position={Position.Left}/>
            <div style={{ padding: 20 }}>
                <input
                    type="text"
                    placeholder="Enter Task"
                    defaultValue=""
                    className="nodrag"
                />
            </div>
        </div>
    )
}

export const textInputShapeStyle = {
    minWidth: 50,
    minHeight: 50,
    borderRadius: 6,
    backgroundColor: "white",
    border: "3px solid black"
}