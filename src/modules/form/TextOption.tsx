import React from "react"

export interface TextOptionProps {
    title: string,
    placeholder: string,
    value: string,
    onValueChanged: (newValue: string) => void
}

export default function TextOption(props: TextOptionProps) {

    return (
        <span style={{
            flexWrap: "wrap",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10
        }}>
            { props.title + ":" }
            <input
                style={{
                    marginLeft: 10
                }}
                type="text"
                placeholder={ props.placeholder }
                defaultValue={ props.value }
                className="nodrag"
                onChange={(event) => {
                    props.onValueChanged(event.target.value)
                }}
            />
        </span>
    )
}