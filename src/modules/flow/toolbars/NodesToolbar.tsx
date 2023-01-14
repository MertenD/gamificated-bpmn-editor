import React from 'react';
import {activityShapeStyle} from "../nodes/ActivityNode";
import {startNodeShapeStyle} from "../nodes/StartNode";
import {decisionShapeStyle} from "../nodes/DecisionNode";
import {endNodeShapeStyle} from "../nodes/EndNode";
import {NodeTypes} from "../../../model/NodeTypes";

export default function NodesToolbar() {
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
                Start
                <div draggable style={{ ...startNodeShapeStyle,  marginBottom: 10 }} onDragStart={(event) =>
                    onDragStart(event, NodeTypes.START_NODE, {})
                } />
                End
                <div draggable style={{ ...endNodeShapeStyle,  marginBottom: 10 }} onDragStart={(event) =>
                    onDragStart(event, NodeTypes.END_NODE, {})
                } />
                Activity
                <div draggable style={{ ...activityShapeStyle, marginBottom: 10 }} onDragStart={(event) =>
                    onDragStart(event, NodeTypes.ACTIVITY_NODE, {})
                } />
                Decision
                <div draggable style={{ ...decisionShapeStyle, marginBottom: 10, marginTop: 5 }} onDragStart={(event) =>
                    onDragStart(event, NodeTypes.DECISION_NODE, {})
                } >
                </div>
            </div>
        </aside>
    );
};