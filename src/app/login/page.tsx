import Image from "next/image"
import { LoginButtons } from "@/components/client/login-buttons"

export default function Login() {
    return (
        <div className="h-[calc(100vh-var(--spacing)*14)] flex overflow-hidden">

            <div className="flex-1 h-full flex justify-center items-center flex-col px-6">
                <Image
                    alt="Logo"
                    src="/logo.png"
                    height={500}
                    width={500}
                    className="size-16 mb-4"
                />
                <h1 className="text-2xl sm:text-3xl font-bold text-center">
                    The <span className="text-primary">Fastest</span> <br /> Development Setup
                </h1>
                <div className="pt-8 w-full max-w-[280px] flex flex-col gap-2">
                    <LoginButtons />
                </div>
            </div>

            <div className="hidden lg:block relative flex-1 h-full">
                <Image
                    src="/bg1.png"
                    alt="Banner"
                    fill
                    className="object-cover object-center"
                    priority
                />

                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/5 to-transparent" />
            </div>

        </div>
    )
}