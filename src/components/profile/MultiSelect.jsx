//Libraries
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useQuery } from "@tanstack/react-query";

//Context
import { useThemeProvider } from "../../context/ThemeContext";

//API
import { getAllProfiles } from "../../service/ProfileAPI";

const MultiSelect = ({ selectedPerfiles, onSelect }) => {
  const { currentTheme } = useThemeProvider();
  const animatedComponents = makeAnimated();

  const { data } = useQuery({
    queryKey: ["getAllProfiles"],
    queryFn: getAllProfiles,
  });

  const options = data
    ? data.map((item) => ({
        label: item.nombre,
        value: item.id,
      }))
    : [];

  const handleChange = (selectedOptions) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    onSelect(selectedValues);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: currentTheme === 'dark' ? '#E5E7EB' : '#fff', // Color de fondo del campo de selección
      borderColor: "#BFC4CD",        // Color del borde
      color: "#000",              // Color del texto
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#ccc" : "#fff", // Fondo de opción cuando está enfocada
      color: "#333",             // Color del texto de cada opción
      "&:hover": {
        backgroundColor: "#ddd", // Fondo de opción al pasar el mouse
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#333",   // Color de fondo del valor seleccionado
      color: "#fff",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#fff",             // Color del texto en el valor seleccionado
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#fff",
      ":hover": {
        backgroundColor: "#555", // Color de fondo del botón de eliminar al pasar el mouse
        color: "white",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#000",             // Color del texto del placeholder
    }),
  };

  return (
    <Select
      options={options}
      isMulti
      value={options.filter((option) => selectedPerfiles.includes(option.value))}
      onChange={handleChange}
      placeholder="Selecciona un perfil"
      components={animatedComponents}
      styles={customStyles} 
    />
  );
};

export default MultiSelect;
