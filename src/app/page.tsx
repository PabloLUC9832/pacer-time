import {Metadata} from "next";
import {strings} from "@/constans/strings";
import {auth} from "@/lib/auth";

export const metadata: Metadata = {
  title: {
    template: `%s | ${strings.appName}`,
    default: `${strings.appName}`
  },
  description: `${strings.pages.home} | ${strings.appName}`
}

export default async function Home() {

  const session = await auth();

  return (

    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Contenedor principal con padding top para evitar que el navbar tape el contenido */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-sm dark:bg-gray-950">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-50">
            Bienvenido a {strings.appName}
          </h1>

          {session?.user ? (
              <div className="space-y-4">
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  ¡Hola, {session.user.name}!
                </p>
                <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-900">
                  <h2 className="mb-2 font-semibold text-gray-900 dark:text-gray-50">
                    Información de la sesión:
                  </h2>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Nombre:</span> {session.user.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Email:</span> {session.user.email}
                    </p>
                  </div>
                </div>
              </div>
          ) : (
              <div className="space-y-4">
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Por favor, inicia sesión para acceder a todas las funcionalidades.
                </p>
              </div>
          )}
        </div>
      </div>
    </div>

  );
}
