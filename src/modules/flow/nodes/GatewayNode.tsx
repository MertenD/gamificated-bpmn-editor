import React, {useEffect, useState} from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import useStore, {handleStyle, selectedColor} from "../../../store";
import {PointsType} from "../../../model/PointsType";
import {Comparisons} from "../../../model/Comparisons";
import ConditionOption from "../../form/ConditionOption";

export type GatewayNodeData = {
    backgroundColor?: string
    variableName?: string,
    comparison?: Comparisons,
    valueToCompare?: string
}

export default function GatewayNode({ id, selected, data }: NodeProps<GatewayNodeData>) {

    const nodes = useStore((state) => state.nodes)
    const edges = useStore((state) => state.edges)
    const getAvailableVariableNames = useStore((state) => state.getAvailableVariableNames)
    const updateNodeData = useStore((state) => state.updateNodeData);
    const [availableVariableNames, setAvailableVariableNames] = useState<string[]>([])
    const [selectedVariable, setSelectedVariable] = useState(data.variableName || PointsType.EXPERIENCE.valueOf());
    const [comparison, setComparison] = useState(data.comparison || Comparisons.EQUALS);
    const [valueToCompare, setValueToCompare] = useState(data.valueToCompare || "");

    useEffect(() => {
        setAvailableVariableNames(getAvailableVariableNames(id))
    }, [id, nodes, edges])

    useEffect(() => {
        updateNodeData<GatewayNodeData>(id, {
            backgroundColor: data.backgroundColor,
            variableName: selectedVariable,
            comparison: comparison,
            valueToCompare: valueToCompare
        })
    }, [id, selectedVariable, comparison, valueToCompare, updateNodeData])

    return (
        <div style={{ backgroundColor: "transparent", position: "relative" }}>
            <ConditionOption
                variables={ availableVariableNames }
                selectedVariable={ selectedVariable }
                onVariableChanged={ newVariable => setSelectedVariable(newVariable) }
                selectedComparison={ comparison }
                onComparisonChanges={ newComparison => setComparison(newComparison) }
                valueToCompare={ valueToCompare }
                onValueToCompareChanged={ newValueToCompare => setValueToCompare(newValueToCompare) }
                conditionOptionsSpanStyle={{
                    position: 'fixed',
                    right: -60,
                    top: 5
                }}
            />
            <div
                style={{
                    width: 70,
                    position: 'fixed',
                    top: -30,
                    left: 20
                }}
            >
                { "True" }
            </div>
            <div
                style={{
                    width: 70,
                    position: 'fixed',
                    bottom: -30,
                    left: 25
                }}
            >
                { "False" }
            </div>
            <div style={{
                ...GatewayShapeStyle,
                backgroundColor: data.backgroundColor,
                borderColor: selected ? selectedColor : undefined
            }} >
                <hr style={{ backgroundColor: "black", border: "1px solid black", width: "70%", marginTop: 14 }}/>
                <hr style={{ backgroundColor: "black", border: "1px solid black", width: "70%", marginTop: -10, transform: "rotateY(0deg) rotate(90deg)" }}/>
            </div>
            <Handle style={handleStyle} type="target" position={Position.Left} id="a"/>
            <Handle style={handleStyle} type="source" position={Position.Top} id="True"/>
            <Handle style={handleStyle} type="source" position={Position.Bottom} id="False"/>
        </div>
    )
}

export const GatewayShapeStyle = {
    width: 30,
    height: 30,
    transform: "rotateY(0deg) rotate(45deg)",
    borderRadius: 6,
    backgroundColor: "white",
    border: "3px solid black",
}