

export default function ContainerLayout({ children, text, }) {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl bg-gray-100 dark:bg-slate-700 rounded-xl shadow-lg p-8">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100">
                {text}
              </h2>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
