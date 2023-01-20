import React from "react"

export interface DropdownOptionProps {
    title: string
    values: string[]
    value: string
    onValueChanged: (newValue: string) => void
}

export default function DropdownOption(props: DropdownOptionProps) {

    return (
        <span style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10
        }}>
                { props.title + ":" }
            <select
                defaultValue={props.value}
                className="nodrag"
                onChange={(event) => {
                    props.onValueChanged(event.target.value)
                }}
            >
                    {
                        props.values.map(type => {
                            return <option key={type.valueOf()} value={type}>{ type.valueOf() }</option>
                        })
                    }
                </select>
            </span>
    )
}