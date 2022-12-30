import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';

export type TextInputNodeData = {
    color: string
}

export default function TextInputNode({ id, data }: NodeProps<TextInputNodeData>) {

    return (
        <div style={{ backgroundColor: data.color, borderRadius: 6}}>
            <Handle type="source" position={Position.Right}/>
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