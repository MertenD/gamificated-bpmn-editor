import React, {useEffect, useState} from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import useStore from "../../../store";

export type ActivityNodeData = {
    task?: string,
    gamificationType? : string
}

export default function ActivityNode({ id, data }: NodeProps<ActivityNodeData>) {

    const updateNodeData = useStore((state) => state.updateNodeData);
    const [task, setTask] = useState(data.task || "");
    const [gamificationType, setGamificationType] = useState(data.gamificationType || "none")

    useEffect(() => {
        console.log(id)
        updateNodeData<ActivityNodeData>(id, {
            task: task,
            gamificationType: gamificationType
        })
    }, [id, task, gamificationType])

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
                    defaultValue={task}
                    className="nodrag"
                    onChange={(event) => {
                        setTask(event.target.value)
                    }}
                />
                <span>
                    { "Gamification type: " }
                    <select defaultValue={gamificationType} name="gamificationType" id="gamificationType" onChange={(event) => {
                        // @ts-ignore
                        setGamificationType(event.target.value)
                    }}>
                        <option value={"none"}>None</option>
                        <option value={"points"}>Points</option>
                        <option value={"rewards"}>Rewards</option>
                        <option value={"badges"}>Badges</option>
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