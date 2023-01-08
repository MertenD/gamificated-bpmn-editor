import React, {useEffect, useState} from 'react';
import {Handle, NodeProps, Position} from 'reactflow';
import useStore from "../../../store";
import {PointsType} from "../../../model/PointsType";

enum Comparisons {
    EQUALS = "=",
    NOT_EQUALS = "!=",
    GREATER = ">",
    GREATER_OR_EQUALS = ">=",
    LOWER = "<",
    LOWER_OR_EQUALS = "<="
}

export type DecisionNodeData = {
    variableName?: string,
    comparison?: string,
    valueToCompare?: string
}

export default function DecisionNode({ id, data }: NodeProps<DecisionNodeData>) {

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
                .filter((node) => node.type !== "decisionNode")
                .map((node) => node.data.variableName)
                .filter(name => name !== undefined && name !== "")
                .concat(Object.values(PointsType).map(type => "PT:" + type))
        )))

    }, [id, nodes, edges])

    useEffect(() => {
        updateNodeData<DecisionNodeData>(id, {
            variableName: variableName,
            comparison: comparison,
            valueToCompare: valueToCompare
        })
    }, [id, variableName, comparison, valueToCompare])

    return (
        <div style={{ backgroundColor: "transparent", position: "relative" }}>
            <select
                style={{
                    width: 100,
                    position: 'fixed',
                    right: -120,
                    top: 5
                }}
                defaultValue={variableName}
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
            <div style={{ ...decisionShapeStyle }} />
            <Handle type="target" position={Position.Left} id="a"/>
            <Handle type="source" position={Position.Top} id="b"/>
            <Handle type="source" position={Position.Bottom} id="c"/>
        </div>
    )
}

export const decisionShapeStyle = {
    width: 30,
    height: 30,
    transform: "rotateY(0deg) rotate(45deg)",
    borderRadius: 6,
    backgroundColor: "white",
    border: "3px solid black",
}