import { genSaltSync, hashSync, compareSync } from "bcrypt-ts";

export const hashPassword = (plainPassword: string): string => {
  const salt = genSaltSync(10);
  return hashSync(plainPassword, salt);
};

export const verifyPassword = (
  plainPassword: string,
  hashedPassword: string,
): boolean => {
  return compareSync(plainPassword, hashedPassword);
};
