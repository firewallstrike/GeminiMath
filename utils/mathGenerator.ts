import { Problem, ProblemType } from '../types';

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateExpressionProblem = (): Problem => {
  const num1 = getRandomInt(1, 10);
  const num2 = getRandomInt(1, 10);
  const num3 = getRandomInt(2, 5);
  
  let question = '';
  let answer = 0;
  
  const format = getRandomInt(1, 4);

  switch (format) {
    case 1: // a + b * c
      question = `${num1} + ${num2} * ${num3}`;
      answer = num1 + num2 * num3;
      break;
    case 2: // a * b - c
      question = `${num1} * ${num2} - ${num3}`;
      answer = num1 * num2 - num3;
      break;
    case 3: // (a - b) * c
      const term1 = Math.max(num1, num2) + 5; // ensure positive result
      const term2 = Math.min(num1, num2);
      question = `(${term1} - ${term2}) * ${num3}`;
      answer = (term1 - term2) * num3;
      break;
    case 4: // a * (b + c)
    default:
      question = `${num1} * (${num2} + ${num3})`;
      answer = num1 * (num2 + num3);
      break;
  }
  
  return {
    question: `${question} = ?`,
    answer,
    type: ProblemType.EXPRESSION,
    parts: [question],
  };
};

const generateEquationProblem = (): Problem => {
  let x = getRandomInt(-10, 10);
  // Ensure x is not 0 to avoid trivial equations
  if (x === 0) x = getRandomInt(1, 5) * (Math.random() > 0.5 ? 1 : -1);
  
  const a = getRandomInt(2, 10);
  const b = getRandomInt(-20, 20);
  
  const c = a * x + b;
  
  const bSign = b >= 0 ? '+' : '-';
  const bValue = Math.abs(b);
  
  const question = `${a}x ${bSign} ${bValue} = ${c}`;
  
  return {
    question,
    answer: x,
    type: ProblemType.EQUATION,
    parts: [a, b, c],
  };
};


export const generateProblem = (): Problem => {
  return generateEquationProblem();
};
