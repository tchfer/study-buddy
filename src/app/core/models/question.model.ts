export type Question = {
  id: string;
  quizId: string;
  prompt: string;
  options: string[];
  correctIndex: number;
};
