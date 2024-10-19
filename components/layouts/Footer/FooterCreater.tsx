'use client';

import { useSession } from "next-auth/react";
import Footer from "./Footer";


export default function FooterCreator() {
    const { status } = useSession()


    if (status === 'authenticated') {
        return (
            <>
                <Footer />
            </>
        )
    }else{
        return <></>
    }
}