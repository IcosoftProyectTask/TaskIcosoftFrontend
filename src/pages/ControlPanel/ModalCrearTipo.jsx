import { useState } from "react";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { createType } from "../../service/TypesLicense";
import { useQueryClient } from "@tanstack/react-query";

const ModalCrearTipo = ({ tipo, onClose }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    if (!nombre.trim()) {
      toast.error("El nombre es requerido");
      return;
    }

    setIsSubmitting(true);
    
    const now = new Date().toISOString();
    const payload = {
      typeName: nombre,
      description: descripcion,
      createdAt: now,
      updatedAt: now,
      status: true,
    };

    try {
      await createType(payload);
      toast.success("Tipo creado con éxito");
      await queryClient.invalidateQueries(["tipos-activos"]);
      onClose();
    } catch (error) {
      console.error("Error creating type:", error);
      toast.error(error.message || "Error al crear el tipo");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white flex items-center gap-2">
            <span className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md">{tipo.icono}</span>
            Crear {tipo.nombre}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
            <Input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder={`Nombre del ${tipo.nombre.toLowerCase()}`}
              className="mt-1 bg-white text-gray-900 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
            <Textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción opcional"
              className="mt-1 bg-white text-gray-900 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCrearTipo;