import React, {useEffect, useState} from "react"
import {RewardType} from "../../model/RewardType";

export type RewardGamificationOptionsData = {
    rewardType?: RewardType,
    condition?: string
}

interface RewardGamificationOptionsProps {
    gamificationOptions: RewardGamificationOptionsData
    onChange: (gamificationOptions: RewardGamificationOptionsData) => void
}

export default function RewardGamificationOptions(props: RewardGamificationOptionsProps) {

    const [rewardType, setRewardType] = useState(props.gamificationOptions.rewardType || RewardType.EXPLORER_BATCH)
    const [condition, setCondition] = useState(props.gamificationOptions.condition || "")

    useEffect(() => {
        props.onChange({
            rewardType: rewardType,
            condition: condition
        })
    }, [rewardType, condition])

    return (
        <>
            <span style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10
            }}>
                { "Reward Type: " }
                <select
                    defaultValue={rewardType}
                    name="rewardType"
                    id="rewardType"
                    className="nodrag"
                    onChange={(event) => {
                        // @ts-ignore
                        setRewardType(event.target.value)
                    }}
                >
                    {
                        Object.values(RewardType).map(type => {
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
                { "Condition: " }
                <input
                    type="text"
                    placeholder="Condition"
                    defaultValue={condition}
                    className="nodrag"
                    onChange={(event) => {
                        setCondition(event.target.value)
                    }}
                />
            </span>
        </>
    )
}