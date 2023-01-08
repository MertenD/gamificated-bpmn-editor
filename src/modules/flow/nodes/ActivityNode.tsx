import React, {useEffect, useState} from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import useStore from "../../../store";
import {GamificationType} from "../../../model/GamificationType";
import PointsGamificationOptions, {PointsGamificationOptionsData} from "../../gamification/PointsGamificationOptions";
import {ActivityType} from "../../../model/ActivityType";
import RewardGamificationOptions, {RewardGamificationOptionsData} from "../../gamification/RewardGamificationOptions";

export type ActivityNodeData = {
    task?: string,
    activityType?: ActivityType
    choices?: string,
    inputRegex?: string,
    variableName?: string,
    gamificationType? : GamificationType
    gamificationOptions?: PointsGamificationOptionsData | RewardGamificationOptionsData
}

export default function ActivityNode({ id, data }: NodeProps<ActivityNodeData>) {

    const updateNodeData = useStore((state) => state.updateNodeData);
    const [task, setTask] = useState(data.task || "");
    const [activityType, setActivityType] = useState(data.activityType || ActivityType.TEXT_INPUT)
    const [choices, setChoices] = useState(data.choices || "")
    const [inputRegex, setInputRegex] = useState(data.inputRegex || "")
    const [variableName, setVariableName] = useState(data.variableName || "")
    const [gamificationType, setGamificationType] = useState(data.gamificationType || GamificationType.NONE)
    const [gamificationOptions, setGamificationOptions] = useState(data.gamificationOptions || {})

    useEffect(() => {
        updateNodeData<ActivityNodeData>(id, {
            task: task,
            activityType: activityType,
            choices: choices,
            inputRegex: inputRegex,
            variableName: variableName,
            gamificationType: gamificationType,
            gamificationOptions: gamificationType === GamificationType.NONE ? {} : gamificationOptions
        })
    }, [id, task, activityType, choices, inputRegex, variableName, gamificationType, gamificationOptions, updateNodeData])

    return (
        <div style={{ ...activityShapeStyle }}>
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
                <hr style={{ width: "100%" }}/>
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
                {
                    (() => {
                        switch (activityType) {
                            case ActivityType.TEXT_INPUT:
                                return (
                                    <input
                                        style={{
                                            width: "100%",
                                            marginBottom: 10
                                        }}
                                        type="text"
                                        placeholder="Regex for correct input"
                                        value={inputRegex}
                                        className="nodrag"
                                        onChange={(event) => {
                                            setInputRegex(event.target.value)
                                        }}
                                    />
                                )
                            case ActivityType.SINGLE_CHOICE:
                            case ActivityType.MULTIPLE_CHOICE:
                                return (
                                    <input
                                        style={{
                                            width: "100%",
                                            marginBottom: 10
                                        }}
                                        type="text"
                                        placeholder="Choices (1,2,...)"
                                        value={choices}
                                        className="nodrag"
                                        onChange={(event) => {
                                            setChoices(event.target.value)
                                        }}
                                    />
                                )
                        }
                    })()
                }
                <span style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 10
                }}>
                    { "Save input as: " }
                    <input
                        type="text"
                        placeholder="Variable name"
                        defaultValue={variableName}
                        className="nodrag"
                        onChange={(event) => {
                            setVariableName(event.target.value)
                        }}
                    />
                </span>
                <hr style={{ width: "100%" }}/>
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
                {
                    (() => {
                        switch (gamificationType) {
                            case (GamificationType.POINTS):
                                return <PointsGamificationOptions
                                    gamificationOptions={gamificationOptions as PointsGamificationOptionsData}
                                    onChange={(gamificationOptions: PointsGamificationOptionsData) => {
                                        setGamificationOptions(gamificationOptions)
                                    }}
                                />
                            case GamificationType.REWARDS:
                                return <RewardGamificationOptions
                                    nodeId={id}
                                    gamificationOptions={gamificationOptions as RewardGamificationOptionsData}
                                    onChange={(gamificationOptions: RewardGamificationOptionsData) => {
                                        setGamificationOptions(gamificationOptions)
                                    }}
                                />
                        }
                    })()
                }
            </div>
        </div>
    )
}

export const activityShapeStyle = {
    minWidth: 50,
    minHeight: 50,
    borderRadius: 6,
    backgroundColor: "white",
    border: "3px solid black"
}