// ModalSeleccionAccion.jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Button } from "../../components/ui/Button";

const ModalSeleccionAccion = ({ tipo, onCancel, onCrearNuevo, onVerExistentes }) => {
  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">
            ¿Qué deseas hacer con <span className="font-semibold">{tipo.nombre}</span>?
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <Button onClick={onCrearNuevo} className="w-full">
            Crear nuevo
          </Button>
          <Button variant="outline" onClick={onVerExistentes} className="w-full">
            Ver existentes
          </Button>
          <Button variant="ghost" onClick={onCancel} className="w-full text-gray-500">
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalSeleccionAccion;
