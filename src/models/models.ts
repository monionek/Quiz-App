export interface UserInterface {
  username: string;
  password: string;
  email: string;
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Quiz {
  title: string;
  description: string;
  answers: string[];
  correctAnswer: string;
  timeLimit: string; //nie wiem jeszcze jak typ tu dać
  author: string;
}
