import { getAllLevels } from "../../service/LevelAPI";
import { useQuery } from "@tanstack/react-query";

export default function SelectLevel({ selectedLevel, onSelectLevel }) {
  const { data } = useQuery({
    queryKey: ["getAllLevels"],
    queryFn: getAllLevels,
  });

  return (
    <select value={selectedLevel} onChange={onSelectLevel} className="w-full rounded-lg border-gray-300 text-black dark:bg-gray-200">
      <option value="" style={{ color: "black" }}>Seleccione un nivel de acceso</option>
      {data &&
        data.map((level) => (
          <option key={level.id} value={level.id} style={{ color: "black" }}>
            {level.nivel}
          </option>
        ))}
    </select>
  );
}
