import React, {useEffect, useState} from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import useStore from "../../../store";

enum GamificationType {
    NONE = "None",
    POINTS = "Points",
    REWARDS = "Rewards",
    BADGES = "Badges"
}

export type ActivityNodeData = {
    task?: string,
    gamificationType? : GamificationType
}

export default function ActivityNode({ id, data }: NodeProps<ActivityNodeData>) {

    const updateNodeData = useStore((state) => state.updateNodeData);
    const [task, setTask] = useState(data.task || "");
    const [gamificationType, setGamificationType] = useState(data.gamificationType || GamificationType.NONE)

    useEffect(() => {
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
                        {
                            Object.values(GamificationType).map(type => {
                                return <option key={type.valueOf()} value={type}>{type.valueOf()}</option>
                            })
                        }
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