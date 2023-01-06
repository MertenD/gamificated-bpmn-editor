import React, {useEffect, useState} from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import useStore from "../../../store";

export type DecisionNodeData = {
    condition?: string,
    path1?: string,
    path2?: string
}

export default function DecisionNode({ id, data }: NodeProps<DecisionNodeData>) {

    const updateNodeData = useStore((state) => state.updateNodeData);
    const [condition, setCondition] = useState(data.condition || "");
    const [path1, setPath1] = useState(data.path1 || "");
    const [path2, setPath2] = useState(data.path2 || "");

    useEffect(() => {
        updateNodeData<DecisionNodeData>(id, {
            condition: condition,
            path1: path1,
            path2: path2
        })
    }, [id, condition, path1, path2])

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
                placeholder="Condition"
                defaultValue={condition}
                className="nodrag"
                onChange={(event) => setCondition(event.target.value)}
            />
            <input
                style={{
                    width: 70,
                    position: 'fixed',
                    top: -30,
                    left: 30
                }}
                type="text"
                placeholder="Path 1"
                defaultValue={path1}
                className="nodrag"
                onChange={(event) => setPath1(event.target.value)}
            />
            <input
                style={{
                    width: 70,
                    position: 'fixed',
                    bottom: -30,
                    left: 30
                }}
                type="text"
                placeholder="Path 2"
                defaultValue={path2}
                className="nodrag"
                onChange={(event) => setPath2(event.target.value)}
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