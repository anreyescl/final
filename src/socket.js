import * as io from "socket.io-client";
import {
    actionOnlineUsers,
    actionUserJoined,
    actionUserLeft,
    actionListMessages,
    actionUserMessage
} from "./actions";

let socket;

export function init(store) {
    if (!socket) {
        socket = io.connect();

        socket.on("socketOnlineUsers", data => {
            store.dispatch(actionOnlineUsers(data));
        });

        socket.on("socketUserJoined", data => {
            store.dispatch(actionUserJoined(data));
        });

        socket.on("socketUserLeft", data => {
            store.dispatch(actionUserLeft(data));
        });

        socket.on("socketListMessages", data => {
            store.dispatch(actionListMessages(data));
        });

        socket.on("socketUserMessage", data => {
            console.log("socket socketusermessage data", data);
            store.dispatch(actionUserMessage(data));
        });
    }
}

export function emitChatMessage(message) {
    console.log("message from socket emitchatmessage", message);
    socket.emit("chatMessage", message);
}
