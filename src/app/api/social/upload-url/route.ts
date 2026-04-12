import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getSessionUser } from "@/libs/auth-session";
import {
  ALLOWED_IMAGE_TYPES,
  buildPostAttachmentPath,
  buildUserAvatarPath,
  buildUserCoverPath,
  getUploadUrl,
  mimeTypeForImageExt,
} from "@/libs/s3";

type UploadKind = "avatar" | "cover" | "post-attachment";

interface UploadUrlRequest {
  kind: UploadKind;
  /** Required when kind = "post-attachment" */
  postId?: string;
  imageType: string;
}

interface UploadUrlResponse {
  uploadUrl: string;
  imagePath: string;
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: UploadUrlRequest = await request.json();
    const { kind, postId, imageType } = body;

    const ext = imageType.toLowerCase().replace(/^image\//, "");
    if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(ext)) {
      return NextResponse.json(
        { message: `Unsupported image type. Allowed: ${ALLOWED_IMAGE_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    const imageId = crypto.randomUUID();
    let imagePath: string;

    if (kind === "avatar") {
      imagePath = buildUserAvatarPath(user.id, imageId, ext);
    } else if (kind === "cover") {
      imagePath = buildUserCoverPath(user.id, imageId, ext);
    } else if (kind === "post-attachment") {
      if (!postId) {
        return NextResponse.json({ message: "postId is required for post-attachment" }, { status: 400 });
      }
      imagePath = buildPostAttachmentPath(postId, imageId, ext);
    } else {
      return NextResponse.json({ message: "Invalid upload kind" }, { status: 400 });
    }

    const contentType = mimeTypeForImageExt(ext);
    const uploadUrl = await getUploadUrl(imagePath, contentType);
    const response: UploadUrlResponse = { uploadUrl, imagePath };
    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ message: "Failed to generate upload URL" }, { status: 500 });
  }
}
