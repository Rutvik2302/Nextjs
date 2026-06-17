import { resend } from "@/lib/resend";
import VerificationEmail from "@/emails/VerificationEmail";
import { ApiResponse } from "@/types/apiResponse";


export async function SendVerificationEmail(email: string, username: string, verifycode: string): Promise<ApiResponse> {
    try {
        const send = await resend.emails.send({
            from : 'onboarding@resend.dev',
            to:email,
            subject:'Varification Code Myapp',
            react:VerificationEmail({username , otp:verifycode}),
        });
        // console.log(send)
        // console.log(email , verifycode , username)
        return { success: true, message: "send vrification email to register mail" }
    } catch (error) {
        console.log(error, "Sending the email id faild")
        return { success: false, message: "Failld to send vrification email" }
    }
}