import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

import { z } from "zod";

export async function GET(request: Request) {

}


export async function POST(request: Request) {
    await dbConnect();

    try {

        const { username, code } = await request.json()

        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({ username: decodedUsername })

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 500 }
            )
        }

        const isValidCode = user.verifyCode === code

        const isExpiredNotCode = new Date(user.verifyCodeExpiry) > new Date()

        if (isValidCode && isExpiredNotCode) {
            user.isVerified = true
            await user.save()
        } else if (!isExpiredNotCode) {
            return Response.json(
                {
                    success: false,
                    message: "Verification code has expired, please signup again to get a new code"
                },
                { status: 400 }
            )
        } else {
            return Response.json(
                {
                    success: false,
                    message: "Incorrect verification code"
                },
                { status: 400 }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Account verified successfully"
            },
            { status: 200 }
        )

    } catch (error) {
        console.log("Error verifying user", error);
        return Response.json(
            {
                success: false,
                message: "Error verifying user"
            },
            { status: 500 }
        )
    }
}