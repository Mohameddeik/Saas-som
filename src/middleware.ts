export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/dashboard/:path*', '/bundles/:path*', '/transactions/:path*', '/topup/:path*', '/profile/:path*'],
}
