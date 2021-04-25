import React from "react";
import type { FC, ChangeEvent } from "react";
import styled from "styled-components";

const StyledInput = styled.div`
  width: 90%;
  height: 95vh;
  flex-grow: 1;
`;

const FullTextArea = styled.textarea`
  width: 95%;
  height: 100%;
  color: inherit;
  background-color: inherit;
`;

type InputProps = {
  code: string;
  onChange: (code: string) => void;
};
const Input: FC<InputProps> = ({ code, onChange }) => {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    onChange(event.target.value);
  };

  return (
    <StyledInput>
      <FullTextArea
        placeholder="Your JavaScript code here"
        value={code}
        onChange={handleChange}
        spellCheck="false"
      />
    </StyledInput>
  );
};

export default Input;
