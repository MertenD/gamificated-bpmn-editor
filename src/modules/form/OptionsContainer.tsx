import React from "react"

export interface OptionsContainerProps {
    width?: number
    children: React.ReactNode
}

export default function OptionsContainer(props: OptionsContainerProps) {

    return (
        <div style={{
            width: props.width || 300,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: "wrap"
        }}>
            { props.children }
        </div>
    )
}