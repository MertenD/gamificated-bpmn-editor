import React, {useEffect, useState} from "react"
import {PointsType} from "../../model/PointsType";
import OptionalConditionOption from "../form/OptionalConditionOption";
import {Comparisons} from "../../model/Comparisons";
import useStore from "../../store";
import DropdownOption from "../form/DropdownOption";
import NumberOption from "../form/NumberOption";

export type PointsGamificationOptionsData = {
    pointType?: PointsType,
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
    const [pointsForSuccess, setPointsForSuccess] = useState(props.gamificationOptions.pointsForSuccess || 0)
    const [availableVariableNames, setAvailableVariableNames] = useState<string[]>([])
    const [hasCondition, setHasCondition] = useState<boolean>(props.gamificationOptions.hasCondition || false)
    const [value1, setValue1] = useState(props.gamificationOptions.value1 || "{" + getAvailableVariableNames(props.parentNodeId,  props.parentVariableName)[0] + "}");
    const [comparison, setComparison] = useState(props.gamificationOptions.comparison || Comparisons.EQUALS);
    const [value2, setValue2] = useState(props.gamificationOptions.value2 || "{" + getAvailableVariableNames(props.parentNodeId,  props.parentVariableName)[0] + "}");

    useEffect(() => {
        props.onChange({
            pointType: pointType,
            pointsForSuccess: pointsForSuccess,
            hasCondition: hasCondition,
            value1: value1,
            comparison: comparison,
            value2: value2
        })
    }, [pointType, pointsForSuccess, hasCondition, value1, comparison, value2])

    useEffect(() => {
        setAvailableVariableNames(getAvailableVariableNames(props.parentNodeId, props.parentVariableName))
    }, [props.parentNodeId, props.parentVariableName, nodes, edges])

    return (
        <>
            <DropdownOption
                title={ "Point type" }
                values={ Object.values(PointsType) }
                selectedValue={ pointType }
                onValueChanged={ newValue => setPointType(newValue as PointsType) }
            />
            <NumberOption
                title={ "Points for success" }
                placeholder={ "Points" }
                value={ pointsForSuccess }
                onValueChanged={ newValue => setPointsForSuccess(newValue) }
            />
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