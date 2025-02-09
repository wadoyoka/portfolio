"use client"

import { CheckIcon, ClipboardIcon } from "@heroicons/react/24/outline"
import type React from "react"
import { useState } from "react"

interface CopyButtonProps {
    code: string
}

const CopyButton: React.FC<CopyButtonProps> = ({ code }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors flex items-center space-x-2"
            aria-label={copied ? "Copied" : "Copy code"}
        >
            {copied ? (
                <>
                    <CheckIcon className="h-5 w-5 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">Copied!!</span>
                </>
            ) : (
                <>
                    <ClipboardIcon className="h-5 w-5 text-gray-300" />
                    <span className="text-gray-300 text-sm font-medium">Copy</span>
                </>
            )}
        </button>
    )
}

export default CopyButton

