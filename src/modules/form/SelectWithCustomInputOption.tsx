import React, {useEffect, useState} from 'react';

export interface SelectWithCustomInputOptionProps {
    values: string[],
    selectedValue: string,
    onValueChanged: (newValue: string) => void
}

export default function SelectWithCustomInputOption(props: SelectWithCustomInputOptionProps) {

    const [customInput, setCustomInput] = useState(false);
    const [selectValue, setSelectValue] = useState(props.selectedValue)

    useEffect(() => {
        const isCustom = !props.values.includes(props.selectedValue.replaceAll("{", "").replaceAll("}", ""))
        if (isCustom) {
            setCustomInput(true)
            setSelectValue("customInput")
        } else {
            setCustomInput(false)
            setSelectValue(props.selectedValue)
        }
    }, [props.values])

    const handleSelectChange = (event: any) => {
        if (event.target.value === 'customInput') {
            props.onValueChanged("")
            setCustomInput(true);
        } else {
            setCustomInput(false)
            props.onValueChanged(event.target.value);
        }
    };

    const handleCustomInputChange = (event: any) => {
        props.onValueChanged(event.target.value)
    }

    return (
        <div style={{
            width: 120
        }}>
            <select
                style={{
                    width: 120
                }}
                value={selectValue}
                name="value"
                className="nodrag"
                onChange={handleSelectChange}
            >
                {props.values.map((value) => {
                    return <option key={value} value={"{" + value + "}"}>
                        {value}
                    </option>
                })}
                <option value="customInput">[custom value]</option>
            </select>
            {customInput && (
                <input
                    style={{
                        width: 110
                    }}
                    name="value"
                    type="text"
                    className="nodrag"
                    placeholder="Value"
                    value={props.selectedValue}
                    onChange={event => handleCustomInputChange(event)}
                />
            )}
        </div>
    );
}