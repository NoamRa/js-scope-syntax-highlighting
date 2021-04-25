import React, { useEffect, useState } from "react";
import Output from "./components/Output";
import Input from "./components/Input";

import styled from "styled-components";

import { analyzeCode } from "./logic/main";

// code taken from Kyle Simposn's You don't know JS
// https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/ch2.md
const initialCode = `
var students = [
  { id: 14, name: "Kyle" },
  { id: 73, name: "Suzy" },
  { id: 112, name: "Frank" },
  { id: 6, name: "Sarah" }
];

function getStudentName(studentID) {
  for (let student of students) {
      if (student.id == studentID) {
          return student.name;
      }
  }
}

var nextStudent = getStudentName(73);
console.log(nextStudent);
`.trim();

const PageLayout = styled.main`
  padding: 1rem;
  display: flex;
  color: #d6d6d6;
  background-color: #2e2e2e;
`;

function App() {
  const [code, setCode] = useState<string>(initialCode);
  const [decoratedCode, setDecoratedCode] = useState<string>(initialCode);
  const [ast, setAst] = useState<any>("");

  useEffect(() => {
    try {
      const { ast, decoratedCode } = analyzeCode(code);
      setAst(ast);
      setDecoratedCode(decoratedCode);
    } catch (error) {
      console.log(error);
    }
  }, [code]);

  return (
    <PageLayout>
      <Input code={code} onChange={setCode} />
      <Output code={decoratedCode} ast={ast} />
    </PageLayout>
  );
}

export default App;
