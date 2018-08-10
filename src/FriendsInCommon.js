import React from "react";
import axios from "./Axios";
import { connect } from "react-redux";
import { actionCommonUsers } from "./actions";
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

class FriendsinCommon extends React.Component {
    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    componentDidMount() {
        console.log("component did mount for FriendsinCommon");
        !this.commonUsers &&
            this.props.dispatch(actionCommonUsers(this.props.id));
    }

    render() {
        console.log("rendering FriendsinCommon");
        const { classes } = this.props;
        const { commonUsers } = this.props;
        console.log("render commonUsers", commonUsers);
        if (!commonUsers) {
            return null;
        }
        console.log("commonUsers=", commonUsers);

        const FriendsinCommonList = (
            <div className={classes.list}>
                {commonUsers.map(user => (
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
                    </Card>
                ))}
            </div>
        );

        return (
            <div>
                <Typography variant="display1" gutterBottom>
                    Friends in Common
                </Typography>
                {!commonUsers.length && (
                    <div>You don't have friends in common</div>
                )}
                {!!commonUsers.length && FriendsinCommonList}
            </div>
        );
    }
}

FriendsinCommon.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(
    connect(state => {
        return {
            commonUsers: state.commonUsers
        };
    })(FriendsinCommon)
);
