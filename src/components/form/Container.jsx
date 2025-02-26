//Assets
import Logo from "../../assets/images/logo.png";

//Components
import ThemeToggle from "../../components/ThemeToggle";

export default function Container({ children, text, password = false }) {
  return (
    <div className="min-h-screen bg-gray-300 dark:bg-gray-900 flex items-center justify-center">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl bg-gray-100 dark:bg-slate-700 rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-3">
              <div></div>
              <ThemeToggle className="ml-auto" />
            </div>
            <div className="text-center mb-4">
              <img
                src={Logo}
                alt="Logo"
                className="mb-2 mx-auto"
                height={60}
                width={60}
              />
              <h1 className="text-2xl font-bold text-gray-900 mb-2 dark:text-gray-200">
                Icosoft
              </h1>
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-400">
                {text}
              </h2>
              {password && (
                <p className="mt-3">
                  Lo entendemos, puede suceder. Sólo tienes que introducir tu
                  dirección de correo electrónico a continuación ¡Y te
                  enviaremos un enlace para restablecer tu contraseña!
                </p>
              )}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
