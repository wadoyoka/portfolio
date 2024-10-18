import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Suspense } from "react"
import LoginFormContent from "./loginFormContent"

export default function LoginForm() {

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md bg-white max-md:mx-4">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
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