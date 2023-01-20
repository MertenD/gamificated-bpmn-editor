import React, {memo, useEffect, useState} from 'react';
import {NodeProps} from 'reactflow';
import {NodeResizer, ResizeDragEvent, ResizeEventParams} from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';
import useStore, {selectedColor} from "../../../store";

export type ChallengeNodeData = {
    width?: number,
    height?: number,
    backgroundColor?: string
    isResizing?: boolean
}

export default memo(function ChallengeNode({ id, selected, data }: NodeProps<ChallengeNodeData>) {

    const minWidth = 50, minHeight = 50
    const defaultWidth = 400, defaultHeight = 400

    const getChildren = useStore((state) => state.getChildren)
    const updateNodeParent = useStore((state) => state.updateNodeParent)
    const updateNodeData = useStore((state) => state.updateNodeData)
    const getNodeById = useStore((state) => state.getNodeById)
    const [isResizing, setIsResizing] = useState(false)
    const [backgroundColor, setBackgroundColor] = useState(data.backgroundColor || "#eeffee")
    const [width, setWidth] = useState(data.width || defaultWidth)
    const [height, setHeight] = useState(data.height || defaultHeight)

    useEffect(() => {
        updateNodeData<ChallengeNodeData>(id, {
            width: width,
            height: height,
            backgroundColor: backgroundColor,
            isResizing: isResizing
        })
    }, [width, height, backgroundColor, isResizing])

    const onResizeStart = () => {
        setIsResizing(true)
        const childrenNodes = getChildren(id)
        childrenNodes.map((node) => {
            console.log("Make children parentless", node)
            updateNodeParent(node, undefined, getNodeById(id) || undefined)
        })
    }

    const onResize = (event: ResizeDragEvent, params: ResizeEventParams) => {
        setWidth(params.width)
        setHeight(params.height)
    }

    const onResizeEnd = () => {
        setIsResizing(false)
    }

    return (
        <>
            <NodeResizer
                nodeId={id}
                isVisible={selected}
                minWidth={minWidth}
                minHeight={minHeight}
                onResizeStart={onResizeStart}
                onResize={onResize}
                onResizeEnd={onResizeEnd}
                lineStyle={{
                    borderColor: selectedColor,
                    borderWidth: 2
                }}
                handleStyle={{
                    backgroundColor: selectedColor,
                    borderColor: selectedColor,
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