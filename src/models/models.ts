export interface QuizInterface {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number;
  isPrivate: boolean;
  tags: string[];
}
