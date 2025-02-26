import { useDropzone } from "react-dropzone";
import { useState } from "react";

export default function Analyze() {
  const [file, setFile] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".csv",
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
  });

  return (
    <>
      <h1 className="text-2xl md:text-3xl text-gray-500 dark:text-blue-400  font-bold">
        Análisis
      </h1>
      <div className="mt-5">
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300 dark:border-gray-700 p-10 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <input {...getInputProps()} />
          {file ? (
            <p>{file.name}</p>
          ) : (
            <p>
              Arrastra y suelta el archivo CSV aquí o haz clic para seleccionar
            </p>
          )}
        </div>
      </div>
    </>
  );
}
