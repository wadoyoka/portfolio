'use client'

import { usePathname } from "next/navigation"
import Header from "./Header"

const PATHS_WITHOUT_HEADER = ['/login']

export default function HeaderCreator() {
    const pathname = usePathname()

    const shouldShowHeader = !PATHS_WITHOUT_HEADER.includes(pathname)

    return (
        <>
            {shouldShowHeader && <Header />}
        </>
    )
}