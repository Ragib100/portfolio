import "server-only";

import type { Contest, ContestInput } from "@/lib/data/contest";
import { contestSchema } from "./schema";
import {
  createContest as createContestInRepository,
  getPublishedContests as getPublishedContestsFromRepository,
  isValidContestId,
  listContests as listContestsFromRepository,
  removeContest as removeContestFromRepository,
  setContestPublished as setContestPublishedInRepository,
  updateContest as updateContestInRepository,
} from "./repository";

export { isValidContestId };

function validateInput(input: ContestInput): ContestInput {
  return contestSchema.parse(input);
}

export async function listContests(): Promise<Contest[]> {
  return listContestsFromRepository();
}

export async function getPublishedContests(): Promise<Contest[]> {
  return getPublishedContestsFromRepository();
}

export async function createContest(input: ContestInput): Promise<string> {
  return createContestInRepository(validateInput(input));
}

export async function updateContest(id: string, input: ContestInput): Promise<boolean> {
  return updateContestInRepository(id, validateInput(input));
}

export async function setContestPublished(id: string, published: boolean): Promise<boolean> {
  return setContestPublishedInRepository(id, published);
}

export async function removeContest(id: string): Promise<void> {
  return removeContestFromRepository(id);
}
