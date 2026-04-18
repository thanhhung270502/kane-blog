import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const PRESIGNED_URL_EXPIRES_SECONDS = 3600; // 1 hour

export const ALLOWED_IMAGE_TYPES = ["jpg", "jpeg", "png", "webp", "gif"] as const;
export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

export const ALLOWED_VIDEO_TYPES = ["mp4", "mov", "webm"] as const;
export type AllowedVideoType = (typeof ALLOWED_VIDEO_TYPES)[number];

export const ALLOWED_MEDIA_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES] as const;
export type AllowedMediaType = (typeof ALLOWED_MEDIA_TYPES)[number];

/** MIME type for S3 PutObject / browser upload; must match `file.type` from the client. */
export function mimeTypeForImageExt(ext: string): string {
  const e = ext.toLowerCase();
  if (e === "jpg" || e === "jpeg") return "image/jpeg";
  return `image/${e}`;
}

export function mimeTypeForMediaExt(ext: string): string {
  const e = ext.toLowerCase();
  if (e === "jpg" || e === "jpeg") return "image/jpeg";
  if (e === "mp4") return "video/mp4";
  if (e === "mov") return "video/quicktime";
  if (e === "webm") return "video/webm";
  return `image/${e}`;
}

/**
 * Lazily create an S3 client so env vars are not read at build time.
 */
function getS3Client(): S3Client {
  return new S3Client({
    region: process.env.AWS_REGION ?? "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    // Disable automatic checksum injection so presigned PUT URLs don't embed
    // x-amz-checksum-* headers that the browser can't satisfy.
    requestChecksumCalculation: "WHEN_REQUIRED",
    ...(process.env.AWS_S3_ENDPOINT
      ? {
          endpoint: process.env.AWS_S3_ENDPOINT,
          forcePathStyle: process.env.AWS_S3_FORCE_PATH_STYLE === "true",
        }
      : {}),
  });
}

function getBucket(): string {
  const bucket = process.env.AWS_S3_BUCKET;
  if (!bucket) throw new Error("AWS_S3_BUCKET environment variable is not set");
  return bucket;
}

/**
 * Build the S3 key for an order image.
 * Format: orders/{orderId}/images/{imageId}.{ext}
 */
export function buildOrderImagePath(orderId: string, imageId: string, ext: string): string {
  return `orders/${orderId}/images/${imageId}.${ext.toLowerCase()}`;
}

/**
 * Build the S3 key for a template collection image.
 * Format: template-collections/{collectionId}/images/{imageId}.{ext}
 */
export function buildTemplateImagePath(
  collectionId: string,
  imageId: string,
  ext: string
): string {
  return `template-collections/${collectionId}/images/${imageId}.${ext.toLowerCase()}`;
}

/**
 * Build the S3 key for a user avatar.
 * Format: users/{userId}/avatar/{imageId}.{ext}
 */
export function buildUserAvatarPath(userId: string, imageId: string, ext: string): string {
  return `users/${userId}/avatar/${imageId}.${ext.toLowerCase()}`;
}

/**
 * Build the S3 key for a user cover photo.
 * Format: users/{userId}/cover/{imageId}.{ext}
 */
export function buildUserCoverPath(userId: string, imageId: string, ext: string): string {
  return `users/${userId}/cover/${imageId}.${ext.toLowerCase()}`;
}

/**
 * Build the S3 key for a post attachment.
 * Format: posts/{postId}/attachments/{imageId}.{ext}
 */
export function buildPostAttachmentPath(postId: string, imageId: string, ext: string): string {
  return `posts/${postId}/attachments/${imageId}.${ext.toLowerCase()}`;
}

/**
 * Generate a presigned PUT URL so the client can upload directly to S3.
 * `contentType` must match the `Content-Type` header on the browser PUT (e.g. `file.type`);
 * otherwise the signature is invalid and the request often surfaces as a CORS error in DevTools.
 */
export async function getUploadUrl(imagePath: string, contentType: string): Promise<string> {
  const client = getS3Client();
  const command = new PutObjectCommand({
    Bucket: getBucket(),
    Key: imagePath,
    ContentType: contentType,
  });
  return getSignedUrl(client, command, { expiresIn: PRESIGNED_URL_EXPIRES_SECONDS });
}

/**
 * Generate a presigned GET URL so the client can download an image from S3.
 */
export async function getDownloadUrl(imagePath: string): Promise<string> {
  const client = getS3Client();
  const command = new GetObjectCommand({ Bucket: getBucket(), Key: imagePath });
  return getSignedUrl(client, command, { expiresIn: PRESIGNED_URL_EXPIRES_SECONDS });
}
