var spicedPg = require("spiced-pg");

let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    db = spicedPg("postgres:are:postgres@localhost:5432/analystrequests");
}

exports.registerUser = function(
    firstName,
    lastName,
    fullName,
    email,
    hashedPassword
) {
    const q = `
          INSERT INTO users (first_name, last_name,full_name, email, hashed_password)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
    `;
    const params = [firstName, lastName, fullName, email, hashedPassword];
    return db.query(q, params).then(results => {
        console.log("registered user completed");
        return results.rows[0];
    });
};

exports.registerSource = function(
    source_name,
    source_contact_id,
    source_contact_name,
    description,
    total_hours,
    creator_id
) {
    const q = `
          INSERT INTO sources (source_name, source_contact_id, source_contact_name, description, total_hours,creator_id)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
    `;
    const params = [
        source_name,
        source_contact_id,
        source_contact_name,
        description,
        total_hours,
        creator_id
    ];
    return db.query(q, params).then(result => {
        console.log("New Source Registered - result.rows[0]", result.rows[0]);
        return result.rows[0];
    });
};

exports.registerRequest = function(
    subject,
    business_questions,
    preferred_source_name,
    preferred_source_id,
    preferred_analyst,
    background_report,
    severity_level,
    requested_hours,
    deadline,
    requester_id
) {
    const q = `
          INSERT INTO requests (subject, business_questions,preferred_source_name, preferred_source_id,
          preferred_analyst, background_report, severity_level, requested_hours, deadline,requester_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING *
    `;
    const params = [
        subject,
        business_questions,
        preferred_source_name,
        preferred_source_id,
        preferred_analyst,
        background_report,
        severity_level,
        requested_hours,
        deadline,
        requester_id
    ];
    return db.query(q, params).then(result => {
        console.log("New request Registered - result.rows[0]", result.rows[0]);
        return result.rows[0];
    });
};

exports.getSources = function() {
    const q = `
        SELECT * FROM sources
        ORDER by created_at DESC;
        `;
    return db
        .query(q)
        .then(results => {
            return results.rows;
        })
        .catch(err => {
            return err;
        });
};

exports.requestsOverview = function() {
    const q = `
    SELECT *
    FROM sources
    LEFT JOIN (
      SELECT preferred_source_id, SUM(requested_hours) as requested_hours,
      SUM(commited_hours) as commited_hours, SUM(actual_hours) as actual_hours,
      COUNT(preferred_source_id) as number_requests
      FROM requests
      GROUP BY preferred_source_id
    ) totals
    ON sources.id = totals.preferred_source_id;
        `;

    return db
        .query(q)
        .then(results => {
            return results.rows;
        })
        .catch(err => {
            return err;
        });
};

exports.getSingleRequest = function(id) {
    const q = `
        SELECT * FROM requests
        WHERE id = $1;
        `;
    const params = [id];
    return db
        .query(q, params)
        .then(result => {
            console.log(
                "single request, results.rows for db get: ",
                result.rows
            );
            return result.rows;
        })
        .catch(err => {
            return err;
        });
};

exports.getSingleSource = function(id) {
    const q = `
        SELECT * FROM sources
        WHERE id = $1;
        `;
    const params = [id];
    return db
        .query(q, params)
        .then(result => {
            console.log(
                "single source, results.rows for db get: ",
                result.rows
            );
            return result.rows;
        })
        .catch(err => {
            return err;
        });
};

exports.getRequests = function(requester_id, admin, page) {
    console.log("requester_id", "admin", requester_id, admin, page);
    let q = ``;
    if (page == 1) {
        q = `
          SELECT * FROM requests
          WHERE requester_id = $1
          ORDER by created_at DESC;
          `;
    } else if (admin == 1 && page == 2) {
        console.log("admin 1");
        q = `
          SELECT * FROM requests
          WHERE preferred_source_id = $1
          ORDER by created_at DESC;
          `;
    } else if (admin == 2 && page == 2) {
        console.log("admin 2");
        q = `
          SELECT * FROM requests
          ORDER by created_at DESC;
          `;
    }
    const params = admin == 2 && page == 2 ? null : [requester_id];
    return db
        .query(q, params)
        .then(results => {
            return results.rows;
        })
        .catch(err => {
            return err;
        });
};

exports.updateRequest = function(
    id,
    request_status,
    commited_hours,
    actual_hours
) {
    const q = `
    UPDATE requests SET
    request_status = $2,
    commited_hours = $3,
    actual_hours = $4
    WHERE id = $1;
    `;
    const params = [id, request_status, commited_hours, actual_hours];
    return db.query(q, params).then(result => {
        console.log("DB function returning updated request", result.rows);
        return result.rows;
    });
};

exports.updateSource = function(
    id,
    source_name,
    source_contact_id,
    description,
    total_hours
) {
    const q = `
    UPDATE sources SET
    source_name = $2,
    source_contact_id = $3,
    description = $4,
    total_hours = $5
    WHERE id = $1;
    `;
    const params = [
        id,
        source_name,
        source_contact_id,
        description,
        total_hours
    ];
    return db.query(q, params).then(result => {
        console.log("DB function returning updated source", result.rows);
        return result.rows;
    });
};

exports.updateRequestUser = function(
    id,
    subject,
    business_questions,
    preferred_source_id,
    preferred_source_name,
    preferred_analyst,
    background_report,
    severity_level,
    requested_hours,
    deadline
) {
    const q = `
    UPDATE requests SET
    subject = $2,
    business_questions = $3,
    preferred_source_id = $4,
    preferred_source_name = $5,
    preferred_analyst = $6,
    background_report = $7,
    severity_level = $8,
    requested_hours = $9,
    deadline = $10
    WHERE id = $1;
    `;
    const params = [
        id,
        subject,
        business_questions,
        preferred_source_id,
        preferred_source_name,
        preferred_analyst,
        background_report,
        severity_level,
        requested_hours,
        deadline
    ];
    return db.query(q, params).then(result => {
        console.log("DB function returning updated request", result.rows[0]);
        return result.rows;
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

// exports.getAllUsers = function(loggedUser) {
//     console.log("getting list of all user connections");
//     const q = `
//           SELECT users.id, first_name, last_name, profile_pic, status
//           FROM friendships
//           JOIN users
//           ON (status = 1 AND receiver_id = $1 AND sender_id = users.id)
//           OR (status = 2 AND receiver_id = $1 AND sender_id = users.id)
//           OR (status = 2 AND sender_id = $1 AND receiver_id = users.id)
//           OR (status = 3 AND sender_id = users.id AND receiver_id = $1)
//       `;
//     const params = [loggedUser];
//     return db.query(q, params).then(results => {
//         console.log("results.rows[0] in getAllUsers db: ", results.rows);
//         return results.rows;
//     });
// };

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
