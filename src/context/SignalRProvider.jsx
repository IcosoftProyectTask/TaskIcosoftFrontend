// src/context/SignalRProvider.jsx
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { toast } from 'react-toastify';
import { useTaskContext } from './TaskContext';

const SignalRContext = createContext();

export const useSignalR = () => useContext(SignalRContext);

// Función para asegurar que la tarea tenga la estructura correcta
const ensureTaskStructure = (task) => {
  if (!task) return null;
  
  const priorityNamesMap = {
    1: "Alta",
    2: "Media", 
    3: "Baja"
  };

  const statusNamesMap = {
    1: "Pendiente",
    2: "En Progreso",
    3: "Completado"
  };
  
  return {
    ...task,
    // Asegurar que priority exista
    priority: task.priority || {
      idPriority: task.idPriority || 1,
      name: task.idPriority ? priorityNamesMap[task.idPriority] || "Media" : "Media"
    },
    // Asegurar que statusTask exista
    statusTask: task.statusTask || {
      idStatus: task.idStatus || 1,
      name: task.idStatus ? statusNamesMap[task.idStatus] || "Pendiente" : "Pendiente"
    },
    // Asegurar que user exista
    user: task.user || {
      idUser: task.idUser || 1,
      name: "Usuario",
      firstSurname: ""
    }
  };
};

export const SignalRProvider = ({ children }) => {
  const connectionRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const { tasks, setTasks, refreshData } = useTaskContext();

  useEffect(() => {
    // Crear la conexión al Hub de SignalR solo si no existe
    if (!connectionRef.current) {
      const newConnection = new HubConnectionBuilder()
        .withUrl('http://localhost:5272/taskHub')
        .withAutomaticReconnect()
        .build();
      
      connectionRef.current = newConnection;
    }

    // Iniciar la conexión solo si está en estado Disconnected
    const startConnection = async () => {
      try {
        if (connectionRef.current.state === HubConnectionState.Disconnected) {
          await connectionRef.current.start();
          console.log('Conectado al Hub de SignalR');
          setIsConnected(true);
          
          // Configurar listeners solo después de conectarse exitosamente
          setupSignalRListeners();
        }
      } catch (err) {
        console.error('Error al conectar al Hub:', err);
        // Reintentamos la conexión después de un tiempo
        setTimeout(startConnection, 5000);
      }
    };

    const setupSignalRListeners = () => {
      // Escuchar evento de creación de tareas
      connectionRef.current.on('TaskCreated', (task) => {
        console.log('Nueva tarea creada (original):', task);
        
        // Transformar la tarea para asegurar que tenga la estructura correcta
        const transformedTask = ensureTaskStructure(task);
        console.log('Nueva tarea transformada:', transformedTask);
        
        // Agregar la tarea transformada al estado
        setTasks(prevTasks => [...prevTasks, transformedTask]);
        toast.info(`Nueva tarea creada: ${task.title}`);
      });

      // Escuchar eventos de actualización de tareas
      connectionRef.current.on('TaskUpdated', (taskId) => {
        console.log(`Tarea ${taskId} fue actualizada`);
        // Actualizar la lista de tareas
        refreshData();
      });

      // Escuchar eventos de reasignación de tareas
      connectionRef.current.on('TaskReassigned', (taskId) => {
        console.log(`Tarea ${taskId} fue reasignada`);
        // Actualizar la lista de tareas
        refreshData();
      });

      // Escuchar eventos de eliminación de tareas
      connectionRef.current.on('TaskDeleted', (taskId) => {
        console.log(`Tarea ${taskId} fue eliminada`);
        // Eliminar la tarea de la lista sin recargar todo
        setTasks(prevTasks => prevTasks.filter(task => task.idSupportTask !== taskId));
      });

      // Escuchar eventos de cambio de estado de tareas
      connectionRef.current.on('TaskStatusChanged', (taskId, newStatus) => {
        console.log(`Estado de la tarea ${taskId} cambió a ${newStatus.name}`);
        // Actualizar el estado de la tarea específica en la lista
        setTasks(prevTasks => prevTasks.map(task => {
          if (task.idSupportTask === taskId) {
            return { ...task, statusTask: newStatus };
          }
          return task;
        }));
      });
    };

    startConnection();

    // Limpiar la conexión al desmontar el componente
    return () => {
      if (connectionRef.current && connectionRef.current.state !== HubConnectionState.Disconnected) {
        connectionRef.current.stop();
        setIsConnected(false);
      }
    };
  }, [refreshData, setTasks]);

  return (
    <SignalRContext.Provider value={{ connection: connectionRef.current, isConnected }}>
      {children}
    </SignalRContext.Provider>
  );
};

export default SignalRContext;