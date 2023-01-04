import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';

export type TextInputNodeData = {

}

export default function ActivityNode({ id, data }: NodeProps<TextInputNodeData>) {

    return (
        <div style={{ ...textInputShapeStyle }}>
            <Handle type="source" position={Position.Right}/>
            <Handle type="target" position={Position.Left}/>
            <div style={{
                padding: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <input
                    style={{ marginBottom: 10 }}
                    type="text"
                    placeholder="Task"
                    defaultValue=""
                    className="nodrag"
                />
                <span>
                    { "Gamification type: " }
                    <select name="gamificationType" id="gamificationType">
                        <option value="None">None</option>
                        <option value="Points">Points</option>
                        <option value="Rewards">Rewards</option>
                        <option value="Badges">Badges</option>
                    </select>
                </span>
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