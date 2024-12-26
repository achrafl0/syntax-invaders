import { type CodeProblem } from "./types";

export const PROBLEMS: CodeProblem[] = [
  {
    question: "Calculate array average",
    availableVars: { array1: "number[]" },
    testCases: [
      { input: { array1: [1, 2, 3] }, expected: 2 },
      { input: { array1: [10, 20] }, expected: 15 },
    ],
    difficulty: 1,
  },
  {
    question: "Find maximum value",
    availableVars: { numbers: "number[]" },
    testCases: [
      { input: { numbers: [1, 5, 3, 9, 2] }, expected: 9 },
      { input: { numbers: [-1, -5, -2] }, expected: -1 },
    ],
    difficulty: 1,
  },
  {
    question: "Count even numbers",
    availableVars: { nums: "number[]" },
    testCases: [
      { input: { nums: [1, 2, 3, 4, 5, 6] }, expected: 3 },
      { input: { nums: [1, 3, 5] }, expected: 0 },
    ],
    difficulty: 1,
  },
  {
    question: "Filter positive numbers",
    availableVars: { numbers: "number[]" },
    testCases: [
      { input: { numbers: [-1, 2, -3, 4, -5, 6] }, expected: [2, 4, 6] },
      { input: { numbers: [-2, -4, -6] }, expected: [] },
    ],
    difficulty: 2,
  },
  // Easy Problems
  {
    question: "Return the last element of an array",
    availableVars: {
      arr: "any[]",
    },
    testCases: [
      {
        input: { arr: [1, 2, 3, 4] },
        expected: 4,
      },
      {
        input: { arr: ["a", "b", "c"] },
        expected: "c",
      },
    ],
    difficulty: 1,
  },
  {
    question: "Check if a string contains only digits",
    availableVars: {
      str: "string",
    },
    testCases: [
      {
        input: { str: "12345" },
        expected: true,
      },
      {
        input: { str: "123a5" },
        expected: false,
      },
    ],
    difficulty: 1,
  },
  {
    question: "Find the smallest number in an array",
    availableVars: {
      nums: "number[]",
    },
    testCases: [
      {
        input: { nums: [5, 1, 8, -3] },
        expected: -3,
      },
      {
        input: { nums: [2, 3, 0] },
        expected: 0,
      },
    ],
    difficulty: 1,
  },
  {
    question: "Repeat a string n times",
    availableVars: {
      str: "string",
      times: "number",
    },
    testCases: [
      {
        input: { str: "ha", times: 3 },
        expected: "hahaha",
      },
      {
        input: { str: "wow", times: 2 },
        expected: "wowwow",
      },
    ],
    difficulty: 1,
  },

  // Medium Problems
  {
    question: "Count the number of words in a string",
    availableVars: {
      sentence: "string",
    },
    testCases: [
      {
        input: { sentence: "Hello world" },
        expected: 2,
      },
      {
        input: { sentence: "This is a test string" },
        expected: 5,
      },
    ],
    difficulty: 2,
  },
  {
    question: "Remove all falsy values from an array",
    availableVars: {
      arr: "any[]",
    },
    testCases: [
      {
        input: { arr: [0, 1, false, 2, "", 3] },
        expected: [1, 2, 3],
      },
      {
        input: { arr: [null, undefined, "hello", NaN] },
        expected: ["hello"],
      },
    ],
    difficulty: 2,
  },
  {
    question: "Check if all elements in an array are unique",
    availableVars: {
      arr: "any[]",
    },
    testCases: [
      {
        input: { arr: [1, 2, 3, 4] },
        expected: true,
      },
      {
        input: { arr: [1, 2, 3, 1] },
        expected: false,
      },
    ],
    difficulty: 2,
  },
  {
    question: "Reverse the words in a string",
    availableVars: {
      sentence: "string",
    },
    testCases: [
      {
        input: { sentence: "Hello world" },
        expected: "world Hello",
      },
      {
        input: { sentence: "JavaScript is fun" },
        expected: "fun is JavaScript",
      },
    ],
    difficulty: 2,
  },

  // Hard Problems
  {
    question: "Find all numbers divisible by a given number",
    availableVars: {
      arr: "number[]",
      divisor: "number",
    },
    testCases: [
      {
        input: { arr: [1, 2, 3, 4, 5, 6], divisor: 2 },
        expected: [2, 4, 6],
      },
      {
        input: { arr: [10, 15, 20, 25], divisor: 5 },
        expected: [10, 15, 20, 25],
      },
    ],
    difficulty: 3,
  },
  {
    question: "Find the index of the first vowel in a string",
    availableVars: {
      str: "string",
    },
    testCases: [
      {
        input: { str: "javascript" },
        expected: 1,
      },
      {
        input: { str: "rhythm" },
        expected: -1,
      },
    ],
    difficulty: 3,
  },
  {
    question: "Get the first n Fibonacci numbers",
    availableVars: {
      n: "number",
    },
    testCases: [
      {
        input: { n: 5 },
        expected: [0, 1, 1, 2, 3],
      },
      {
        input: { n: 7 },
        expected: [0, 1, 1, 2, 3, 5, 8],
      },
    ],
    difficulty: 3,
  },
  {
    question: "Check if a number is a perfect square",
    availableVars: {
      num: "number",
    },
    testCases: [
      {
        input: { num: 16 },
        expected: true,
      },
      {
        input: { num: 20 },
        expected: false,
      },
    ],
    difficulty: 3,
  },
  {
    question: "Calculate array sum",
    availableVars: {
      array1: "number[]",
    },
    testCases: [
      {
        input: { array1: [1, 2, 3] },
        expected: 6,
      },
      {
        input: { array1: [10, -5, 0] },
        expected: 5,
      },
    ],
    difficulty: 1,
  },
  {
    question: "Check if a number is odd",
    availableVars: {
      num: "number",
    },
    testCases: [
      {
        input: { num: 5 },
        expected: true,
      },
      {
        input: { num: 8 },
        expected: false,
      },
    ],
    difficulty: 1,
  },
  {
    question: "Convert string to uppercase",
    availableVars: {
      str: "string",
    },
    testCases: [
      {
        input: { str: "hello" },
        expected: "HELLO",
      },
      {
        input: { str: "world" },
        expected: "WORLD",
      },
    ],
    difficulty: 1,
  },
  {
    question: "Get first character of a string",
    availableVars: {
      str: "string",
    },
    testCases: [
      {
        input: { str: "hello" },
        expected: "h",
      },
      {
        input: { str: "world" },
        expected: "w",
      },
    ],
    difficulty: 1,
  },

  // Medium Problems (Require light logical reasoning)
  {
    question: "Find the second largest number in an array",
    availableVars: {
      numbers: "number[]",
    },
    testCases: [
      {
        input: { numbers: [1, 2, 3, 4, 5] },
        expected: 4,
      },
      {
        input: { numbers: [10, 5, 8] },
        expected: 8,
      },
    ],
    difficulty: 2,
  },
  {
    question: "Remove duplicates from an array",
    availableVars: {
      nums: "number[]",
    },
    testCases: [
      {
        input: { nums: [1, 2, 2, 3, 4, 4] },
        expected: [1, 2, 3, 4],
      },
      {
        input: { nums: [5, 5, 5] },
        expected: [5],
      },
    ],
    difficulty: 2,
  },
  {
    question: "Check if a string is a palindrome",
    availableVars: {
      str: "string",
    },
    testCases: [
      {
        input: { str: "racecar" },
        expected: true,
      },
      {
        input: { str: "hello" },
        expected: false,
      },
    ],
    difficulty: 2,
  },
  {
    question: "Find the number of vowels in a string",
    availableVars: {
      str: "string",
    },
    testCases: [
      {
        input: { str: "hello world" },
        expected: 3,
      },
      {
        input: { str: "javascript" },
        expected: 3,
      },
    ],
    difficulty: 2,
  },

  // Hard Problems (Require slight combinations of operations)
  {
    question: "Flatten a nested array (1 level deep)",
    availableVars: {
      nestedArray: "Array<number | number[]>",
    },
    testCases: [
      {
        input: { nestedArray: [1, [2, 3], 4] },
        expected: [1, 2, 3, 4],
      },
      {
        input: { nestedArray: [[1, 2], [3, 4], 5] },
        expected: [1, 2, 3, 4, 5],
      },
    ],
    difficulty: 3,
  },
  {
    question: "Find the longest word in a string",
    availableVars: {
      str: "string",
    },
    testCases: [
      {
        input: { str: "The quick brown fox" },
        expected: "quick",
      },
      {
        input: { str: "A journey of a thousand miles" },
        expected: "thousand",
      },
    ],
    difficulty: 3,
  },
  {
    question: "Calculate array average",
    availableVars: {
      array1: "number[]",
    },
    testCases: [
      {
        input: { array1: [1, 2, 3] },
        expected: 2,
      },
      {
        input: { array1: [10, 20] },
        expected: 15,
      },
    ],
    difficulty: 1,
  },
  {
    question: "Find maximum value",
    availableVars: {
      numbers: "number[]",
    },
    testCases: [
      {
        input: { numbers: [1, 5, 3, 9, 2] },
        expected: 9,
      },
      {
        input: { numbers: [-1, -5, -2] },
        expected: -1,
      },
    ],
    difficulty: 1,
  },
  {
    question: "Count even numbers",
    availableVars: {
      nums: "number[]",
    },
    testCases: [
      {
        input: { nums: [1, 2, 3, 4, 5, 6] },
        expected: 3,
      },
      {
        input: { nums: [1, 3, 5] },
        expected: 0,
      },
    ],
    difficulty: 1,
  },
  {
    question: "Concatenate strings",
    availableVars: {
      str1: "string",
      str2: "string",
    },
    testCases: [
      {
        input: { str1: "Hello", str2: "World" },
        expected: "HelloWorld",
      },
      {
        input: { str1: "Code", str2: "Problem" },
        expected: "CodeProblem",
      },
    ],
    difficulty: 1,
  },
  {
    question: "Filter positive numbers",
    availableVars: {
      numbers: "number[]",
    },
    testCases: [
      {
        input: { numbers: [-1, 2, -3, 4, -5, 6] },
        expected: [2, 4, 6],
      },
      {
        input: { numbers: [-2, -4, -6] },
        expected: [],
      },
    ],
    difficulty: 2,
  },
];

interface ProblemStats {
  timesSelected: number;
  timesSucceeded: number;
  timesFailed: number;
}

export class ProblemGenerator {
  private problemStats: Map<number, ProblemStats> = new Map();
  private difficultyBoosts: Map<number, number> = new Map();
  private readonly scoreThreshold = 10;
  private readonly maxDifficulty = Math.max(
    ...PROBLEMS.map((p) => p.difficulty)
  );
  private averageDifficulty: number = 1;
  private readonly difficultyHistory: number[] = [];
  private readonly historySize = 10; // Keep track of last 10 problems

  constructor() {
    // Initialize stats for each problem
    PROBLEMS.forEach((_, index) => {
      this.problemStats.set(index, {
        timesSelected: 0,
        timesSucceeded: 0,
        timesFailed: 0,
      });
    });

    // Initialize difficulty boosts
    for (let diff = 1; diff <= this.maxDifficulty; diff++) {
      this.difficultyBoosts.set(diff, 1);
    }
  }

  getAverageDifficulty(): number {
    return this.averageDifficulty;
  }

  getBaseSpeed(difficulty: number): number {
    // Base speed increases with both problem difficulty and average difficulty
    const baseSpeed = 5;
    const difficultyMultiplier = 0.8 + (this.averageDifficulty - 1) * 0.6;
    return baseSpeed + difficulty * 2 * difficultyMultiplier;
  }

  generateProblem(score: number): CodeProblem {
    const problem = this._generateProblem(score);

    // Update difficulty history and average
    this.difficultyHistory.push(problem.difficulty);
    if (this.difficultyHistory.length > this.historySize) {
      this.difficultyHistory.shift();
    }

    this.averageDifficulty =
      this.difficultyHistory.reduce((sum, d) => sum + d, 0) /
      this.difficultyHistory.length;

    return problem;
  }

  private _generateProblem(score: number): CodeProblem {
    // Calculate base probabilities for each problem
    const probabilities = PROBLEMS.map((problem, index) => {
      const stats = this.problemStats.get(index)!;
      const difficultyBoost =
        this.difficultyBoosts.get(problem.difficulty) || 1;

      // Base probability decreases more aggressively with recent selections
      let probability = 1 / Math.pow(1 + stats.timesSelected, 2);

      // Apply difficulty boost
      probability *= difficultyBoost;

      // Boost higher difficulties based on score
      if (score >= this.scoreThreshold * (problem.difficulty - 1)) {
        probability *= 1 + (problem.difficulty - 1) * 0.5;
      }

      // Reduce probability if the problem was recently failed
      if (stats.timesFailed > 0) {
        probability *= Math.pow(0.8, stats.timesFailed);
      }

      // Increase probability for problems that haven't been seen in a while
      const unseenBonus = Math.min(
        5,
        Math.floor(this.difficultyHistory.length / 2)
      );
      if (stats.timesSelected === 0) {
        probability *= 1 + unseenBonus * 0.5;
      }

      return { index, probability };
    });

    // Normalize probabilities
    const totalProbability = probabilities.reduce(
      (sum, p) => sum + p.probability,
      0
    );
    probabilities.forEach((p) => (p.probability /= totalProbability));

    // Select a problem using roulette wheel selection
    const random = Math.random();
    let cumulativeProbability = 0;

    for (const { index, probability } of probabilities) {
      cumulativeProbability += probability;
      if (random <= cumulativeProbability) {
        // Update stats
        const stats = this.problemStats.get(index)!;
        stats.timesSelected++;
        return PROBLEMS[index];
      }
    }

    // Fallback (should never happen due to normalized probabilities)
    return PROBLEMS[0];
  }

  handleProblemSolved(problem: CodeProblem): void {
    // Boost next difficulty
    if (problem.difficulty < this.maxDifficulty) {
      const currentBoost =
        this.difficultyBoosts.get(problem.difficulty + 1) || 1;
      this.difficultyBoosts.set(problem.difficulty + 1, currentBoost * 1.2);
    }

    // Update problem stats and reset failures
    const index = PROBLEMS.indexOf(problem);
    if (index !== -1) {
      const stats = this.problemStats.get(index)!;
      stats.timesSucceeded++;
      stats.timesFailed = 0; // Reset failures on success
    }
  }

  handleProblemFailed(problem: CodeProblem): void {
    // Reduce boost for higher difficulties
    for (
      let diff = problem.difficulty + 1;
      diff <= this.maxDifficulty;
      diff++
    ) {
      const currentBoost = this.difficultyBoosts.get(diff) || 1;
      this.difficultyBoosts.set(diff, Math.max(1, currentBoost * 0.7));
    }

    // Update problem stats
    const index = PROBLEMS.indexOf(problem);
    if (index !== -1) {
      const stats = this.problemStats.get(index)!;
      stats.timesFailed++;
    }
  }
}
