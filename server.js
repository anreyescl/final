const express = require("express");
const app = express();
const compression = require("compression");
const db = require("./db/db");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const bc = require("./config/bcrypt");
const csurf = require("csurf");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const config = require("./config");
const chalk = require("chalk");

const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(cookieParser());

app.use(csurf());
app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(express.static("public"));
app.use(compression());

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.post("/registration", (req, res) => {
    console.log("req.body", req.body);
    console.log("registration page");
    var passDB = "";
    if (
        req.body.firstName == "" ||
        req.body.lastName == "" ||
        req.body.email == "" ||
        req.body.password == ""
    ) {
        console.log("something is missing");
        res.json({
            error: "missing fields"
        });
    } else {
        console.log("going to the db now");
        db.checkEmail(req.body.email)
            .then(result => {
                if (result == undefined) {
                    bc.hashPassword(req.body.password).then(hashedPassword => {
                        console.log("hashed password", hashedPassword);
                        passDB = hashedPassword;
                        db.registerUser(
                            req.body.firstName,
                            req.body.lastName,
                            req.body.email,
                            passDB
                        ).then(registeredUser => {
                            console.log("register success", registeredUser);
                            req.session.UserId = registeredUser.id;
                            req.session.FirstName = registeredUser.first_name;
                            req.session.LastName = registeredUser.last_name;
                            req.session.Email = registeredUser.email;
                            console.log("req.session", req.session);
                            res.json({
                                success: true
                            });
                        });
                    });
                } else {
                    res.json({
                        error: "duplicate email"
                    });
                } //end of internal else
            })
            .catch(err => console.log(err));
    } //end of else
});

app.post("/newsource", (req, res) => {
    console.log("/newsource   req.body", req.body);
    var passDB = "";
    if (
        req.body.source_name == "" ||
        req.body.source_contact_id == "" ||
        req.body.total_hours == ""
    ) {
        console.log("Some mandatory information is missing");
        res.json({
            error: "Mandatory fields are missing"
        });
    } else {
        db.registerSource(
            req.body.source_name,
            req.body.source_contact_id,
            req.body.description,
            req.body.total_hours,
            req.session.UserId
        ).then(registeredSource => {
            res.json({
                success: true
            });
        });
    }
});

app.get("/sourceslist", function(req, res) {
    console.log("server get/sourceslist");
    db.getSources(req.params.id).then(result => {
        console.log("result for sources", result);
        res.json({
            success: true,
            sourcesList: result
        });
    });
});

app.post("/newrequest", (req, res) => {
    console.log("/newrequest   req.body", req.body);
    var passDB = "";
    if (
        req.body.subject == "" ||
        req.body.business_questions == "" ||
        req.body.preferred_source == "" ||
        req.body.preferred_analyst == "" ||
        req.body.background_report == "" ||
        req.body.severity_level == "" ||
        req.body.requested_hours == "" ||
        req.body.deadline == ""
    ) {
        console.log("Some mandatory information is missing");
        res.json({
            error: "Mandatory fields are missing"
        });
    } else {
        db.registerRequest(
            req.body.subject,
            req.body.business_questions,
            req.body.preferred_source,
            req.body.preferred_analyst,
            req.body.background_report,
            req.body.severity_level,
            req.body.requested_hours,
            req.body.deadline,
            req.session.UserId
        ).then(newRequest => {
            res.json({
                success: true
            });
        });
    }
});

app.post("/updaterequest/:id", function(req, res) {
    console.log(
        "update request id, server",
        req.params.id,
        req.body.request_status,
        req.body.commited_hours,
        req.body.actual_hours
    );
    db.updateRequest(
        req.params.id,
        req.body.request_status,
        req.body.commited_hours,
        req.body.actual_hours
    ).then(result => {
        console.log("result from updated request", result);
        res.json({
            success: true
        });
    });
});

app.get("/requestslist/:page", function(req, res) {
    console.log("server get/requestslist");
    db.getRequests(req.session.UserId, req.session.admin, req.params.page).then(
        result => {
            res.json({
                success: true,
                requestsList: result
            });
        }
    );
});

app.get("/request/:id", function(req, res) {
    console.log("server get request/:id");
    db.getSingleRequest(req.params.id).then(result => {
        console.log("result for single request", result);
        res.json({
            success: true,
            request: result
        });
    });
});

app.post("/login", (req, res) => {
    db.getUserbyEmail(req.body.email).then(userInfo => {
        if (userInfo && userInfo.email) {
            bc.checkPassword(req.body.password, userInfo.hashed_password)
                .then(passwordsMatch => {
                    if (passwordsMatch) {
                        req.session.UserId = userInfo.id;
                        req.session.FirstName = userInfo.first_name;
                        req.session.LastName = userInfo.last_name;
                        req.session.Email = userInfo.email;
                        req.session.admin = userInfo.admin;
                        res.json({
                            success: true
                        });
                    } else {
                        res.json({
                            success: false,
                            error: "Wrong password"
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.json({
                        success: false,
                        error: "Wrong password"
                    });
                });
        } else {
            res.json({
                success: false,
                error: "Email not found"
            });
        }
    });
});

app.get("/welcome", function(req, res) {
    console.log(" get for /, is there an id?", req.session.UserId);
    if (req.session.UserId) {
        console.log(
            "if-get /welcome, req.session.UserId found so redirecting to /login"
        );
        res.redirect("/");
    } else {
        console.log("else- get /welcome,req.session.UserId NOT found ");
        res.sendFile(__dirname + "/index.html");
    }
});

///need to add function "makeSureUserIsLoggedIn" as middleware

app.get("/user", function(req, res) {
    db.getUserbyId(req.session.UserId)
        .then(user => {
            console.log("returned user get/user", user);
            res.json({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                profile_pic: user.profile_pic,
                bio: user.bio,
                admin: user.admin
            });
        })
        .catch(err => console.log(err));
});

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    console.log("req body is", req.body, "req file is", req.file);
    db.updateProfilePic(
        req.session.UserId,
        config.s3Url + req.file.filename
    ).then(result => {
        console.log("result from app.post upload", result.profile_pic);
        res.json({
            success: true,
            image: result.profile_pic
        });
    });
});

app.post("/update-bio", function(req, res) {
    console.log("req body.bio", req.body.bio);
    console.log("req.body", req.body);
    db.updateBio(req.session.UserId, req.body.bio).then(result => {
        console.log("result from app.post update bio", result);
        res.json({
            success: true,
            bio: result.bio
        });
    });
});

app.get("/user/:id.info", function(req, res) {
    console.log("server get/user/:id.info, req.params.id=", req.params.id);
    console.log();
    if (req.session.UserId == req.params.id) {
        res.json({
            redirect: "/"
        });
    } else {
        db.getUserbyId(req.params.id).then(user => {
            console.log("result for user profile", user);
            res.json({
                success: true,
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                profile_pic: user.profile_pic,
                bio: user.bio
            });
        });
    }
});

//////

app.get("/friendstatus/:id.json", (req, res) => {
    console.log("server get friend status");
    console.log(
        "server get friend status req.session.UserId",
        req.session.UserId
    );
    db.getCurrentStatus(req.session.UserId, req.params.id)
        .then(data => {
            console.log(
                "req.session.user.id: ",
                req.session.UserId,
                " req.params.id: ",
                req.params.id
            );
            console.log("current status (during get server): ", data);
            res.json(
                data && {
                    sessionUserId: req.session.UserId,
                    status: data.status,
                    senderId: data.sender_id,
                    receiverId: data.receiver_id
                }
            );
        })
        .catch(err => {
            console.log(err);
            res.json({
                sessionUserId: req.session.UserId,
                status: false
            });
        });
});

app.post("/friendstatus/:id.json", (req, res) => {
    db.setStatus(req.session.UserId, req.params.id)
        .then(result => {
            console.log("current status (evfd): ", result);
            res.json({
                sessionUserId: req.session.UserId,
                status: 2
            });
        })
        .catch(err => {
            console.log(err);
            res.json({
                sessionUserId: req.session.UserId,
                status: false
            });
        });
});

app.post("/terminate/:id.json", (req, res) => {
    console.log("beggining of delete post in server");
    db.deleteFriend(req.session.UserId, req.params.id)
        .then(result => {
            console.log("Status deleted (friendship terminated): ", result);
            res.json({
                sessionUserId: req.session.UserId,
                status: false
            });
        })
        .catch(err => {
            console.log(err);
            res.json({
                sessionUserId: req.session.UserId,
                status: false
            });
        });
});

app.post("/accept/:id.json", (req, res) => {
    console.log("beggining of accept post in server");
    db.acceptFriend(req.session.UserId, req.params.id)
        .then(result => {
            console.log("Status accepted (friendship accepted): ", result);
            res.json({
                sessionUserId: req.session.UserId,
                status: 2
            });
        })
        .catch(err => {
            console.log(err);
            res.json({
                sessionUserId: req.session.UserId,
                status: 2
            });
        });
});

app.post("/reject/:id.json", (req, res) => {
    console.log("beggining of reject post in server");
    db.rejectFriend(req.session.UserId, req.params.id)
        .then(result => {
            console.log("Status rejected: ", result);
            res.json({
                sessionUserId: req.session.UserId,
                status: 3
            });
        })
        .catch(err => {
            console.log(err);
            res.json({
                sessionUserId: req.session.UserId,
                status: false
            });
        });
});

app.post("/unreject/:id.json", (req, res) => {
    console.log("beggining of unreject post in server");
    db.unrejectFriend(req.session.UserId, req.params.id)
        .then(result => {
            console.log("Status unrejected: ", result);
            res.json({
                sessionUserId: req.session.UserId,
                status: 1
            });
        })
        .catch(err => {
            console.log(err);
            res.json({
                sessionUserId: req.session.UserId,
                status: false
            });
        });
});

/////

app.get("/allUsers", (req, res) => {
    console.log("beggining of get for allUsers");
    db.getAllUsers(req.session.UserId)
        .then(result => {
            console.log("Server result for get AllUsers): ", result);
            res.json({
                success: true,
                users: result
            });
        })
        .catch(err => {
            console.log(err);
            res.json({
                success: false
            });
        });
});

app.get("/commonUsers/:id", (req, res) => {
    let dataCommonUsers = [];
    console.log("beggining of get for commonUsers");
    db.getCommonUsers(req.session.UserId, req.params.id)
        .then(result => {
            console.log("Server result for get commonUsers): ", result);
            result.forEach(function(friendship) {
                var i = friendship.sender_id;
                dataCommonUsers.push(i);
                var j = friendship.receiver_id;
                dataCommonUsers.push(j);
            });
            dataCommonUsers = dataCommonUsers.filter(
                id => id != req.session.UserId && id != req.params.id
            );

            var duplicatedArray = function(arrArg) {
                return arrArg.filter(function(elem, pos, arr) {
                    console.log(pos, elem, arr.indexOf(elem), arr);
                    return arr.indexOf(elem) != pos;
                });
            };
            commonUsers = duplicatedArray(dataCommonUsers);
            console.log("commonUsers list", commonUsers);

            db.getMultipleUsersbyId(commonUsers).then(data => {
                res.json({
                    success: true,
                    commonUsers: data
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.json({
                success: false
            });
        });
});

app.post("/postmessage", (req, res) => {
    console.log("server postmessage post, data=", req.body);
    db.postMessage(req.body).then(result => {
        console.log("server,result from posting message", result[0]);
        res.json({
            success: true,
            posts: result[0]
        });
    });
});

app.get("/posts/:id.info", function(req, res) {
    console.log("server get/posts/:id.info, req.params.id=", req.params.id);
    db.getPosts(req.params.id).then(result => {
        console.log("result for posts profile", result);
        res.json({
            success: true,
            posts: result
        });
    });
});

app.get("/welcome", (req, res) => {
    if (req.session.UserId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/welcome");
});

app.get("*", function(req, res) {
    if (!req.session.UserId) {
        console.log("All pages * with userId NOT in the session");
        res.redirect("/welcome");
    } else {
        console.log("All pages * with userId in the session");
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(8080);

let onlineUsers = {};
let chatMessages = [];

io.on("connection", function(socket) {
    console.log(`socket with the id ${socket.id} is now connected`);
    let SocketUserId = socket.request.session.UserId;
    onlineUsers[socket.id] = SocketUserId;

    socket.emit("socketListMessages", chatMessages);

    db.getMultipleUsersbyId(Object.values(onlineUsers)).then(data => {
        socket.emit("socketOnlineUsers", data);
    });

    if (
        Object.values(onlineUsers).filter(id => id == SocketUserId).length == 1
    ) {
        db.getUserbyId(SocketUserId).then(data => {
            socket.broadcast.emit("socketUserJoined", data);
        });
    }

    socket.on("disconnect", function() {
        if (
            Object.values(onlineUsers).filter(id => id == SocketUserId)
                .length == 1
        ) {
            db.getUserbyId(SocketUserId).then(data => {
                socket.broadcast.emit("socketUserLeft", data); //todos menos el que pidioo
            });
        }
    });

    socket.on("socketListMessages", function(data) {
        console.log("socketlistmessages", data);
        socket.emit("socketUserMessage", data); // solo para el que pidio
    });

    socket.on("chatMessage", function(data) {
        console.log("new chat message", data);
        let newMessage = {
            message: data.message,
            UserId: socket.request.session.UserId,
            profile_pic: data.profile_pic,
            first_name: data.first_name,
            last_name: data.last_name,
            date: Date()
        };
        chatMessages = [...chatMessages, newMessage];
        console.log("emited chat messages", chatMessages);
        io.sockets.emit("socketUserMessage", newMessage); ///todo el mundo
    });
});
