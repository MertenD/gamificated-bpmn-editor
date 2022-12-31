import React from 'react';
import {colorChooserShapeStyle} from "./nodes/ColorChooserNode";
import {textInputShapeStyle} from "./nodes/TextInputNode";
import {startNodeShapeStyle} from "./nodes/StartNode";

export default function NodesToolBar() {
    const onDragStart = (event: any, nodeType: String, nodeData: any) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType, nodeData }));
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside>
            <div style={{
                borderRadius: 10,
                padding: 16,
                background: "white",
                border: "1px solid black",
                display: "flex",
                flexDirection: "column",
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                Start Node
                <div draggable style={{ ...startNodeShapeStyle,  marginBottom: 10 }} onDragStart={(event) =>
                    onDragStart(event, "start", {})
                } />
                Activity
                <div draggable style={{ ...textInputShapeStyle, marginBottom: 10 }} onDragStart={(event) =>
                    onDragStart(event, "textInput", {})
                } />
                Color Chooser
                <div draggable style={{ ...colorChooserShapeStyle, marginBottom: 10 }} onDragStart={(event) =>
                    onDragStart(event, "colorChooser", { color: "#ffffff"})
                } >
                </div>
            </div>
        </aside>
    );
};