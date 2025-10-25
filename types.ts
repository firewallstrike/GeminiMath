export enum ProblemType {
  EXPRESSION = 'EXPRESSION',
  EQUATION = 'EQUATION',
}

export interface Problem {
  question: string;
  answer: number;
  type: ProblemType;
  parts: (number | string)[];
}

export type FeedbackStatus = 'correct' | 'incorrect' | null;

export enum HelpType {
  EXPLAIN = 'explain',
  HINT = 'hint',
  EXAMPLE = 'example',
}
