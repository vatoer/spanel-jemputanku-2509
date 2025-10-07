import { DriverFormContainer } from "@/components/tenant/DriverFormContainer";
import { TenantBreadcrumb } from "@/components/tenant/TenantBreadcrumb";
import { TenantMobileNav } from "@/components/tenant/TenantMobileNav";
import { TenantSidebar } from "@/components/tenant/TenantSidebar";
import { getDriverDetailById } from "@/lib/services/driver";
import { notFound } from "next/navigation";

export default async function EditDriverPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // For now, we'll use the same tenant ID as other pages. In a real app, this would come from the session
  const tenantId = "tenant-transjakarta";
  
  const driverData = await getDriverDetailById(id, tenantId);

  if (!driverData) {
    notFound();
  }

  // Transform the data to match the form schema
  const initialData = {
    name: driverData.name || "",
    email: driverData.email,
    image: driverData.image || "",
    // Note: phone and licenseNumber would need to be added to the schema/service
    // For now, we'll leave them empty
    phone: "",
    licenseNumber: "",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <TenantSidebar />
      <div className="flex-1 flex flex-col">
        <div className="md:hidden p-4"><TenantMobileNav /></div>
        <main className="container mx-auto px-4 py-8">
          <TenantBreadcrumb />
          <DriverFormContainer 
            isEdit={true}
            initialData={initialData}
            driverId={id}
          />
        </main>
      </div>
    </div>
  );
}
