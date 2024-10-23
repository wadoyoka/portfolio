import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Suspense } from "react"
import LoginFormContent from "./loginFormContent"

export default function LoginForm() {

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md bg-white max-md:mx-4">
                <CardHeader>
                    <CardTitle>
                        <div className="flex justify-center items-center">
                            <div className="w-10 h-10 relative pr-4">
                                <Image
                                    src="/logo.png"
                                    alt="logo"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    className="rounded-full"
                                />
                            </div>
                            <div className="text-2xl font-bold text-center">
                                Atsushi Portfolio
                            </div>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<p>...Loading</p>}>
                        <LoginFormContent></LoginFormContent>
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    )
}