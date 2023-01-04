import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';

export type DecisionNodeData = {

}

export default function DecisionNode({ id, data }: NodeProps<DecisionNodeData>) {

    return (
        <div style={{ backgroundColor: "transparent", position: "relative" }}>
            <input
                style={{
                    width: 100,
                    position: 'fixed',
                    right: -120,
                    top: 5
                }}
                type="text"
                placeholder="Question"
                defaultValue=""
                className="nodrag"
            />
            <input
                style={{
                    width: 70,
                    position: 'fixed',
                    top: -30,
                    left: 30
                }}
                type="text"
                placeholder="Condition 1"
                defaultValue=""
                className="nodrag"
            />
            <input
                style={{
                    width: 70,
                    position: 'fixed',
                    bottom: -30,
                    left: 30
                }}
                type="text"
                placeholder="Condition 2"
                defaultValue=""
                className="nodrag"
            />
            <div style={{ ...decisionShapeStyle }} />
            <Handle type="target" position={Position.Left} id="a"/>
            <Handle type="source" position={Position.Top} id="b"/>
            <Handle type="source" position={Position.Bottom} id="c"/>
        </div>
    )
}

export const decisionShapeStyle = {
    width: 30,
    height: 30,
    transform: "rotateY(0deg) rotate(45deg)",
    borderRadius: 6,
    backgroundColor: "white",
    border: "3px solid black",
}