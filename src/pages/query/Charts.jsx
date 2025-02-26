/*
//Libraries
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

//Components
import Spinner from "../../components/Spinner";
import CustomTable from "../../components/query/CustomTable";
import { columnsQuery } from "../../components/reactTable/Colums";
import ModalVisibility from "../../components/query/ModalVisibility";

//Context
import { useUserContext } from "../../context/UserContext";

//API
import { getAllQuerys, deleteQuery } from "../../service/QueryAPI";

//assets/Utils
import { ToastSuccess, ToastError } from "../../assets/js/Toastify";
import { SweetAlertEliminar } from "../../assets/js/sweetAlert.js";
import { processHierarchicalData } from "../../utils/Utils";

export default function Charts() {
  const [hierarchicalData, setHierarchicalData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["getAllQuerys"],
    queryFn: getAllQuerys,
  });

  const { mutate } = useMutation({
    mutationFn: deleteQuery,
    onError: () => {
      ToastError("Ocurrió un error al eliminar la consulta");
    },
    onSuccess: () => {
      ToastSuccess("Se ha eliminado la consulta correctamente");
      queryClient.invalidateQueries(["getAllQuerys"]);
    },
  });

  const handleDelete = (row) => {
    SweetAlertEliminar(
      `Estas seguro que deseas eliminar esta consulta ${row.nombre}`,
      () => {
        mutate(row.id);
      }
    );
  };

  const columns = columnsQuery();
  const { userInfo } = useUserContext();

  useEffect(() => {
    const processedData = processHierarchicalData(data);
    setHierarchicalData(processedData);
  }, [data]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {isLoading && <Spinner open={true} />}
      <h1 className="text-2xl md:text-3xl text-gray-500 dark:text-blue-400  font-bold">
        Gráficas
      </h1>
      <div className="mt-5">
        <CustomTable
          columns={columns}
          data={hierarchicalData || []}
          role={userInfo.rol}
          title={"Nueva consulta"}
          openModal={openModal}
          handleDelete={handleDelete}
        />
      </div>
      <ModalVisibility isOpen={isModalOpen} onClose={closeModal} title />
    </>
  );
}
*/