import { getServerUser } from '@/lib/server-auth'
import { redirect } from 'next/navigation'

// Example Server Component that uses server-side authentication
export default async function ServerProtectedPage() {
  // Get the authenticated user on the server side
  const user = await getServerUser()
  
  if (!user) {
    // Redirect to login if not authenticated
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Server-Side Protected Page
          </h1>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              This page is protected using server-side authentication. 
              The user data was fetched on the server before rendering.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h2 className="font-semibold text-blue-900 mb-2">User Information:</h2>
              <dl className="space-y-1">
                <div>
                  <dt className="inline font-medium text-blue-800">Email: </dt>
                  <dd className="inline text-blue-700">{user.email}</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-blue-800">Name: </dt>
                  <dd className="inline text-blue-700">{user.name || 'Not provided'}</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-blue-800">UID: </dt>
                  <dd className="inline text-blue-700 font-mono text-sm">{user.uid}</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-blue-800">Email Verified: </dt>
                  <dd className="inline text-blue-700">
                    {user.emailVerified ? '✅ Yes' : '❌ No'}
                  </dd>
                </div>
              </dl>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h2 className="font-semibold text-green-900 mb-2">Authentication Method:</h2>
              <p className="text-green-700">
                🔒 Server-side Firebase ID token verification
              </p>
              <p className="text-sm text-green-600 mt-1">
                This page was rendered on the server after verifying the Firebase token, 
                providing better security and SEO compared to client-side only authentication.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}