import React from "react"
import {Comparisons} from "../../model/Comparisons";
import SelectWithCustomInputOption from "./SelectWithCustomInputOption";

export interface ConditionOptionsProps {
    variables: string[]
    selectedVariable: string
    onVariableChanged: (newVariable: string) => void
    selectedComparison: Comparisons
    onComparisonChanges: (newComparison: Comparisons) => void
    valueToCompare: string
    onValueToCompareChanged: (newValueToCompare: string) => void
    conditionOptionsSpanStyle?: any
}

export default function ConditionOption(props: ConditionOptionsProps) {

    console.log("Value1:", props.selectedVariable)
    console.log("Value2:", props.valueToCompare)

    return (
        <span style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            ...props.conditionOptionsSpanStyle
        }}>
            <SelectWithCustomInputOption
                values={props.variables}
                selectedValue={props.selectedVariable}
                onValueChanged={props.onVariableChanged}
            />
            <select
                style={{
                    width: 50
                }}
                defaultValue={props.selectedComparison}
                name="comparison"
                id="comparison"
                className="nodrag"
                onChange={(event) => {
                    props.onComparisonChanges(event.target.value as Comparisons)
                }}
            >
                {
                    Object.values(Comparisons).map(comparison => {
                        return <option key={comparison.valueOf()} value={comparison}>{ comparison.valueOf() }</option>
                    })
                }
            </select>
            <SelectWithCustomInputOption
                values={props.variables}
                selectedValue={props.valueToCompare}
                onValueChanged={props.onValueToCompareChanged}
            />
        </span>
    )
}