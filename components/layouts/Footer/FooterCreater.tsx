'use client';

import { usePathname } from "next/navigation";
import Footer from "./Footer";

const PATHS_WITHOUT_FOOTER = ['/login']

export default function FooterCreator() {
    const pathname = usePathname()

    const shouldShowFooter = !PATHS_WITHOUT_FOOTER.includes(pathname)

    return (
        <>
            {shouldShowFooter && <Footer />}
        </>
    )
}