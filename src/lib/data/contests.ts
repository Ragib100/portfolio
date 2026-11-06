import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { getFirebaseAdminFirestore } from "@/lib/firebase/admin"; // <- adjust to your firebase-admin export
import type { Contest, ContestInput } from "@/lib/contests/schema";

const COLLECTION = "contests";
const OPTIONAL_KEYS = [
  "organizer", "rank", "totalParticipants", "teamName", "solved", "prize", "url", "notes",
] as const;

const collection = () => getFirebaseAdminFirestore().collection(COLLECTION);

// Document ids go into a Firestore path, so reject anything with "/" etc.
export function isValidContestId(id: unknown): id is string {
  return typeof id === "string" && /^[A-Za-z0-9_-]{1,100}$/.test(id);
}

function toContest(id: string, data: FirebaseFirestore.DocumentData): Contest {
  return { id, ...(data as Omit<Contest, "id">) };
}

// Admin: every contest, newest first.
export async function listContests(): Promise<Contest[]> {
  const snapshot = await collection().orderBy("date", "desc").limit(300).get();
  return snapshot.docs.map((doc) => toContest(doc.id, doc.data()));
}

export async function createContest(data: ContestInput): Promise<string> {
  const now = new Date().toISOString();
  const payload = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
  const ref = await collection().add({ ...payload, createdAt: now, updatedAt: now });
  return ref.id;
}

// Returns false when the contest doesn't exist.
export async function updateContest(id: string, data: ContestInput): Promise<boolean> {
  const ref = collection().doc(id);
  if (!(await ref.get()).exists) return false;

  const payload: Record<string, unknown> = { ...data, updatedAt: new Date().toISOString() };
  // A cleared optional field must be removed, not left with its old value.
  for (const key of OPTIONAL_KEYS) {
    if (data[key] === undefined) payload[key] = FieldValue.delete();
  }
  await ref.update(payload);
  return true;
}

export async function setContestPublished(id: string, published: boolean): Promise<boolean> {
  const ref = collection().doc(id);
  if (!(await ref.get()).exists) return false;
  await ref.update({ published, updatedAt: new Date().toISOString() });
  return true;
}

export async function removeContest(id: string): Promise<void> {
  await collection().doc(id).delete();
}

// Public portfolio: published contests only. Cached until revalidateTag("contests").
// Requires cacheComponents; if you don't use it, wrap this in unstable_cache instead.
export async function getPublishedContests(): Promise<Contest[]> {
  "use cache";
  cacheTag("contests");
  cacheLife("hours");

  const snapshot = await collection().orderBy("date", "desc").limit(300).get();
  return snapshot.docs
    .map((doc) => toContest(doc.id, doc.data()))
    .filter((contest) => contest.published);
}