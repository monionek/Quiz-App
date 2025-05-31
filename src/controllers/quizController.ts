import { Request, Response } from "express";

export const createQuiz = async (req: Request, res: Response) => {
  // tworzenie quizu - minimalnie tytuł i opis
  res.status(201).json({ message: "Quiz created" });
};

export const getQuiz = async (req: Request, res: Response) => {
  // pobierz quiz i pytania
  res.status(200).json({ quiz: "example data" });
};

export const submitQuiz = async (req: Request, res: Response) => {
  // przyjmij odpowiedzi i oblicz wynik
  res.status(200).json({ score: 3 });
};
