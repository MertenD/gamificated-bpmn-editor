import React, {useState} from "react"
import {PointType} from "../../model/PointsType";

export default function PointsGamificationOptions() {

    const [pointType, setPointType] = useState(PointType.EXPERIENCE)
    const [pointsForSuccess, setPointsForSuccess] = useState(0)

    return (
        <>
            <span style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10
            }}>
                { "Point Type: " }
                <select
                    defaultValue={pointType}
                    name="pointType"
                    id="pointType"
                    className="nodrag"
                    onChange={(event) => {
                        // @ts-ignore
                        setPointType(event.target.value)
                    }}
                >
                    {
                        Object.values(PointType).map(type => {
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
                { "Points for success: " }
                <input
                    type="number"
                    placeholder="Points"
                    defaultValue={pointsForSuccess}
                    className="nodrag"
                    onChange={(event) => {
                        setPointsForSuccess(Number(event.target.value))
                    }}
                />
            </span>
        </>
    )
}