import {auth} from "@/lib/auth";
import {NextResponse} from "next/server";

export default auth(async (req) => {

  const {nextUrl, auth: session} = req;
  const pathName = nextUrl?.pathname;

  //Obtener rol
  const isLoggedIn = !!session?.user;
  const userRole = session?.user?.role;

  // Rutas públicas
  const publicPaths = ['/', '/events', '/about', '/contact'];
  const isPublicPath = publicPaths.includes(pathName) || pathName.startsWith('/events/');

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Rutas de auth (/sign-in, /sign-up)
  const isAuthPath = pathName === '/sign-in' || pathName === '/sign-up';

  console.log('session:', session);
  console.log('user:', session?.user);


  if (isAuthPath) {
    // Si ya está logueado, redirigir a home
    console.log('isAuthPath', pathName)
    if (isLoggedIn) {
      console.log('isLoggedIn')
      return NextResponse.redirect(new URL('/', nextUrl));
    }
    return NextResponse.next();
  }

  // Rutas protegidas - Verificar sesión
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/sign-in', nextUrl));
  }

  // Verificar rol
  console.log('userRole::', userRole);
  const pathSegments = pathName.split('/').filter(Boolean);

  if (pathSegments[0] === 'dashboard' && pathSegments[1]) {
    const urlRole = pathSegments[1];

    const roleMap: Record<string, string> = {
      admin: 'ADMIN',
      organizer: 'ORGANIZER',
      competitor: 'COMPETITOR',
    }

    const requiredRole = roleMap[urlRole];

    if (requiredRole && userRole !== requiredRole) {
      console.log(`Acceso denegado a ${userRole} intentó acceder a ${urlRole}`);
      return NextResponse.redirect(new URL('/', nextUrl));
    }

  }

  // OK
  return NextResponse.next()

});

export const config = {
  matcher: [
    '/',
    '/sign-in',
    '/sign-up',
    '/dashboard/admin/:path*',
    '/dashboard/organizer/:path*',
    '/user/:path*',
  ]
};