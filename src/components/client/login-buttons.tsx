"use client";

import { Button } from "../ui/button";
import { FaGithub, FaGoogle } from "react-icons/fa"
import { authClient } from "@/lib/auth-client";

export const LoginButtons = () => {

    return (
        <>
            <Button
                className="w-full"
                size="lg"
                onClick={() => authClient.signIn.social({
                    provider: "google"
                })}
            >
                <FaGoogle /> Continue with Google
            </Button>
            <Button
                className="w-full"
                size="lg"
                onClick={() => authClient.signIn.social({
                    provider: "github"
                })}
            >
                <FaGithub /> Continue with Github
            </Button>
        </>
    )
};