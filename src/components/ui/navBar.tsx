"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
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
import {LogOutIcon, MenuIcon, SettingsIcon, UserIcon} from "lucide-react";
import { Session } from "next-auth";
import {usePathname} from "next/dist/client/components/navigation";
import Image from 'next/image';
import {signOut} from "next-auth/react";
import {ModeToggle} from "@/components/ModeToggle";
import {strings} from "@/constans/strings";


interface NavBarProps {
  session: Session | null;
}

export function NavBar({ session }: NavBarProps) {

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

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="w-full border-b bg-surface dark:bg-surface">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo - Izquierda */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
                src="/logo.svg"
                width={80}
                height={80}
                className='hidden md:block'
                alt={strings.appName}
            />
          </Link>
        </div>

        {/* Menú de navegación - Centro (Desktop) */}
        <div className="hidden md:flex md:flex-1 md:justify-center">
          <NavigationMenu>
            <NavigationMenuList>

              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/">{strings.pages.home}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              { (session?.user && (session.user.role == "ADMIN")) && (
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/upload-runners">{strings.pages.uploadRunners}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}

            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <ModeToggle />
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
                        <p className="text-xs leading-none text-on-surface-variant dark:text-on-surface-variant">
                          {session.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>{strings.pages.account.title}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <SettingsIcon className="mr-2 h-4 w-4" />
                        <span>{strings.pages.account.conf}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                      <LogOutIcon className="mr-2 h-4 w-4" />
                      <span>{strings.pages.account.logOut}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" asChild>
                <Link href="/sign-in">{strings.pages.signIn}</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">{strings.pages.signUp}</Link>
              </Button>
            </div>
          )}

          {/* Menú hamburger (Mobile) */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-75 sm:w-100">
              <SheetHeader>
                <SheetTitle>{strings.pages.menu}</SheetTitle>
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
                      <p className="text-xs text-on-surface-variant dark:text-on-surface-variant">
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
                    {strings.pages.home}
                  </Link>

                  {session?.user && (session.user.role == "ADMIN") && (
                    <Link
                        href="/upload-runners"
                        className="rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {strings.pages.uploadRunners}
                    </Link>
                  )}

                  {session?.user && (
                      <>
                        <div className="my-2 h-px bg-gray-200 dark:bg-gray-800" />
                        <Link
                            href="/profile"
                            className="rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <UserIcon className="mr-2 inline-block h-4 w-4" />
                          {strings.pages.account.title}
                        </Link>
                        <Link
                            href="/settings"
                            className="rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <SettingsIcon className="mr-2 inline-block h-4 w-4" />
                          {strings.pages.account.conf}
                        </Link>
                        <button
                            onClick={handleSignOut}
                            className="rounded-md px-4 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                        >
                          <LogOutIcon className="mr-2 inline-block h-4 w-4" />
                          {strings.pages.account.logOut}
                        </button>
                      </>
                  )}

                  {!session?.user && (
                      <>
                        <div className="my-2 h-px bg-gray-200 dark:bg-gray-800" />
                        <Link
                            href="/sign-in"
                            className="rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          {strings.pages.signIn}
                        </Link>
                        <Link
                            href="/sign-up"
                            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90"
                        >
                          {strings.pages.signUp}
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