export default async function DriverEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <h1>Edit Driver</h1>
      <p>Driver ID: {id}</p>
    </div>
  );
}
