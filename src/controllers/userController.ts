import { Request, Response } from 'express';

export const registerUser = async (req: Request, res: Response) => {
  try {
    //walidacja przechodzi to
    const { name, password, email,} = req.body;
    //tutaj dać logike sprawdzania czy name albo email zajęty albo w bazie danhych już to zrobić
    //dodać logike łączenia do bazy danych i wsadzanie usera jak wszystko git
    const newUser = {
      name: name,
      password: password,
      email: email
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'Server error' }); //dobrać odpowiedni kod to tego
    return;
  }
  res.status(201).json({ message: 'User Registered' });
}; 

export const getUser = async (req: Request, res: Response) => {
  try {
    const selector = req.params.selector;
    //łącznie do bazy danych i pobieranie usera 
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error' });
    return;
  }
  res.status(200).json({ quiz: 'foundUser' });
};

export const LoginInUser = async (req: Request, res: Response) => {
  try {
    const { name, password } = req.body; //może potem dodać żeby jak login mogło dawać się jeszcze email
    //łączenie z bazą danych
    //szukanie user o podanym username lub emial i sprawdzanie czy wpisał prawidłowe hasło
    //zwracać error na poszczególnych etepach jak nie zostaną spełnione
    //1.znajdz usera po username/email 2.zweryfikuj hasło
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
    return;
  }
  res.status(200).json({ message: "Logged In sucesfull" });
};
