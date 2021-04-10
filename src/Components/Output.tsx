import React from "react";
import type { FC } from "react";
import styled from "styled-components";

const StyledOutput = styled.div`
  width: 90%;
  height: 90%;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledPre = styled.pre`
  width: 100%;
  height: 100%;
`;

type OutputProps = {
  code: string;
  ast: any;
};
const Output: FC<OutputProps> = ({ code, ast }: OutputProps) => {
  return (
    <StyledOutput>
      <StyledPre>
        <code>{code.trim()}</code>
        <hr />
        <code>{JSON.stringify(ast, null, 2)}</code>
      </StyledPre>
    </StyledOutput>
  );
};

export default Output;
