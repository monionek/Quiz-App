export interface User {
    name: string;
    password: string;
    email: string
}

export interface Quiz {
    title: string;
    description: string;
    answers: string[];
    correctAnswer: string;
    timeLimit: string //nie wiem jeszcze jak typ tu dać
    author: string;
}