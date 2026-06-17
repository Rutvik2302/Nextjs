import dbconnect from "@/lib/dbconnect";
import UserModel from "@/model/user.model";
import z, { success } from "zod";
import { userNameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username: userNameValidation
})

export async function GET(req: Request) {
    await dbconnect()

    try {
        const { searchParams } = new URL(req.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        // validate with zode
        const result = UsernameQuerySchema.safeParse(queryParam)
        if (!result.success) {
            const usernameError = result.error.format().username?._errors || []
            return Response.json(
                {
                    success: false,
                    message: "Invalid Query Parameter"
                }, { status: 400 }
            )
        }
        const { username } = result.data;

        const exitistinguser = await UserModel.findOne({ userName:username, isverified: true })
        if (exitistinguser) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken"
                }, { status: 400 }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Username is avilabel"
            }, { status: 200 }
        )
    } catch (error) {
        console.log(error, "Error for check the username")
        return Response.json(
            {
                success: false,
                message: "Error in checking the username"
            },
            { status: 500 }
        )
    }
}