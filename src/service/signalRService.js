// src/service/signalRService.js
import * as signalR from "@microsoft/signalr";

class SignalRService {
  constructor() {
    this.connection = null;
    this.connectionAttempts = 0;
    this.callbacks = {
      onReceiveNewComment: null,
      onReceiveNewReply: null,
      onReceiveCommentUpdate: null,
      onReceiveReplyUpdate: null,
      onReceiveCommentDeletion: null,
      onReceiveReplyDeletion: null,
      onJoinedGroup: null
    };
    this.currentTaskGroup = null;
  }

  // Iniciar la conexión con el hub de SignalR
  async startConnection(accessToken, taskId = null) {
    if (this.connection) {
      // Si ya hay una conexión activa y tenemos un taskId
      if (taskId && this.connection.state === signalR.HubConnectionState.Connected) {
        // Intentar unirse al grupo directamente
        await this.joinTaskGroup(taskId);
      }
      return;
    }

    this.connectionAttempts++;
    this.pendingTaskId = taskId; // Almacenar el taskId para unirse después de conectar
    
    const backendUrl = process.env.REACT_APP_API_URL || "http://192.168.1.124:5297";
    
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${backendUrl}/commentsHub`, { 
        accessTokenFactory: () => accessToken
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 15000, 30000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Manejar el evento de conexión establecida
    this.connection.onreconnected(async () => {
      console.log("SignalR reconectado");
      this.registerHandlers();
      
      // Volver a unirse al grupo si hay uno pendiente
      if (this.pendingTaskId) {
        await this.joinTaskGroup(this.pendingTaskId);
      }
    });

    try {
      await this.connection.start();
      console.log("SignalR conectado exitosamente");
      this.connectionAttempts = 0;
      this.registerHandlers();
      
      // Unirse al grupo si hay uno pendiente
      if (this.pendingTaskId) {
        await this.joinTaskGroup(this.pendingTaskId);
      }
    } catch (error) {
      console.error("Error al conectar con SignalR:", error);
      // Reintentar después de un tiempo
      setTimeout(() => this.startConnection(accessToken, taskId), 2000);
    }
  }

  // Unirse al grupo de una tarea específica
  async joinTaskGroup(taskId) {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      console.warn("No se puede unir al grupo: la conexión no está activa");
      this.pendingTaskId = taskId; // Guardar para unirse más tarde
      return false;
    }

    try {
      console.log(`Intentando unirse al grupo: Task_${taskId}`);
      await this.connection.invoke("JoinTaskGroup", taskId);
      console.log(`Unido al grupo de tarea: Task_${taskId}`);
      this.currentTaskGroup = taskId;
      this.pendingTaskId = null; // Limpiar el pendiente
      return true;
    } catch (error) {
      console.error("Error al unirse al grupo de tarea:", error);
      return false;
    }
  }

  // Salir del grupo de una tarea específica
  async leaveTaskGroup(taskId) {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      return;
    }

    try {
      await this.connection.invoke("LeaveTaskGroup", taskId);
      console.log(`Salido del grupo de tarea: Task_${taskId}`);
      if (this.currentTaskGroup === taskId) {
        this.currentTaskGroup = null;
      }
    } catch (error) {
      console.error("Error al salir del grupo de tarea:", error);
    }
  }

  // Detener la conexión
  async stopConnection() {
    if (this.connection) {
      try {
        // Asegurarse de salir del grupo actual antes de desconectar
        if (this.currentTaskGroup) {
          await this.leaveTaskGroup(this.currentTaskGroup);
        }
        
        await this.connection.stop();
        console.log("SignalR desconectado");
        this.connection = null;
      } catch (error) {
        console.error("Error al desconectar SignalR:", error);
      }
    }
  }

  // Registrar eventos
  registerHandlers() {
    if (!this.connection) return;

    // Evento para nuevo comentario
    this.connection.on("ReceiveNewComment", (comment) => {
      console.log("Nuevo comentario recibido:", comment);
      if (this.callbacks.onReceiveNewComment) {
        this.callbacks.onReceiveNewComment(comment);
      }
    });

    // Evento para nueva respuesta
    this.connection.on("ReceiveNewReply", (reply) => {
      console.log("Nueva respuesta recibida:", reply);
      if (this.callbacks.onReceiveNewReply) {
        this.callbacks.onReceiveNewReply(reply);
      }
    });

    // Evento para actualización de comentario
    this.connection.on("ReceiveCommentUpdate", (comment) => {
      console.log("Actualización de comentario recibida:", comment);
      if (this.callbacks.onReceiveCommentUpdate) {
        this.callbacks.onReceiveCommentUpdate(comment);
      }
    });

    // Evento para actualización de respuesta
    this.connection.on("ReceiveReplyUpdate", (reply) => {
      console.log("Actualización de respuesta recibida:", reply);
      if (this.callbacks.onReceiveReplyUpdate) {
        this.callbacks.onReceiveReplyUpdate(reply);
      }
    });

    // Evento para eliminación de comentario
    this.connection.on("ReceiveCommentDeletion", (commentId) => {
      console.log("Eliminación de comentario recibida:", commentId);
      if (this.callbacks.onReceiveCommentDeletion) {
        this.callbacks.onReceiveCommentDeletion(commentId);
      }
    });

    // Evento para eliminación de respuesta
    this.connection.on("ReceiveReplyDeletion", (replyId) => {
      console.log("Eliminación de respuesta recibida:", replyId);
      if (this.callbacks.onReceiveReplyDeletion) {
        this.callbacks.onReceiveReplyDeletion(replyId);
      }
    });

    // Evento para confirmación de unirse a un grupo
    this.connection.on("JoinedGroup", (groupName) => {
      console.log(`Unido al grupo: ${groupName}`);
      if (this.callbacks.onJoinedGroup) {
        this.callbacks.onJoinedGroup(groupName);
      }
    });
  }

  // Establecer callbacks para los eventos
  onReceiveNewComment(callback) {
    this.callbacks.onReceiveNewComment = callback;
  }

  onReceiveNewReply(callback) {
    this.callbacks.onReceiveNewReply = callback;
  }

  onReceiveCommentUpdate(callback) {
    this.callbacks.onReceiveCommentUpdate = callback;
  }

  onReceiveReplyUpdate(callback) {
    this.callbacks.onReceiveReplyUpdate = callback;
  }

  onReceiveCommentDeletion(callback) {
    this.callbacks.onReceiveCommentDeletion = callback;
  }

  onReceiveReplyDeletion(callback) {
    this.callbacks.onReceiveReplyDeletion = callback;
  }

  onJoinedGroup(callback) {
    this.callbacks.onJoinedGroup = callback;
  }
}

// Singleton para tener una única instancia del servicio
const signalRService = new SignalRService();
export default signalRService;