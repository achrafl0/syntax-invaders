export interface TestCase {
  input: { [key: string]: any };
  expected: any;
}

export interface CodeProblem {
  question: string;
  availableVars: { [key: string]: string }; // Variable name to type mapping
  testCases: TestCase[];
  difficulty: number;
}
