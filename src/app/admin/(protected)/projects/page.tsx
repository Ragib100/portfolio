import { CollectionPage } from "@/components/admin/collection-page";

const projectRecords = [
  { title: "Pathao Clone", detail: "React · Node.js · MongoDB · Full stack developer", status: "Published" },
  { title: "Contest Tracker", detail: "Next.js · TypeScript · Firebase · In progress", status: "Published" },
  { title: "Campus Connect", detail: "React Native · Firebase · Draft project", status: "Draft" },
];
const projectFields = ["Project title", "Slug", "Short summary", "Description (Markdown)", "Tech stack", "Your role", "Live URL", "Source code URL", "Status"];

export default function Page() {
  return <CollectionPage title="Projects" description="Manage the work shown on your portfolio, including your role and contribution." action="New project" fields={projectFields} records={projectRecords} />;
}
