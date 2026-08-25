import bcrypt from "bcryptjs";

/** Hashes a plain-text password before it is stored in the database. */
export const hashPassword = async (plain: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
};

/** Compares a plain-text password against a stored bcrypt hash. */
export const comparePassword = async (plain: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(plain, hash);
};
