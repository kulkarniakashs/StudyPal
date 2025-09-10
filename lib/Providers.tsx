"use client"
import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react";
import { Provider } from "react-redux";
import store from "@/lib/store/store"; // Adjust the path if your store file is elsewhere

export default function Page({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <Provider store={store}>
                {children}
            </Provider>
        </SessionProvider>
    )
}
