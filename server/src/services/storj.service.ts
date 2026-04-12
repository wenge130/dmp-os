import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import 'dotenv/config';

const storjClient = new S3Client({
  endpoint: process.env.STORJ_ENDPOINT ?? 'https://gateway.storjshare.io',
  region: 'us-east-1', // Storj requires a region value; any string works
  credentials: {
    accessKeyId: process.env.STORJ_ACCESS_KEY!,
    secretAccessKey: process.env.STORJ_SECRET_KEY!,
  },
  forcePathStyle: true,
});

const BUCKET = process.env.STORJ_BUCKET ?? 'dmp-wsp-documents';

/**
 * Upload a WSP manual PDF to Storj.
 * @param wspId   The WSP manual ID (used as folder prefix)
 * @param filename The original filename
 * @param buffer  File content as Buffer
 * @param mimeType MIME type (default: application/pdf)
 */
export async function uploadDocument(
  wspId: string,
  filename: string,
  buffer: Buffer,
  mimeType = 'application/pdf'
): Promise<string> {
  const key = `wsp-manuals/${wspId}/${Date.now()}-${filename}`;

  await storjClient.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      Metadata: { wspId, originalName: filename },
    })
  );

  console.log(`[Storj] Uploaded: ${key}`);
  return key;
}

/**
 * Download a document from Storj and return it as a Buffer.
 */
export async function downloadDocument(key: string): Promise<Buffer> {
  const response = await storjClient.send(
    new GetObjectCommand({ Bucket: BUCKET, Key: key })
  );

  const stream = response.Body as Readable;
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

/**
 * List all documents for a given WSP manual.
 */
export async function listDocuments(wspId: string): Promise<{ key: string; size: number; lastModified: Date }[]> {
  const response = await storjClient.send(
    new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: `wsp-manuals/${wspId}/`,
    })
  );

  return (response.Contents ?? []).map((obj) => ({
    key: obj.Key!,
    size: obj.Size ?? 0,
    lastModified: obj.LastModified ?? new Date(),
  }));
}

/**
 * Delete a document from Storj.
 */
export async function deleteDocument(key: string): Promise<void> {
  await storjClient.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
  console.log(`[Storj] Deleted: ${key}`);
}
