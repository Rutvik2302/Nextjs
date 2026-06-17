import dbconnect from "@/lib/dbconnect";
import UserModel from "@/model/user.model";
import { Message } from "@/model/user.model";
import { success } from "zod";

export async function POST(req: Request) {
    await dbconnect();

    const { username, content } = await req.json()
    try {
        const user = await UserModel.findOne({ username })

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                }, { status: 404 }
            )
        }

        // is user accepting the message

        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: "User not accept messages"
                }, { status: 403 }
            )
        }

        const newMessage = { content, createdAt: new Date() }

        user.messages.push(newMessage as Message)
        await user.save()
        return Response.json(
            {
                success: true,
                message: "Message sent successfully"
            }, { status: 200 }
        )
    } catch (error) {
        console.log(error)
        return Response.json(
            {
                success: false,
                message: "Error sending message"
            }, { status: 500 }
        )
    }
}