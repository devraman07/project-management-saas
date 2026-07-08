import bcrypt from "bcrypt";


const SALT_ROUNDS = 10;

export const generateHashedpassword = async (password) => {
       
    const hashedpassword = await bcrypt.hash(password, SALT_ROUNDS);

    return hashedpassword;
}