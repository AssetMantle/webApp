import React from 'react';
import { Form } from "react-bootstrap";
const InputField = (props) => {
    return (
        <Form.Group controlId="formBasicEmail">
        <Form.Label>{props.label}</Form.Label>
        <Form.Control
          type="text"
          placeholder={props.placeholder}
          name={props.name}
          required={props.required}
        />
      </Form.Group>
    );
};


export default InputField;
