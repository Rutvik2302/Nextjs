import {email, z} from "zod"

export const userNameValidation =z
    .string()
    .min(2,"UserName atlist 2 chareacters")
    .max(20,"UserName must be no more than 20 chareacters")
    .regex(/^[a-zA-Z0-9]+$/,"Username must not contain sppecial caracters")

export const SignupSchema = z.object({
    userName : userNameValidation,
    email: z.string().email({message:'invalid email address'}),
    password:z.string().min(6,{message:'Password Must atlist 6 characture'}).max(10)
})    