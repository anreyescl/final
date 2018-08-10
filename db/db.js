var spicedPg = require("spiced-pg");

let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    db = spicedPg("postgres:are:postgres@localhost:5432/socialnetwork");
}

exports.registerUser = function(firstName, lastName, email, hashedPassword) {
    const q = `
          INSERT INTO users (first_name, last_name, email, hashed_password)
          VALUES ($1, $2, $3, $4)
          RETURNING *
    `;
    const params = [firstName, lastName, email, hashedPassword];
    return db.query(q, params).then(results => {
        console.log("registered user completed");
        return results.rows[0];
    });
};

exports.returnAllUsers = function() {
    console.log("db return all users");
    const q = `SELECT * FROM users;`;
    return db.query(q).then(results => {
        return results.rows;
    });
};

exports.checkEmail = function(emailReview) {
    console.log("db check email function");
    const q = ` SELECT email FROM users WHERE email = $1;`;
    const params = [emailReview];
    return db.query(q, params).then(results => {
        console.log("checked email result", results.rows[0]);
        return results.rows[0];
    });
};

exports.getUserbyId = function(id) {
    console.log("db getUserbyId searching user by id");
    const q = ` SELECT * FROM users WHERE id = $1;`;
    const params = [id];
    return db.query(q, params).then(user => {
        return user.rows[0];
    });
};

exports.getMultipleUsersbyId = function(arrayIds) {
    console.log("db getMultipleUsersbyId");
    const q = ` SELECT * FROM users WHERE id = ANY($1);`;
    const params = [arrayIds];
    return db.query(q, params).then(users => {
        console.log("db users.rows for multipleIds", users.rows);
        return users.rows;
    });
};

exports.getUserbyEmail = function(email) {
    console.log("db getUserbyEmail searching user by email");
    const q = ` SELECT * FROM users WHERE email = $1;`;
    const params = [email];
    return db.query(q, params).then(user => {
        console.log("result from get user by email", user.rows[0]);
        return user.rows[0];
    });
};

exports.updateProfilePic = function(id, profile_pic) {
    const q = `
    UPDATE users SET
    profile_pic = $2
    WHERE id = $1
    RETURNING *;
    `;
    const params = [id, profile_pic];
    return db.query(q, params).then(updatedProfilePic => {
        console.log(
            "DB function returning updatedprofile",
            updatedProfilePic.rows[0]
        );
        return updatedProfilePic.rows[0];
    });
};

exports.updateBio = function(id, bio) {
    const q = `
    UPDATE users SET
    bio = $2
    WHERE id = $1
    RETURNING *;
    `;
    const params = [id, bio];
    return db.query(q, params).then(updatedProfileBio => {
        console.log(
            "DB function returning updatedbio",
            updatedProfileBio.rows[0]
        );
        return updatedProfileBio.rows[0];
    });
};

exports.getCurrentStatus = function(loggedUser, profileDisplayed) {
    const q = `
        SELECT * FROM friendships
        WHERE ((sender_id = $1 AND receiver_id = $2)
        OR (sender_id = $2 AND receiver_id = $1))
        `;
    const params = [loggedUser, profileDisplayed];
    return db
        .query(q, params)
        .then(results => {
            console.log("results.rows[0] during get: ", results.rows[0]);
            return results.rows[0];
        })
        .catch(err => {
            return err;
        });
};

exports.setStatus = function(loggedUser, profileDisplayed) {
    const q = `
        INSERT INTO friendships (sender_id, receiver_id)
        VALUES ($1, $2)
        RETURNING *;
        `;
    const params = [loggedUser, profileDisplayed];
    return db.query(q, params).then(results => {
        console.log("results.rows[0] in post: ", results.rows[0]);
        return results.rows[0];
    });
};

exports.deleteFriend = function(loggedUser, profileDisplayed) {
    console.log("delete happening in db");
    const q = `
        DELETE FROM friendships
        WHERE ((sender_id = $1 AND receiver_id = $2)
        OR (sender_id = $2 AND receiver_id = $1));
        `;
    const params = [loggedUser, profileDisplayed];
    return db.query(q, params).then(results => {
        console.log("results.rows[0] in delete db: ", results.rows[0]);
        return results.rows;
    });
};

exports.acceptFriend = function(loggedUser, profileDisplayed) {
    console.log("accept happening in db");
    const q = `
        UPDATE friendships
        SET status = 2
        WHERE ((sender_id = $1 AND receiver_id = $2)
        OR (sender_id = $2 AND receiver_id = $1));
        `;
    const params = [loggedUser, profileDisplayed];
    return db.query(q, params).then(results => {
        console.log("results.rows[0] in accept db: ", results.rows[0]);
        return results.rows;
    });
};

exports.rejectFriend = function(loggedUser, profileDisplayed) {
    console.log("reject happening in db");
    const q = `
        UPDATE friendships
        SET status = 3
        WHERE sender_id = $2 AND receiver_id = $1;
        `;
    const params = [loggedUser, profileDisplayed];
    return db.query(q, params).then(results => {
        console.log("results.rows[0] in reject db: ", results.rows[0]);
        return results.rows;
    });
};

exports.unrejectFriend = function(loggedUser, profileDisplayed) {
    console.log("unreject happening in db");
    const q = `
        UPDATE friendships
        SET status = 1
        WHERE sender_id = $2 AND receiver_id = $1;
        `;
    const params = [loggedUser, profileDisplayed];
    return db.query(q, params).then(results => {
        console.log("results.rows[0] in unreject db: ", results.rows[0]);
        return results.rows;
    });
};

exports.getAllUsers = function(loggedUser) {
    console.log("getting list of all user connections");
    const q = `
          SELECT users.id, first_name, last_name, profile_pic, status
          FROM friendships
          JOIN users
          ON (status = 1 AND receiver_id = $1 AND sender_id = users.id)
          OR (status = 2 AND receiver_id = $1 AND sender_id = users.id)
          OR (status = 2 AND sender_id = $1 AND receiver_id = users.id)
          OR (status = 3 AND sender_id = users.id AND receiver_id = $1)
      `;
    const params = [loggedUser];
    return db.query(q, params).then(results => {
        console.log("results.rows[0] in getAllUsers db: ", results.rows);
        return results.rows;
    });
};

exports.getCommonUsers = function(loggedUser, profileDisplayed) {
    console.log("getting list of all user connections");
    const q = `
        SELECT id,status,sender_id,receiver_id
        FROM friendships
        WHERE (status=2 AND (receiver_id = $1 OR sender_id = $1))
        OR (status=2  AND (receiver_id = $2 OR sender_id = $2))
      `;
    const params = [loggedUser, profileDisplayed];
    return db.query(q, params).then(results => {
        return results.rows;
    });
};

exports.postMessage = function(postData) {
    const q = `
          INSERT INTO posts (sender_id, profile_pic, receiver_id, post, first_name, last_name)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
    `;
    const params = [
        postData.sender_id,
        postData.profile_pic,
        postData.receiver_id,
        postData.post,
        postData.first_name,
        postData.last_name
    ];
    return db.query(q, params).then(results => {
        console.log("posted message =", results.rows[0]);
        return results.rows;
    });
};

exports.getPosts = function(id) {
    const q = `
        SELECT * FROM posts
        WHERE receiver_id = $1
        ORDER by created_at DESC;
        `;
    const params = [id];
    return db
        .query(q, params)
        .then(results => {
            console.log("All posts, results.rows for db get: ", results.rows);
            return results.rows;
        })
        .catch(err => {
            return err;
        });
};
