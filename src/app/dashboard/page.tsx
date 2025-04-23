import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import DashboardActions from "@/app/dashboard/DashboardActions"

// Server component to display the dashboard
export default async function ServerComponent() {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if(!session) {
        return <div>Not authenticated</div>
    }
    return (
        <div>
            <DashboardActions session={session} />
        </div>
    )
}