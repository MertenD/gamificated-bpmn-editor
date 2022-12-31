import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import useStore from '../../../store';

export type ColorChooserNodeData = {
    color: string;
};

export default function ColorChooserNode({ id, data }: NodeProps<ColorChooserNodeData>) {
    const updateNodeColor = useStore((state) => state.updateNodeColor);

    return (
        <div style={{ ...colorChooserShapeStyle, backgroundColor: data.color }}>
            <Handle type="target" position={Position.Top} />
            <div style={{ padding: 20 }}>
                <input
                    type="color"
                    value={data.color}
                    onChange={(evt) => updateNodeColor(id, evt.target.value)}
                    className="nodrag"
                />
            </div>
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}

export const colorChooserShapeStyle = {
    minWidth: 50,
    minHeight: 50,
    backgroundColor: "white",
    borderRadius: 10,
    border: "3px solid black"
}