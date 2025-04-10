// import { secureCompare } from "@/utils/microCMSAuth"
import { CryptoUtils } from "@/utils/crypto-utils";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log('microHello')
  // ここの設定と各tagsの中身の検証があるよ
  const apiKey = request.headers.get("X-WEBHOOK-API-KEY");
  const ispass = await CryptoUtils.comparePassword(process.env.SECRET_MICRO_CMS_KEY as string, apiKey as string);
  if (!ispass) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const tag = request.nextUrl.searchParams.get("tags")

  if (!tag) {
    return NextResponse.json({ message: "No tag provided" }, { status: 400 })
  }

  revalidateTag(tag)

  return NextResponse.json({ revalidated: true, now: Date.now() })
}
