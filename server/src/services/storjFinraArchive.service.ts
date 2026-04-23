import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import 'dotenv/config';

// ─── StorJ S3-Compatible Client ───────────────────────────────────────────────
const storjClient = new S3Client({
  endpoint: process.env.STORJ_ENDPOINT ?? 'https://gateway.storjshare.io',
  region: 'us-east-1',
  credentials: {
    accessKeyId:     process.env.STORJ_ACCESS_KEY!,
    secretAccessKey: process.env.STORJ_SECRET_KEY!,
  },
  forcePathStyle: true,
});

// Use a dedicated FINRA bucket, falling back to the default WSP bucket
const FINRA_BUCKET = process.env.STORJ_FINRA_BUCKET
  ?? process.env.STORJ_BUCKET
  ?? 'dmp-wsp-documents';

// ─── Types ────────────────────────────────────────────────────────────────────

export type FinraDataType = 'notifications' | 'rulebook' | 'wsp-rules';

export interface ArchiveResult {
  key:        string;
  bucket:     string;
  dataType:   FinraDataType;
  recordCount: number;
  sizeBytes:  number;
  timestamp:  string;
  skipped:    boolean;   // true if an identical snapshot already existed
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Build a deterministic StorJ object key for a FINRA data snapshot.
 *
 * Layout:  finra-data/<dataType>/YYYY/MM/DD/<dataType>-<ISO-timestamp>.json
 *
 * Example: finra-data/notifications/2026/04/23/notifications-2026-04-23T14-30-00Z.json
 */
function buildKey(dataType: FinraDataType, now: Date): string {
  const yyyy = now.getUTCFullYear();
  const mm   = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd   = String(now.getUTCDate()).padStart(2, '0');
  // Replace colons so the key is safe on all S3-compatible systems
  const ts   = now.toISOString().replace(/:/g, '-').replace(/\.\d+Z$/, 'Z');
  return `finra-data/${dataType}/${yyyy}/${mm}/${dd}/${dataType}-${ts}.json`;
}

/**
 * Check whether a StorJ object already exists (used for dedup on same-day re-runs).
 */
async function objectExists(key: string): Promise<boolean> {
  try {
    await storjClient.send(new HeadObjectCommand({ Bucket: FINRA_BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

// ─── Core Archive Function ────────────────────────────────────────────────────

/**
 * Serialize `data` to JSON and upload it to StorJ under the `finra-data/` prefix.
 *
 * @param dataType  One of 'notifications' | 'rulebook' | 'wsp-rules'
 * @param data      The raw array or object returned by the FINRA API
 * @param metadata  Optional extra key/value pairs stored as S3 object metadata
 * @returns         ArchiveResult describing what was stored
 */
export async function archiveToStorJ(
  dataType: FinraDataType,
  data: unknown,
  metadata: Record<string, string> = {}
): Promise<ArchiveResult> {
  const now       = new Date();
  const key       = buildKey(dataType, now);
  const timestamp = now.toISOString();

  // Wrap the raw payload in a standard envelope so every file is self-describing
  const envelope = {
    _meta: {
      source:     'FINRA API',
      dataType,
      archivedAt: timestamp,
      pipeline:   'DMP OS PollScheduler v1',
    },
    data,
  };

  const body      = JSON.stringify(envelope, null, 2);
  const bodyBuf   = Buffer.from(body, 'utf-8');
  const recordCount = Array.isArray(data) ? data.length : 1;

  // Dedup: if this exact key already exists (shouldn't happen, but be safe)
  if (await objectExists(key)) {
    console.log(`[StorJ Archive] Key already exists — skipping: ${key}`);
    return { key, bucket: FINRA_BUCKET, dataType, recordCount, sizeBytes: bodyBuf.byteLength, timestamp, skipped: true };
  }

  await storjClient.send(
    new PutObjectCommand({
      Bucket:      FINRA_BUCKET,
      Key:         key,
      Body:        bodyBuf,
      ContentType: 'application/json',
      Metadata: {
        dataType,
        archivedAt:  timestamp,
        recordCount: String(recordCount),
        ...metadata,
      },
    })
  );

  console.log(`[StorJ Archive] ✓ Stored ${recordCount} ${dataType} record(s) → ${FINRA_BUCKET}/${key} (${bodyBuf.byteLength} bytes)`);

  return {
    key,
    bucket:      FINRA_BUCKET,
    dataType,
    recordCount,
    sizeBytes:   bodyBuf.byteLength,
    timestamp,
    skipped:     false,
  };
}
