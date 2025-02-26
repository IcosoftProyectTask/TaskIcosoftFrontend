/*
//Libraries
import { useQuery } from "@tanstack/react-query";

//Components
import CustomTable from "../../components/reactTable/CustomTable";
import { columnsUsers } from "../../components/reactTable/Colums";
import Spinner from "../../components/Spinner";

//API
import { getAll } from "../../service/UserAPI";

//Context
import { useUserContext } from "../../context/UserContext";

export default function ActiveUsers() {
  const { data, isLoading } = useQuery({
    queryKey: ["getAllUsers"],
    queryFn: getAll,
  });

  const columns = columnsUsers();
  const { userInfo } = useUserContext();

  return (
    <>
      {isLoading && <Spinner open={true} />}
      <h1 className="text-xl md:text-2xl text-gray-500 dark:text-blue-400  font-bold">
        Cuentas activas
      </h1>
      <div className="mt-5">
        <CustomTable columns={columns} data={data || []} role={userInfo.rol} title={"Nuevo usuario"} />
      </div>
    </>
  );
}
  */