import Error from "./Error";

export default function InputForm({
  fieldType,
  fieldName,
  placeholder,
  labelText,
  formik,
}) {
  return (
    <>
      <input
        id={fieldName}
        type={fieldType}
        name={fieldName}
        className="w-full p-3 border text-black dark:text-white border-gray-300 rounded-full placeholder:text-gray-800 dark:placeholder:text-white dark:bg-gray-500"
        placeholder={placeholder}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[fieldName]}
        autoComplete="off"
      />
      {formik.touched[fieldName] && formik.errors[fieldName] && (
        <Error message={formik.errors[fieldName]} />
      )}
    </>
  );
}
