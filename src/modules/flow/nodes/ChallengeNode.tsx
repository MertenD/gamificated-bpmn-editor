import React, {useState} from 'react';
import {NodeProps} from 'reactflow';

export type ChallengeNodeData = {
    backgroundColor?: string
}

export default function ChallengeNode({ id, data }: NodeProps<ChallengeNodeData>) {

    const [backgroundColor, setBackgroundColor] = useState(data.backgroundColor || "#eeffee")

    return (
        <div style={{ ...challengeShapeStyle, minWidth: 1000, minHeight: 400, backgroundColor: backgroundColor + "99" }} >
            Title
        </div>
    )
}

export const challengeShapeStyle = {
    minWidth: 50,
    minHeight: 50,
    borderRadius: 6,
    backgroundColor: "rgba(200,255,200,0.25)",
    border: "3px solid black",
}