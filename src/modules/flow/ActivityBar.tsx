import React from 'react';
import {ColorChooserNodeData} from "./nodes/ColorChooserNode";
import {TextInputNodeData} from "./nodes/TextInputNode";

export default function ActivityBar() {
    const onDragStart = (event: any, nodeType: String, nodeData: any) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType, nodeData }));
        event.dataTransfer.effectAllowed = 'move';
    };

    function createNodeDraggable<DataType>(
        name: string,
        backgroundColor: string,
        nodeType: string,
        nodeData: DataType
    ) {
        return (
            <div key={name+nodeType} draggable style={{ background: backgroundColor }} onDragStart={(event) =>
                onDragStart(event, nodeType, nodeData)
            }>
                { name }
            </div>
        );
    }

    const nodeDraggables = [
        createNodeDraggable<ColorChooserNodeData>(
            "Color Chooser Node",
            "#4FD1C5",
            "colorChooser",
            {
                color: "#4FD1C5"
            }
        ),
        createNodeDraggable<TextInputNodeData>(
            "Text Input Node",
            "orange",
            "textInput",
            {
                color: "orange"
            }
        ),
        createNodeDraggable<TextInputNodeData>(
            "Input Node",
            "purple",
            "textInput",
            {
                color: "purple"
            }
        )
    ];

    return (
        <aside>
            <div style={{ borderRadius: 10, padding: 16, background: "white", border: "1px solid black" }}>
                {
                    nodeDraggables.map((nodeDraggable) => {
                        return nodeDraggable
                    })
                }
            </div>
        </aside>
    );
};