export default async function ReferralLandingPage({ params }: { params: Promise<{ code: string }> }) { const { code } = await params; return <div>Referral Landing Page for Code {code}</div>; }
