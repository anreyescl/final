import React from "react";
import axios from "./Axios";
import { connect } from "react-redux";
import { receiveUsers, unrejectFriend } from "./actions";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

const styles = theme => ({
    card: {
        maxWidth: 300,
        minWidth: 200,
        margin: 10
    },
    media: {
        height: 0,
        paddingTop: "100%", // "56.25%" // 16:9
        cursor: "pointer"
    },
    list: {
        display: "flex"
    }
});

class ListRejected extends React.Component {
    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    componentDidMount() {
        console.log("component did mount for ListRejected");
        !this.users && this.props.dispatch(receiveUsers());
    }

    render() {
        console.log("rendering ListRejected");
        const { classes } = this.props;
        const { users } = this.props;
        if (!users) {
            return null;
        }
        console.log("users=", users);

        const Rejected = (
            <div className={classes.list}>
                {users.map(user => (
                    <Card className={classes.card} key={user.id}>
                        <CardMedia
                            className={classes.media}
                            image={user.profile_pic || "/images/default.png"}
                            onClick={e => (location.href = /user/ + user.id)}
                        />
                        <CardContent>
                            <Typography
                                gutterBottom
                                variant="headline"
                                component="h2"
                            >
                                {user.first_name} {user.last_name}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                size="small"
                                color="primary"
                                onClick={e =>
                                    this.props.dispatch(unrejectFriend(user.id))
                                }
                            >
                                Unreject
                            </Button>
                        </CardActions>
                    </Card>
                ))}
            </div>
        );

        return (
            <div>
                <Typography variant="display1" gutterBottom>
                    Rejected List
                </Typography>
                {!users.length && <div>Nobody is rejected</div>}
                {!!users.length && Rejected}
            </div>
        );
    }
}

ListRejected.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(
    connect(state => {
        return {
            users: state.users && state.users.filter(user => user.status == 3)
        };
    })(ListRejected)
);
