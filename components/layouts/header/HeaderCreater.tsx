'use client'

import { useSession } from "next-auth/react";

import Header from "./Header";


export default function HeaderCreator() {
    const { status } = useSession()



    if (status === 'authenticated') {
        return (
            <Header />
        )
    } else {
        return <></>
    }
}