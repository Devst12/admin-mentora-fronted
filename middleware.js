import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  })

  const { pathname } = request.nextUrl
  const allowedEmails = (process.env.ALLOWED_EMAILS || "").split(",")

  // Protect routes
  const isProtectedRoute = pathname.startsWith("/page") 

  if (isProtectedRoute) {
    if (!token) {
      const url = new URL("/api/auth/signin", request.url)
      url.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(url)
    }

    const isEmailAllowed = token.email && allowedEmails.includes(token.email)
    if (!isEmailAllowed) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/page/:path*", "/settings/:path*"],
}
