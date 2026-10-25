import { CollectionPage } from "@/components/admin/collection-page";

const experienceRecords = [
  { title: "Industrial Trainee", detail: "DataSoft Systems Bangladesh · Training · 2025", status: "Published" },
  { title: "Treasurer", detail: "MIST Computer Club · Club role · 2025—present", status: "Published" },
  { title: "BSc in Computer Science", detail: "MIST · Education · 2022—2026", status: "Published" },
];
const experienceFields = ["Title", "Organization", "Type (work / club / education)", "Start date", "End date", "Description", "Highlights", "Related link"];

export default function Page() {
  return <CollectionPage title="Experience & education" description="Build a timeline of work, industrial training, club roles, and education." action="Add experience" fields={experienceFields} records={experienceRecords} />;
}
