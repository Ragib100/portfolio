import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { FieldValue, type DocumentData } from "firebase-admin/firestore";
import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";
import type { Contest, ContestInput } from "@/lib/data/contest";

const COLLECTION = "contests";
const OPTIONAL_KEYS = [
  "rank", "totalParticipants", "solved", "totalProblems", "teamName", "url", "notes",
] as const;

const collection = () => getFirebaseAdminFirestore().collection(COLLECTION);

export function isValidContestId(id: unknown): id is string {
  return typeof id === "string" && /^[A-Za-z0-9_-]{1,100}$/.test(id);
}

function toContest(id: string, data: DocumentData): Contest {
  return {
    id,
    title: data.title,
    category: data.category,
    date: data.date,
    rank: data.rank,
    totalParticipants: data.totalParticipants,
    solved: data.solved,
    totalProblems: data.totalProblems,
    teamName: data.teamName,
    url: data.url,
    notes: data.notes,
    published: data.published,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export async function listContests(): Promise<Contest[]> {
  const snapshot = await collection().orderBy("date", "desc").limit(300).get();
  return snapshot.docs.map((doc) => toContest(doc.id, doc.data()));
}

export async function getPublishedContests(): Promise<Contest[]> {
  "use cache";
  cacheTag("contests");
  cacheLife("hours");

  const snapshot = await collection().orderBy("date", "desc").limit(300).get();
  return snapshot.docs
    .map((doc) => toContest(doc.id, doc.data()))
    .filter((contest) => contest.published);
}

export async function createContest(data: ContestInput): Promise<string> {
  const now = new Date().toISOString();
  const payload = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
  const ref = await collection().add({ ...payload, createdAt: now, updatedAt: now });
  return ref.id;
}

export async function updateContest(id: string, data: ContestInput): Promise<boolean> {
  const ref = collection().doc(id);
  if (!(await ref.get()).exists) return false;

  const payload: Record<string, unknown> = { ...data, updatedAt: new Date().toISOString() };
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
