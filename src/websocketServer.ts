// src/websocketServer.ts
/**通过使用 as 关键字，可以避免混淆 socket.io 的 Server 类和 http 模块的 Server 类。这样，您可以清楚地区分它们，并在代码中以别名引用。这是 TypeScript 和 ES6 JavaScript 模块语法的一个特性，使得从一个模块中导入多个同名的导出变得容易。 */
import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';

import { KLineData } from "./models/chartData";

export function setupWebSocketServer(httpServer: HttpServer): SocketIOServer {
  // 创建一个新的 Socket.IO 服务器，并附加到现有的 HTTP 服务器上。
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "http://localhost:3000", // 这里应设置为您的前端应用的实际来源
      methods: ["GET", "POST"],
      credentials: true, // 如果您的前端请求包含凭证信息，如cookies
    },
  });

  // 监听新的客户端连接
  io.on('connection', (socket) => {
    console.log('Client connected');

    // 在这里，您可以监听socket对象上的事件，例如接收消息
    socket.on('requestData', (msg) => {
      console.log('Chat message received:', msg);
      // 广播消息给所有客户端，除了发送者
      socket.broadcast.emit('chat message', "广播数据");
    });

    // 监听断开连接的事件
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });

    // ... 这里可以添加更多的事件监听器 ...
  });

  // 返回 Socket.IO 服务器实例
  return io;
}
