import dbconnect from "@/lib/dbconnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import { SendVerificationEmail } from "@/helper/sendVerificationemail";

export async function POST(req: Request) {
    await dbconnect()
    try {
        const { username, email, password } = await req.json()

        const existingUserVerifyedByUsername = await UserModel.findOne({
            username,
            isverified: true
        })

        if (existingUserVerifyedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken"
                },
                {
                    status: 400
                }
            )
        }

        const existinguserByEmail = await UserModel.findOne({ email })
        const verifyCode = Math.floor(1000 + Math.random() * 9000).toString()

        if (existinguserByEmail) {
            if (existinguserByEmail.verifyCode) {
                return Response.json(
                    {
                        success: false,
                        message: "Username is already Exits with this email"
                    },
                    {
                        status: 400
                    }
                )
            } else {
                const hasedPassword = await bcrypt.hash(password, 10)
                existinguserByEmail.password = hasedPassword;
                existinguserByEmail.verifyCode = verifyCode;
                existinguserByEmail.verifycodeExpiry = new Date(Date.now() + 3600000);
                await existinguserByEmail.save()
            }
        } else {
            const hasedPassword = await bcrypt.hash(password, 10)
            const expirydate = new Date()
            expirydate.setHours(expirydate.getHours() + 1)

            const newUser = new UserModel({
                userName: username,
                email,
                password: hasedPassword,
                verifyCode: verifyCode,
                verifycodeExpiry: expirydate,
                isverified: false,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save()
            // Send Verification Email

        }
        const emailResponse = await SendVerificationEmail(email, username, verifyCode)
        if (!emailResponse) {
            return Response.json(
                {
                    success: false,
                    message: "Email is Sending Fail"
                },
                {
                    status: 500
                }
            )
        }

        return Response.json({
            success: false,
            message: "User Register Sucess"
        },
            {
                status: 500
            })

    } catch (error) {
        console.error(error, "Register user Fail")
        return Response.json(
            {
                success: false,
                message: "Error Register User",
            },
            {
                status: 500
            }
        )
    }
}