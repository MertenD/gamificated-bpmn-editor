import React from "react"
import {Comparisons} from "../../model/Comparisons";
import ConditionOption from "./ConditionOption";

export interface OptionalConditionOptionsProps {
    hasCondition: boolean
    setHasCondition: (newValue: boolean) => void
    variables: string[]
    selectedVariable: string
    onVariableChanged: (newVariable: string) => void
    selectedComparison: Comparisons
    onComparisonChanges: (newComparison: Comparisons) => void
    valueToCompare: string
    onValueToCompareChanged: (newValueToCompare: string) => void
    conditionOptionsSpanStyle?: any
}

export default function OptionalConditionOption(props: OptionalConditionOptionsProps) {

    return (
        <>
            <div style={{ width: "100%", textAlign: "left", marginBottom: 5}}>
                Condition:
                <input
                    style={{
                        marginLeft: 10
                    }}
                    type="checkbox"
                    defaultChecked={props.hasCondition}
                    onChange={() => props.setHasCondition(!props.hasCondition)}
                />
            </div>
            { props.hasCondition && (
                <ConditionOption
                    variables={ props.variables }
                    selectedVariable={ props.selectedVariable }
                    onVariableChanged={ newVariable => props.onVariableChanged(newVariable) }
                    selectedComparison={ props.selectedComparison }
                    onComparisonChanges={ newComparison => props.onComparisonChanges(newComparison) }
                    valueToCompare={ props.valueToCompare }
                    onValueToCompareChanged={ newValueToCompare => props.onValueToCompareChanged(newValueToCompare) }
                    conditionOptionsSpanStyle={ props.conditionOptionsSpanStyle }
                />
            )}
        </>
    )
}