import React, {memo, useState} from 'react';
import {NodeProps, ReactFlowProvider} from 'reactflow';
import {NodeResizer, ResizeDragEvent, ResizeEventParams} from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';

export type ChallengeNodeData = {
    backgroundColor?: string
}

export default memo(function ChallengeNode({ id, selected, data }: NodeProps<ChallengeNodeData>) {

    const minWidth = 400, minHeight = 400
    const [backgroundColor, setBackgroundColor] = useState(data.backgroundColor || "#eeffee")
    const [width, setWidth] = useState(minWidth)
    const [height, setHeight] = useState(minHeight)

    const onResize = (event: ResizeDragEvent, params: ResizeEventParams) => {
        setWidth(params.width)
        setHeight(params.height)
    }

    return (
        <>
            <NodeResizer
                isVisible={selected}
                minWidth={minWidth}
                minHeight={minHeight}
                onResize={onResize}
                lineStyle={{
                    borderWidth: 2
                }}
                handleStyle={{
                    width: 15,
                    height: 15
                }}
            />
            <div style={{ ...challengeShapeStyle, width: width, height: height, backgroundColor: backgroundColor + "99" }} >
                Challenge
            </div>
        </>
    )
})

export const challengeShapeStyle = {
    minWidth: 50,
    minHeight: 50,
    borderRadius: 6,
    backgroundColor: "rgba(200,255,200,0.25)",
    border: "3px solid black",
}