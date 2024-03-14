/**通过使用 as 关键字，可以避免混淆 socket.io 的 Server 类和 http 模块的 Server 类。这样，您可以清楚地区分它们，并在代码中以别名引用。这是 TypeScript 和 ES6 JavaScript 模块语法的一个特性，使得从一个模块中导入多个同名的导出变得容易。 */

import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import  registerEventHandlers  from '../events/index';

export const setupWebSocketServer = (httpServer: HttpServer): SocketIOServer => {
  const io = new SocketIOServer(httpServer, {
    // ...CORS 配置等...
    cors: {
        origin: "http://localhost:3000", // 这里应设置为您的前端应用的实际来源
        methods: ["GET", "POST"],
        credentials: true, // 如果您的前端请求包含凭证信息，如cookies
      },
  });

  io.on('connection', (socket) => {
    console.log('Client connected');
    registerEventHandlers(socket);
  });

  return io;
};
