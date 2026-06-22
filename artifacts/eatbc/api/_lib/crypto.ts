import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

function key(): Buffer {
  return createHash("sha256").update(process.env.ENCRYPTION_KEY!).digest();
}

/* Ciphertext is tagged with a key version (v1) so the key can be rotated
   later without making existing data undecryptable. */
const VERSION = "v1";

export function encrypt(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  let enc = cipher.update(plain, "utf8", "base64");
  enc += cipher.final("base64");
  const tag = cipher.getAuthTag().toString("base64");
  return `${VERSION}:${iv.toString("base64")}:${tag}:${enc}`;
}

export function decrypt(ciphertext: string): string {
  const parts = ciphertext.split(":");
  // v1:iv:tag:enc  (versioned)  |  iv:tag:enc  (legacy, pre-versioning)
  const [ivB64, tagB64, enc] =
    parts.length === 4 ? parts.slice(1) : parts;
  const decipher = createDecipheriv(
    "aes-256-gcm",
    key(),
    Buffer.from(ivB64, "base64")
  );
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  let out = decipher.update(enc, "base64", "utf8");
  out += decipher.final("utf8");
  return out;
}
