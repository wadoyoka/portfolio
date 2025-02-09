import CopyButton from "@/components/elements/CopyButton/CopyButton"
import parse, { domToReact, Element, type HTMLReactParserOptions, type Text } from "html-react-parser"
import Image from "next/image"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism"


export type RichEditorFieldProps = {
    content: string | null
}

type Replace = NonNullable<HTMLReactParserOptions["replace"]>

const replace: Replace = (domNode) => {
    if (!(domNode instanceof Element)) return undefined

    // figure タグの処理
    if (domNode.name === "figure") {
        return <div className="py-8"><figure className="w-fit grow">{domToReact(domNode.children as any, { replace })}</figure></div>
    }

    // 画像の変換
    if (domNode.name === "img") {
        const { src, alt, width, height } = domNode.attribs
        return (
            <Image
                src={src || "/placeholder.svg"}
                width={width ? Number.parseInt(width, 10) : 500}
                height={height ? Number.parseInt(height, 10) : 300}
                alt={alt || "Image"}
                className="rounded-lg mx-auto"
            />
        )
    }

    // コードブロックの変換
    if (domNode.name === "pre" && domNode.children[0] instanceof Element && domNode.children[0].name === "code") {
        const codeElement = domNode.children[0] as Element
        const language = codeElement.attribs.class ? codeElement.attribs.class.replace("language-", "") : "text"

        const code = codeElement.children
            .filter((child): child is Text => child.type === "text")
            .map((child) => child.data)
            .join("")

        return (
            <div className="my-4 relative">
                <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    customStyle={{
                        borderRadius: "0.5rem",
                        padding: "1rem",
                    }}
                >
                    {code}
                </SyntaxHighlighter>
                <CopyButton code={code} />
            </div>
        )
    }

    return undefined
}

export default function ContentsBodyParser(ContensBody: string) {
    const parsedContent = parse(ContensBody, { replace })
    return <>{parsedContent}</>
}

