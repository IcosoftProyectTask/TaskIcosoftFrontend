//Libraries
import { useState } from "react";
import { Tooltip } from "@mui/material";

//Components
import { BiShow, BiHide } from "../Icons";
import Error from "./Error";

export default function InputFormPassword({
  fieldName,
  placeholder,
  labelText,
  formik,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative mb-4">
      {labelText && (
        <div className="mb-2">
          <label
            htmlFor={fieldName}
            className="text-gray-900 dark:text-gray-200"
          >
            {labelText}
          </label>
        </div>
      )}

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name={fieldName}
          id={fieldName}
          className="w-full p-3 border text-black dark:text-white border-gray-300 rounded-full placeholder:text-gray-800 dark:placeholder:text-white dark:bg-gray-500"
          placeholder={placeholder}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values[fieldName]}
          autoComplete="off"
        />

        <Tooltip
          placement="left"
          title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          <div
            className="absolute right-4 top-1/2  -translate-y-1/2 text-gray-500 dark:text-gray-300 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <BiHide /> : <BiShow />}
          </div>
        </Tooltip>
      </div>

      {formik.touched[fieldName] && formik.errors[fieldName] && (
        <Error message={formik.errors[fieldName]} />
      )}
    </div>
  );
}
