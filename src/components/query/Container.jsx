
export default function Container({title, children}) {
  return (
    <div className="flex justify-center">
      <div className="xl:w-5/12 w-full">
        <div className="bg-white dark:bg-gray-700 shadow-lg rounded-xl my-5">
          <div className="p-5">
            <div className="text-center mb-4">
              <h1 className="text-xl font-bold text-gray-500  dark:text-blue-400">
                {title}
              </h1>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
