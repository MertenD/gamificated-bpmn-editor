import React, {useEffect, useState} from "react"
import {PointsType} from "../../model/PointsType";
import OptionalConditionOption from "../form/OptionalConditionOption";
import {Comparisons} from "../../model/Comparisons";
import useStore from "../../store";
import DropdownOption from "../form/DropdownOption";
import {PointsApplicationMethod} from "../../model/PointsApplicationMethod";

export type PointsGamificationOptionsData = {
    pointType?: PointsType,
    pointsApplicationMethod: PointsApplicationMethod,
    pointsForSuccess?: number,
    hasCondition?: boolean
    value1?: string,
    comparison?: Comparisons,
    value2?: string
}

interface PointsGamificationOptionsProps {
    parentNodeId: string,
    parentVariableName: string,
    gamificationOptions: PointsGamificationOptionsData
    onChange: (gamificationOptions: PointsGamificationOptionsData) => void
    withoutOptionalCondition?: boolean
}

export default function PointsGamificationOptions(props: PointsGamificationOptionsProps) {

    const nodes = useStore((state) => state.nodes)
    const edges = useStore((state) => state.edges)
    const getAvailableVariableNames = useStore((state) => state.getAvailableVariableNames)
    const [pointType, setPointType] = useState(props.gamificationOptions.pointType || PointsType.EXPERIENCE)
    const [pointsApplicationMethod, setPointsApplicationMethod] = useState(props.gamificationOptions.pointsApplicationMethod || PointsApplicationMethod.CHANGE_BY)
    const [pointsForSuccess, setPointsForSuccess] = useState(props.gamificationOptions.pointsForSuccess || 0)
    const [availableVariableNames, setAvailableVariableNames] = useState<string[]>([])
    const [hasCondition, setHasCondition] = useState<boolean>(props.gamificationOptions.hasCondition || false)
    const [value1, setValue1] = useState(props.gamificationOptions.value1 || "{" + getAvailableVariableNames(props.parentNodeId,  props.parentVariableName)[0] + "}");
    const [comparison, setComparison] = useState(props.gamificationOptions.comparison || Comparisons.EQUALS);
    const [value2, setValue2] = useState(props.gamificationOptions.value2 || "{" + getAvailableVariableNames(props.parentNodeId,  props.parentVariableName)[0] + "}");

    useEffect(() => {
        props.onChange({
            pointType: pointType,
            pointsApplicationMethod: pointsApplicationMethod,
            pointsForSuccess: pointsForSuccess,
            hasCondition: hasCondition,
            value1: value1,
            comparison: comparison,
            value2: value2
        })
    }, [pointType, pointsApplicationMethod, pointsForSuccess, hasCondition, value1, comparison, value2])

    useEffect(() => {
        setAvailableVariableNames(getAvailableVariableNames(props.parentNodeId, props.parentVariableName))
    }, [props.parentNodeId, props.parentVariableName, nodes, edges])


    // TODO Irgendwie ist das hier gedoppelt mit dem optional und hastCondition

    return (
        <>
            <DropdownOption
                title={ "Point type" }
                values={ Object.values(PointsType) }
                selectedValue={ pointType }
                onValueChanged={ newValue => setPointType(newValue as PointsType) }
            />
            <span style={{
                flexWrap: "wrap",
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10
            }}>
                <select
                    style={{

                    }}
                    defaultValue={PointsApplicationMethod.CHANGE_BY}
                    name="comparison"
                    id="comparison"
                    className="nodrag"
                    onChange={(event) => {
                        setPointsApplicationMethod(event.target.value as PointsApplicationMethod)
                    }}
                >
                    <option key={PointsApplicationMethod.CHANGE_BY} value={PointsApplicationMethod.CHANGE_BY}>Change points by</option>
                    <option key={PointsApplicationMethod.SET_TO} value={PointsApplicationMethod.SET_TO}>Set points to</option>
                </select>
                <input
                    style={{
                        marginLeft: 10,
                        width: "50%"
                    }}
                    type="number"
                    placeholder={ "Amount" }
                    defaultValue={ pointsForSuccess }
                    className="nodrag"
                    onChange={(event) => {
                        setPointsForSuccess(Number(event.target.value))
                    }}
                />
            </span>
            { (props.withoutOptionalCondition === undefined || !props.withoutOptionalCondition) && <OptionalConditionOption
                hasCondition={hasCondition}
                setHasCondition={ newValue => setHasCondition(newValue) }
                variables={availableVariableNames}
                value1={value1}
                onValue1Changed={newValue => setValue1(newValue) }
                selectedComparison={ comparison }
                onComparisonChanges={ newComparison => setComparison(newComparison) }
                value2={ value2 }
                onValue2Changed={newValue => setValue2(newValue) }
            /> }
        </>
    )
}