const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!

async function getSignedUploadUrl(key: string, contentType: string) {
  const { S3Client, PutObjectCommand, GetObjectCommand } = await import("@aws-sdk/client-s3")
  const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner")

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
  })

  const command = new PutObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key, ContentType: contentType })
  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 3600 })
  const publicUrl = `${R2_PUBLIC_URL}/${key}`
  return { uploadUrl, publicUrl }
}

export async function uploadImageFromUrl(sourceUrl: string, key: string): Promise<string> {
  const response = await fetch(sourceUrl)
  const buffer = await response.arrayBuffer()
  const contentType = response.headers.get("content-type") || "image/jpeg"

  const { uploadUrl, publicUrl } = await getSignedUploadUrl(key, contentType)
  await fetch(uploadUrl, {
    method: "PUT",
    body: buffer,
    headers: { "Content-Type": contentType },
  })
  return publicUrl
}

export async function uploadImageFile(file: ArrayBuffer, key: string, contentType: string): Promise<string> {
  const { uploadUrl, publicUrl } = await getSignedUploadUrl(key, contentType)
  await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": contentType },
  })
  return publicUrl
}

export function generateImageKey(userId: string, projectId: string, type: string): string {
  return `${userId}/${projectId}/${type}-${Date.now()}.jpg`
}
