import * as React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {startNodeShapeStyle} from "../nodes/StartNode";
import {endNodeShapeStyle} from "../nodes/EndNode";
import {activityShapeStyle} from "../nodes/ActivityNode";
import {decisionShapeStyle} from "../nodes/DecisionNode";

export interface OnCanvasNodesToolbarProps {
    open: boolean;
    onClose: (value: string | null) => void;
}

export default function OnCanvasNodesToolbar(props: OnCanvasNodesToolbarProps) {
    const { onClose, open } = props;

    const handleClose = () => {
        onClose(null)
    }

    const handleNodeSelected = (nodeType: string) => {
        onClose(nodeType);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Select Node</DialogTitle>
            <div style={{
                paddingBottom: 16,
                background: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                End
                <div style={{ ...endNodeShapeStyle,  marginBottom: 10 }} onClick={() => {
                    handleNodeSelected("endNode")
                }}/>
                Activity
                <div style={{ ...activityShapeStyle, marginBottom: 10 }} onClick={() => {
                    handleNodeSelected("activityNode")
                }}/>
                Decision
                <div style={{ ...decisionShapeStyle, marginBottom: 10, marginTop: 5 }} onClick={() => {
                    handleNodeSelected("decisionNode")
                }}>
                </div>
            </div>
        </Dialog>
    );
}