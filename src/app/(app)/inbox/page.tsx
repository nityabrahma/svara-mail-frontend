import { redirect } from 'next/navigation'

export default function InboxPage() {
    // Redirect to the default inbox view
    redirect('/inbox/all')
}
