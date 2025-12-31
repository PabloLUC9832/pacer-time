"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CircleUserIcon, LogOutIcon, MenuIcon, SettingsIcon, UserIcon } from "lucide-react";
import { Session } from "next-auth";
import {usePathname} from "next/dist/client/components/navigation";
import {useSession} from "next-auth/react";

interface NavBarProps {
  session: Session | null;
}

//export function NavBar() {
export function NavBar({ session }: NavBarProps) {

  //const {data: session} = useSession();
  const pathname = usePathname();

  if (pathname === "/sign-in" || pathname === "/sign-up") return;

  // Función para obtener las iniciales del usuario
  const getUserInitials = (name?: string | null) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
      <header className="w-full border-b bg-white dark:bg-gray-950">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo - Izquierda */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900">
                <span className="text-lg font-bold">P</span>
              </div>
              <span className="hidden text-xl font-bold text-gray-900 sm:inline-block dark:text-gray-50">
            Pacer Time
          </span>
            </Link>
          </div>

          {/* Menú de navegación - Centro (Desktop) */}
          <div className="hidden md:flex md:flex-1 md:justify-center">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/">Inicio</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Características</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                              href="/features/tracking"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50"
                          >
                            <div className="text-sm font-medium leading-none">
                              Seguimiento de tiempo
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400">
                              Registra y monitorea tu tiempo de trabajo fácilmente.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                              href="/features/reports"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50"
                          >
                            <div className="text-sm font-medium leading-none">
                              Reportes
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400">
                              Genera reportes detallados de tu productividad.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/pricing">Precios</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/about">Acerca de</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Usuario/Auth - Derecha */}
          <div className="flex items-center gap-4">
            {session?.user ? (
                <>
                  {/* Dropdown del usuario (Desktop) */}
                  <div className="hidden md:block">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                          <Avatar>
                            <AvatarImage
                                src={session.user.image || undefined}
                                alt={session.user.name || "Usuario"}
                            />
                            <AvatarFallback>
                              {getUserInitials(session.user.name)}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuLabel>
                          <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium leading-none">
                              {session.user.name}
                            </p>
                            <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
                              {session.user.email}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/profile" className="cursor-pointer">
                            <UserIcon className="mr-2 h-4 w-4" />
                            <span>Mi perfil</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/settings" className="cursor-pointer">
                            <SettingsIcon className="mr-2 h-4 w-4" />
                            <span>Configuración</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/api/auth/signout" className="cursor-pointer">
                            <LogOutIcon className="mr-2 h-4 w-4" />
                            <span>Cerrar sesión</span>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </>
            ) : (
                <div className="hidden items-center gap-2 md:flex">
                  <Button variant="ghost" asChild>
                    <Link href="/sign-in">Iniciar sesión</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/sign-up">Registrarse</Link>
                  </Button>
                </div>
            )}

            {/* Menú hamburguesa (Mobile) */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menú</SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-4">
                  {session?.user && (
                      <div className="flex items-center gap-3 rounded-lg border p-4">
                        <Avatar>
                          <AvatarImage
                              src={session.user.image || undefined}
                              alt={session.user.name || "Usuario"}
                          />
                          <AvatarFallback>
                            {getUserInitials(session.user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="text-sm font-medium">{session.user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {session.user.email}
                          </p>
                        </div>
                      </div>
                  )}

                  <nav className="flex flex-col gap-2">
                    <Link
                        href="/"
                        className="rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Inicio
                    </Link>
                    <Link
                        href="/features"
                        className="rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Características
                    </Link>
                    <Link
                        href="/pricing"
                        className="rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Precios
                    </Link>
                    <Link
                        href="/about"
                        className="rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Acerca de
                    </Link>

                    {session?.user && (
                        <>
                          <div className="my-2 h-px bg-gray-200 dark:bg-gray-800" />
                          <Link
                              href="/profile"
                              className="rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <UserIcon className="mr-2 inline-block h-4 w-4" />
                            Mi perfil
                          </Link>
                          <Link
                              href="/settings"
                              className="rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <SettingsIcon className="mr-2 inline-block h-4 w-4" />
                            Configuración
                          </Link>
                          <Link
                              href="/api/auth/signout"
                              className="rounded-md px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                          >
                            <LogOutIcon className="mr-2 inline-block h-4 w-4" />
                            Cerrar sesión
                          </Link>
                        </>
                    )}

                    {!session?.user && (
                        <>
                          <div className="my-2 h-px bg-gray-200 dark:bg-gray-800" />
                          <Link
                              href="/sign-in"
                              className="rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            Iniciar sesión
                          </Link>
                          <Link
                              href="/sign-up"
                              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90"
                          >
                            Registrarse
                          </Link>
                        </>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>
  );
}