import {auth} from "@/lib/auth";
import {NextResponse} from "next/server";

export default auth(async (req) => {

  const {nextUrl, auth: session} = req;
  const pathName = nextUrl?.pathname;

  //Obtener rol
  const userRole = session?.user?.role;
  const isLoggedIn = !!session;

  // Rutas públicas
  const publicPaths = ['/', '/events', '/about', '/contact'];
  const isPublicPath = publicPaths.includes(pathName) || pathName.startsWith('/events/');

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Rutas de auth (/sign-in, /sign-up)
  const isAuthPath = pathName === '/sign-in' || pathName === '/sign-up';

  if (isAuthPath) {
    // Si ya está logueado, redirigir a home
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/', nextUrl));
    }
    return NextResponse.next();
  }

  // Rutas protegidas - Verificar sesión
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/sign-in', nextUrl));
  }

  // Verificar rol
  console.log('userRole::', userRole)
  if (pathName.startsWith('/admin') && userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', nextUrl))
  }

  if (pathName.startsWith('/organizer') && userRole !== 'ORGANIZER') {
    return NextResponse.redirect(new URL('/', nextUrl))
  }

  if (pathName.startsWith('/user') && userRole !== 'COMPETITOR') {
    return NextResponse.redirect(new URL('/', nextUrl))
  }

  // OK
  return NextResponse.next()

});

export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/admin/:path*',
    '/organizer/:path*',
    '/user/:path*',
  ]
};