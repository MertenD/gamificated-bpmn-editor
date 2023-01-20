import React from "react"

export interface NumberOptionProps {
    title: string,
    placeholder: string,
    value: number,
    onValueChanged: (newValue: number) => void
}

export default function NumberOption(props: NumberOptionProps) {

    return (
        <span style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10
        }}>
            { props.title + ":" }
            <input
                type="number"
                placeholder={ props.placeholder }
                defaultValue={ props.value }
                className="nodrag"
                onChange={(event) => {
                    props.onValueChanged(Number(event.target.value))
                }}
            />
        </span>
    )
}