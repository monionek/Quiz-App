import generator from "generate-password-ts";

export const generatePassword = () => {
  return generator.generate({
    length: 10,
    numbers: true,
  });
};
