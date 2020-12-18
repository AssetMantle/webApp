import React from 'react';
import {Form} from "react-bootstrap";

const InputField = (props) => {
    return (
        <Form.Group className={props.className}>
            <Form.Label>{props.label}</Form.Label>
            <Form.Control
                type={props.type}
                placeholder={props.placeholder}
                name={props.name}
                value={props.value}
                required={props.required}
                disabled={props.disabled}
            />
        </Form.Group>
    );
};


export default InputField;
