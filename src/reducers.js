export default function(state = {}, action) {
    if (action.type == "RECEIVE_USERS") {
        state = {
            ...state,
            users: action.users
        };
    }

    if (action.type == "COMMON_USERS") {
        state = {
            ...state,
            commonUsers: action.commonUsers
        };
    }
    if (action.type == "MAKE_FRIEND") {
        state = {
            ...state,
            users: state.users.map(user => {
                if (user.id == action.id) {
                    return {
                        ...user,
                        status: 2
                    };
                } else {
                    return user;
                }
            })
        };
    }

    if (action.type == "END_FRIEND") {
        state = {
            ...state,
            users: state.users.map(user => {
                if (user.id == action.id) {
                    return {
                        ...user,
                        status: 0
                    };
                } else {
                    return user;
                }
            })
        };
    }

    if (action.type == "REJECT_FRIEND") {
        state = {
            ...state,
            users: state.users.map(user => {
                if (user.id == action.id) {
                    return {
                        ...user,
                        status: 3
                    };
                } else {
                    return user;
                }
            })
        };
    }

    if (action.type == "UNREJECT_FRIEND") {
        state = {
            ...state,
            users: state.users.map(user => {
                if (user.id == action.id) {
                    return {
                        ...user,
                        status: 1
                    };
                } else {
                    return user;
                }
            })
        };
    }

    if (action.type == "ONLINE_USERS") {
        state = {
            ...state,
            reduxOnlineUsers: action.data
        };
    }

    if (action.type == "USER_JOINED") {
        state = {
            ...state,
            reduxOnlineUsers: [...state.reduxOnlineUsers, action.data]
        };
    }

    if (action.type == "USER_LEFT") {
        state = {
            ...state,
            reduxOnlineUsers: state.reduxOnlineUsers.filter(
                user => user.id != action.data.id
            )
        };
    }

    if (action.type == "LIST_MESSAGES") {
        state = {
            ...state,
            reduxUserMessages: action.data
        };
    }

    if (action.type == "USER_MESSAGE") {
        state = {
            ...state,
            reduxUserMessages: [...state.reduxUserMessages, action.data]
        };
    }

    return state;
}
