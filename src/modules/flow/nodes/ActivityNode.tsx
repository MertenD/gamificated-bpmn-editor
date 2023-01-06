import React, {useEffect, useState} from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import useStore from "../../../store";
import {GamificationType} from "../../../model/GamificationType";
import PointsGamificationOptions from "../../gamification/PointsGamificationOptions";
import {ActivityType} from "../../../model/ActivityType";

export type ActivityNodeData = {
    task?: string,
    activityType?: ActivityType
    gamificationType? : GamificationType
}

export default function ActivityNode({ id, data }: NodeProps<ActivityNodeData>) {

    const updateNodeData = useStore((state) => state.updateNodeData);
    const [task, setTask] = useState(data.task || "");
    const [activityType, setActivityType] = useState(data.activityType || ActivityType.TEXT_INPUT)
    const [gamificationType, setGamificationType] = useState(data.gamificationType || GamificationType.NONE)

    useEffect(() => {
        updateNodeData<ActivityNodeData>(id, {
            task: task,
            activityType: activityType,
            gamificationType: gamificationType
        })
    }, [id, task, activityType, gamificationType])

    return (
        <div style={{ ...textInputShapeStyle }}>
            <Handle type="source" position={Position.Right}/>
            <Handle type="target" position={Position.Left}/>
            <div style={{
                width: 300,
                padding: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: "wrap"
            }}>
                <input
                    style={{ width: "100%", marginBottom: 10 }}
                    type="text"
                    placeholder="Task"
                    defaultValue={task}
                    className="nodrag"
                    onChange={(event) => {
                        setTask(event.target.value)
                    }}
                />
                <span style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 10
                }}>
                    { "Activity type: " }
                    <select
                        defaultValue={activityType}
                        name="activityType"
                        id="activityType"
                        className="nodrag"
                        onChange={(event) => {
                            // @ts-ignore
                            setActivityType(event.target.value)
                        }}
                    >
                        {
                            Object.values(ActivityType).map(type => {
                                return <option key={type.valueOf()} value={type}>{ type.valueOf() }</option>
                            })
                        }
                    </select>
                </span>
                <span style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 10
                }}>
                    { "Gamification type: " }
                    <select
                        defaultValue={gamificationType}
                        name="gamificationType"
                        id="gamificationType"
                        className="nodrag"
                        onChange={(event) => {
                            // @ts-ignore
                            setGamificationType(event.target.value)
                        }}
                    >
                        {
                            Object.values(GamificationType).map(type => {
                                return <option key={type.valueOf()} value={type}>{ type.valueOf() }</option>
                            })
                        }
                    </select>
                </span>
                { gamificationType === GamificationType.POINTS ? (
                    <PointsGamificationOptions />
                ) : (
                    <></>
                )}
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