import React, {useEffect, useState} from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import useStore, {handleStyle, selectedColor} from "../../../store";
import {PointsType} from "../../../model/PointsType";
import {NodeTypes} from "../../../model/NodeTypes";

enum Comparisons {
    EQUALS = "=",
    NOT_EQUALS = "!=",
    GREATER = ">",
    GREATER_OR_EQUALS = ">=",
    LOWER = "<",
    LOWER_OR_EQUALS = "<="
}

export type GatewayNodeData = {
    backgroundColor?: string
    variableName?: string,
    comparison?: string,
    valueToCompare?: string
}

export default function GatewayNode({ id, selected, data }: NodeProps<GatewayNodeData>) {

    const nodes = useStore((state) => state.nodes)
    const edges = useStore((state) => state.edges)
    const getPreviousNodes = useStore((state) => state.getPreviousNodes)
    const updateNodeData = useStore((state) => state.updateNodeData);
    const [availableVariableNames, setAvailableVariableNames] = useState<string[]>([])
    const [variableName, setVariableName] = useState(data.variableName || PointsType.EXPERIENCE.valueOf());
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

    useEffect(() => {
        updateNodeData<GatewayNodeData>(id, {
            backgroundColor: data.backgroundColor,
            variableName: variableName,
            comparison: comparison,
            valueToCompare: valueToCompare
        })
    }, [id, variableName, comparison, valueToCompare, updateNodeData])

    return (
        <div style={{ backgroundColor: "transparent", position: "relative" }}>
            <select
                style={{
                    width: 100,
                    position: 'fixed',
                    right: -120,
                    top: 5
                }}
                value={variableName}
                name="variableName"
                id="variableName"
                className="nodrag"
                onChange={(event) => {
                    setVariableName(event.target.value)
                }}
            >
                {
                    availableVariableNames.map(name => {
                        return <option key={name} value={name}>{ name }</option>
                    })
                }
            </select>
            <select
                style={{
                    width: 50,
                    position: 'fixed',
                    right: -180,
                    top: 5
                }}
                defaultValue={comparison}
                name="comparison"
                id="comparison"
                className="nodrag"
                onChange={(event) => {
                    setComparison(event.target.value)
                }}
            >
                {
                    Object.values(Comparisons).map(comparison => {
                        return <option key={comparison.valueOf()} value={comparison}>{ comparison.valueOf() }</option>
                    })
                }
            </select>
            <input
                style={{
                    width: 100,
                    position: 'fixed',
                    right: -300,
                    top: 5
                }}
                type="text"
                placeholder="Other value"
                defaultValue={valueToCompare}
                className="nodrag"
                onChange={(event) =>
                    setValueToCompare(event.target.value)
                }
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