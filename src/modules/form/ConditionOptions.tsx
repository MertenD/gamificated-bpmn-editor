import React from "react"
import {Comparisons} from "../../model/Comparisons";

export interface ConditionOptionsProps {
    variables: string[]
    selectedVariable: string
    onVariableChanged: (newVariable: string) => void
    selectedComparison: Comparisons
    onComparisonChanges: (newComparison: Comparisons) => void
    valueToCompare: string
    onValueToCompareChanged: (newValueToCompare: string) => void
    variablesSelectStyle?: any
    comparisonSelectStyle?: any
    valueToCompareInputStyle?: any
}

export default function ConditionOptions(props: ConditionOptionsProps) {

    return (
        <span style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10
        }}>
            <select
                style={{
                    ...props.variablesSelectStyle,
                    width: 120
                }}
                value={props.selectedVariable}
                name="variableName"
                id="variableName"
                className="nodrag"
                onChange={(event) => {
                    props.onVariableChanged(event.target.value)
                }}
            >
            {
                props.variables.map(name => {
                    return <option key={name} value={name}>{ name }</option>
                })
            }
            </select>
            <select
                style={{
                    ...props.comparisonSelectStyle,
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
            <input
                style={{
                    ...props.valueToCompareInputStyle,
                    width: 120
                }}
                type="text"
                placeholder="Other value"
                defaultValue={props.valueToCompare}
                className="nodrag"
                onChange={(event) =>
                    props.onValueToCompareChanged(event.target.value)
                }
            />
        </span>
    )
}