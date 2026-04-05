import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const PRESIGNED_URL_EXPIRES_SECONDS = 3600; // 1 hour

export const ALLOWED_IMAGE_TYPES = ["jpg", "jpeg", "png", "webp", "gif"] as const;
export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

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
 * Generate a presigned PUT URL so the client can upload directly to S3.
 */
export async function getUploadUrl(imagePath: string): Promise<string> {
  const client = getS3Client();
  const command = new PutObjectCommand({ Bucket: getBucket(), Key: imagePath });
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
