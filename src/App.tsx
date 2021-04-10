import React, { useEffect, useState } from "react";
import Output from "./Components/Output";
import Input from "./Components/Input";

import styled from "styled-components";

import { parse, initialCode } from "./logic/parsing";

const PageLayout = styled.main`
  display: flex;
  /* justify-content: center;
  align-items: center; */
`;

function App() {
  const [code, setCode] = useState<string>(initialCode);
  const [ast, setAst] = useState<any>("");

  useEffect(() => {
    try {
      const ast = parse(code);
      setAst(ast);
    } catch (error) {
      // console.log(error);
    }
  }, [code]);

  return (
    <PageLayout>
      <Input code={code} onChange={setCode} />
      <Output code={code} ast={ast} />
    </PageLayout>
  );
}

export default App;
