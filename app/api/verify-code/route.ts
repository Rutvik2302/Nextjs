import dbconnect from "@/lib/dbconnect";
import UserModel from "@/model/user.model";
import z, { success } from "zod";


export async function GET(req: Request) {
    await dbconnect();
    try {
        const { searchParams } = new URL(req.url)
        const queryParam: any = {
            verificationCode: searchParams.get('otp'),
            username: searchParams.get('username')
        }

        const decodedUsername = decodeURIComponent(queryParam?.username)

        const user = await UserModel.findOne({ userName: decodedUsername })

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                }, { status: 400 }
            )
        }

        const isValidcode = user.verifyCode === queryParam.verificationCode;
        const iscodeNotexpiare = new Date(user.verifycodeExpiry) > new Date()

        console.log(queryParam.verificationCode)
        if (isValidcode && iscodeNotexpiare) {
            console.log(user);
            console.log("Expiry:", user.verifycodeExpiry);
            console.log("Now:", new Date());
            user.isverified = true
            await user.save()
            return Response.json(
                {
                    success: true,
                    message: "User verified"
                }, { status: 200 }
            )
        } else if (!iscodeNotexpiare) {
            return Response.json(
                {
                    success: false,
                    message: "Verification code is expier"
                }, { status: 500 }
            )
        } else {
            return Response.json(
                {
                    success: false,
                    message: "Verification code incorrect"
                }, { status: 500 }
            )
        }

    } catch (error) {
        console.log(error, "Verifiction fail for otp")
        return Response.json(
            {
                success: false,
                message: "Otp varification fail"
            }, { status: 400 }
        )
    }
}