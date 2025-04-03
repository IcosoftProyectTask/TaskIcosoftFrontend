import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';

const TaskDetails = ({ task, getFormattedDate }) => {
  return (
    <div className="space-y-6">
      {/* Información de la tarea */}
      <Card className="shadow-md dark:bg-gray-900 border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium dark:text-white">
            Detalles de la tarea
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Categoría
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              {task.category}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Última actualización
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              {getFormattedDate(task.updatedAt)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Información del usuario creador */}
      <Card className="shadow-md dark:bg-gray-900 border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium dark:text-white">
            Personal Asignado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div>
              <p className="font-medium dark:text-white">
                {task.user.name} {task.user.firstSurname}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {task.user.email}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información de la empresa */}
      <Card className="shadow-md dark:bg-gray-900 border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium dark:text-white">
            Información de la empresa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Nombre comercial
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                {task.company.companyComercialName}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Nombre fiscal
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                {task.company.companyFiscalName}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Email
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                {task.company.email}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Teléfono
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                {task.company.companyPhone}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskDetails;