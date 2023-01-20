import React, {useEffect, useState} from "react"
import {PointsType} from "../../model/PointsType";
import OptionalConditionOption from "../form/OptionalConditionOption";
import {Comparisons} from "../../model/Comparisons";
import useStore from "../../store";
import DropdownOption from "../form/DropdownOption";

export type PointsGamificationOptionsData = {
    pointType?: PointsType,
    pointsForSuccess?: number,
    hasCondition?: boolean
    variableName?: string,
    comparison?: Comparisons,
    valueToCompare?: string
}

interface PointsGamificationOptionsProps {
    nodeId: string,
    parentVariableName: string,
    gamificationOptions: PointsGamificationOptionsData
    onChange: (gamificationOptions: PointsGamificationOptionsData) => void
}

export default function PointsGamificationOptions(props: PointsGamificationOptionsProps) {

    const nodes = useStore((state) => state.nodes)
    const edges = useStore((state) => state.edges)
    const getAvailableVariableNames = useStore((state) => state.getAvailableVariableNames)
    const [pointType, setPointType] = useState(props.gamificationOptions.pointType || PointsType.EXPERIENCE)
    const [pointsForSuccess, setPointsForSuccess] = useState(props.gamificationOptions.pointsForSuccess || 0)
    const [availableVariableNames, setAvailableVariableNames] = useState<string[]>([])
    const [hasCondition, setHasCondition] = useState<boolean>(props.gamificationOptions.hasCondition || false)
    const [selectedVariable, setSelectedVariable] = useState(props.gamificationOptions.variableName || PointsType.EXPERIENCE.valueOf());
    const [comparison, setComparison] = useState(props.gamificationOptions.comparison || Comparisons.EQUALS);
    const [valueToCompare, setValueToCompare] = useState(props.gamificationOptions.valueToCompare || "");

    useEffect(() => {
        props.onChange({
            pointType: pointType,
            pointsForSuccess: pointsForSuccess,
            hasCondition: hasCondition,
            variableName: selectedVariable,
            comparison: comparison,
            valueToCompare: valueToCompare
        })
    }, [pointType, pointsForSuccess, hasCondition, selectedVariable, comparison, valueToCompare])

    useEffect(() => {
        setAvailableVariableNames(getAvailableVariableNames(props.nodeId, props.parentVariableName))
    }, [props.nodeId, props.parentVariableName, nodes, edges])

    return (
        <>
            <DropdownOption
                title={ "Point type" }
                values={ Object.values(PointsType) }
                value={ pointType }
                onValueChanged={ newValue => setPointType(newValue as PointsType) }
            />
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
            <OptionalConditionOption
                hasCondition={hasCondition}
                setHasCondition={ newValue => setHasCondition(newValue) }
                variables={availableVariableNames}
                selectedVariable={selectedVariable}
                onVariableChanged={ newVariable => setSelectedVariable(newVariable) }
                selectedComparison={ comparison }
                onComparisonChanges={ newComparison => setComparison(newComparison) }
                valueToCompare={ valueToCompare }
                onValueToCompareChanged={ newValueToCompare => setValueToCompare(newValueToCompare) }
            />
        </>
    )
}