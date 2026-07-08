import bcrypt from "bcrypt";

export const comparePassword = async (password, hashedPassword) => {

    try {
        const correctPass = await bcrypt.compare(password,hashedPassword );

        return correctPass;
    } catch (error) {
        return {
            success : false,
            message : error.message,
        }
    }
} 