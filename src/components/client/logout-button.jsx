"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { MdLogout } from "react-icons/md";

export const LogoutButton = ({ ...props }) => {
    return (
        <Button
            onClick={() => authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        window.location.href = "/login";
                    },
                },
            })}
            {...props}
        >
            <MdLogout /> Logout
        </Button>
    )
}