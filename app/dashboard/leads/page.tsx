import { LeadTable } from "@/components/dashboard/lead-table";
import { getLeadsData } from "@/lib/dashboard/queries";

export default async function LeadsPage() {
  const leads = await getLeadsData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Leads</h1>
        <p className="text-muted-foreground">Lista comercial real com status, origem, temperatura e valor potencial.</p>
      </div>
      <LeadTable leads={leads} />
    </div>
  );
}
