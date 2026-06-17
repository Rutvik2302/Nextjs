import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbconnect from "@/lib/dbconnect";
import UserModel from "@/model/user.model";
import { User } from "next-auth";

export async function POST(req: Request) {
    await dbconnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || session.user || !user) {
        return Response.json({
            success: false,
            message: "Please Login first"
        }, { status: 401 })
    }
    const userId = user._id;
    const { acceptMessages } = await req.json()
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            { userId },
            { isAcceptingMessage: acceptMessages },
            { new: true })
        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Faild to update user for accept message"
                }, { status: 401 }
            )
        }

        return Response.json(
            {
                success: true,
                message: "update user acceptmessage sucess",
                updatedUser
            }, { status: 200 }
        )
    } catch (error) {
        console.log(error)
        return Response.json(
            {
                success: false,
                message: "Faild to update user"
            }, { status: 401 }
        )
    }
}

export async function GET(req: Request) {
    await dbconnect();
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || session.user || !user) {
        return Response.json({
            success: false,
            message: "Please Login first"
        }, { status: 401 })
    }
    const userId = user._id;

    try {
        const Founduser = await UserModel.findById({ userId })

        if (!Founduser) {
            return Response.json(
                {
                    success: false,
                    message: "Faild to get user"
                }, { status: 404 }
            )
        }

        return Response.json(
            {
                success: true,
                isAcceptingMessages: Founduser.isAcceptingMessage
            }, { status: 200 }
        )
    } catch (error) {
        console.log(error)
        return Response.json(
            {
                success: false,
                message: "Faild to get user accepting messages"
            }, { status: 404 }
        )
    }
}