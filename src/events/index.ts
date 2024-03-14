//存放事件处理逻辑websocket
import { Socket } from 'socket.io';
import { handleKLineData } from './kLineData'; //处理k线图的
import { handleChatMessage } from './chatMessages';//处理聊天的

export default function registerEventHandlers(socket: Socket) {
    socket.on('kLineDataRequest', (requestData) => { handleKLineData(socket, requestData) });  //监听前端 kLineDataRequest
    socket.on('chatMessage',(message)=>{handleChatMessage(socket,message)});
    // ...注册更多事件处理器...
}
