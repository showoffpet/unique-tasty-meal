export default async function CustomerPreferencesPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <div>Customer Preferences Page for {id}</div>; }
