import React, {useEffect, useState} from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import useStore, {handleStyle, selectedColor} from "../../../store";
import {PointsType} from "../../../model/PointsType";
import {NodeTypes} from "../../../model/NodeTypes";
import {Comparisons} from "../../../model/Comparisons";
import ConditionOptions from "../../form/ConditionOptions";

export type GatewayNodeData = {
    backgroundColor?: string
    variableName?: string,
    comparison?: Comparisons,
    valueToCompare?: string
}

export default function GatewayNode({ id, selected, data }: NodeProps<GatewayNodeData>) {

    const nodes = useStore((state) => state.nodes)
    const edges = useStore((state) => state.edges)
    const getPreviousNodes = useStore((state) => state.getPreviousNodes)
    const updateNodeData = useStore((state) => state.updateNodeData);
    const [availableVariableNames, setAvailableVariableNames] = useState<string[]>([])
    const [selectedVariable, setSelectedVariable] = useState(data.variableName || PointsType.EXPERIENCE.valueOf());
    const [comparison, setComparison] = useState(data.comparison || Comparisons.EQUALS);
    const [valueToCompare, setValueToCompare] = useState(data.valueToCompare || "");

    useEffect(() => {
        // Get all available variable names from all previous nodes that are no decision nodes
        // also add the points type names
        setAvailableVariableNames(Array.from(new Set(
            getPreviousNodes(id)
                .filter((node) => node.type !== NodeTypes.GATEWAY_NODE)
                .map((node) => node.data.variableName)
                .filter(name => name !== undefined && name !== "")
                .concat(Object.values(PointsType).map(type => "PT:" + type))
        )))

    }, [id, nodes, edges, getPreviousNodes])

    /*
    variablesSelectStyle={{
                    position: 'fixed',
                    right: -140,
                    top: 5
                }}
                comparisonSelectStyle={{
                    position: 'fixed',
                    right: -191,
                    top: 5
                }}
                valueToCompareInputStyle={{
                    position: 'fixed',
                    right: -320,
                    top: 5
                }}
     */

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
            <ConditionOptions
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
            <Handle style={handleStyle} type="source" position={Position.Top} id="b"/>
            <Handle style={handleStyle} type="source" position={Position.Bottom} id="c"/>
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