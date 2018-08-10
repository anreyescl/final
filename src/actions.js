import axios from "./Axios";

export async function receiveUsers() {
    const { data } = await axios.get("/allUsers");
    console.log("actions Receive data", data);
    console.log("actions Receive data.users", data.users);
    return {
        type: "RECEIVE_USERS",
        users: data.users
    };
}

export async function actionCommonUsers(id) {
    const { data } = await axios.get("/commonUsers/" + id);
    console.log("actions commonUsers data.users", data.commonUsers);
    return {
        type: "COMMON_USERS",
        commonUsers: data.commonUsers
    };
}

export async function makeFriend(id) {
    const x = await axios.post(`/accept/${id}.json`);
    return {
        type: "MAKE_FRIEND",
        id
    };
}

export async function endFriend(id) {
    const x = await axios.post(`/terminate/${id}.json`);
    return {
        type: "END_FRIEND",
        id
    };
}

export async function rejectFriend(id) {
    const x = await axios.post(`/reject/${id}.json`);
    return {
        type: "REJECT_FRIEND",
        id
    };
}

export async function unrejectFriend(id) {
    const x = await axios.post(`/unreject/${id}.json`);
    return {
        type: "UNREJECT_FRIEND",
        id
    };
}

export async function actionOnlineUsers(data) {
    return {
        type: "ONLINE_USERS",
        data
    };
}

export async function actionUserJoined(data) {
    return {
        type: "USER_JOINED",
        data
    };
}

export async function actionUserLeft(data) {
    return {
        type: "USER_LEFT",
        data
    };
}

export async function actionListMessages(data) {
    return {
        type: "LIST_MESSAGES",
        data
    };
}

export async function actionUserMessage(data) {
    return {
        type: "USER_MESSAGE",
        data
    };
}
