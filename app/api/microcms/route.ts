// import { secureCompare } from "@/utils/microCMSAuth"
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("Hello")
  // ここの設定と各tagsの中身の検証があるよ
  // const apiKey = request.headers.get("X-WEBHOOK-API-KEY")

//   if (!secureCompare(apiKey, process.env.WEBHOOK_API_KEY)) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
//   }

  const tag = request.nextUrl.searchParams.get("tags")

  console.log(tag);

  if (!tag)
    return NextResponse.json({ message: "No tag provided" }, { status: 400 })

  revalidateTag(tag)

  return NextResponse.json({ revalidated: true, now: Date.now() })
}
