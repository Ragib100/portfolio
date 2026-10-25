import { CollectionPage } from "@/components/admin/collection-page";

const contestRecords = [
  { title: "ICPC Dhaka Regional", detail: "ICPC Regional · 2025 · Rank 42 of 120 teams", status: "Published" },
  { title: "MIST IUPC", detail: "IUPC · 2025 · Rank 8", status: "Published" },
  { title: "Hackathon 2026", detail: "Hackathon · Online · Draft result", status: "Draft" },
];
const contestFields = ["Contest name", "Category", "Organizer", "Date", "Year", "Mode", "Rank", "Total participants", "Team name (optional)", "Solved problems", "Prize", "Certificate or post URL", "Notes"];

export default function Page() {
  return <CollectionPage title="Contest results" description="Record competitive programming contests and hackathons. Only the team name is shown; member details are not collected." action="Add contest" fields={contestFields} records={contestRecords} />;
}
