export const CONTEST_CATEGORIES = ["ICPC", "IUPC", "NCPC", "National", "Hackathon", "Online", "Other"] as const;

export type ContestCategory = (typeof CONTEST_CATEGORIES)[number];

export type ContestInput = {
  title: string;
  category: ContestCategory;
  date: string;
  rank?: number;
  totalParticipants?: number;
  solved?: number;
  totalProblems?: number;
  teamName?: string;
  url?: string;
  notes?: string;
  published: boolean;
};

export type Contest = ContestInput & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type ContestFormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  values?: Record<string, string>;
};
