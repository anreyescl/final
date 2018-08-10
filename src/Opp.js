import React from "react";
import axios from "./Axios";
import FriendshipButton from "./FriendshipButton";
import FriendsinCommon from "./FriendsinCommon";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Wall from "./Wall";

const styles = theme => ({
    profile: {
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        gridGap: `${theme.spacing.unit * 3}px`,
        marginTop: 10
    },
    card: {
        maxWidth: "auto",
        minWidth: 300
    },
    media: {
        height: 0,
        paddingTop: "100%" // "56.25%" // 16:9
    },
    leftside: {
        gridColumnStart: 1,
        gridRowStart: 1,
        display: "grid",
        gridTemplateColumns: "1fr",
        gridGap: `${theme.spacing.unit * 3}px`
    }
});

class Opp extends React.Component {
    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.state = {};
    }
    componentDidMount() {
        console.log("component did mount for Opp, getting OPP user info");
        axios
            .get("/user/" + this.props.match.params.id + ".info")
            .then(({ data }) => {
                if (data.redirect) {
                    this.props.history.push("/");
                } else {
                    this.setState(data);
                    console.log("opp this.state", this.state);
                }
            });
    }
    render() {
        console.log("rendering Opp for user id=", this.props.match.params.id);
        const { id, first_name, last_name, profile_pic, bio } = this.state;
        const { classes } = this.props;
        console.log("opp id=", id);
        return (
            <div className={classes.profile}>
                <div className={classes.leftside}>
                    {" "}
                    <Card className={classes.card}>
                        <CardMedia
                            className={classes.media}
                            image={profile_pic || "/images/default.png"}
                        />
                        <CardContent>
                            <Typography
                                gutterBottom
                                variant="headline"
                                component="h2"
                            >
                                {first_name} {last_name}
                            </Typography>
                            <Typography>{bio}</Typography>
                        </CardContent>
                        <CardActions>
                            <FriendshipButton id={this.props.match.params.id} />
                        </CardActions>
                    </Card>
                    <div className={classes.friendsincommon}>
                        <FriendsinCommon id={this.props.match.params.id} />
                    </div>
                </div>
                <Wall
                    profile_pic={
                        this.props.logged_profile_pic || "/images/default.png"
                    }
                    first_name={this.props.logged_first_name}
                    last_name={this.props.logged_last_name}
                    sender_id={this.props.logged_id}
                    receiver_id={this.props.match.params.id}
                    showDeleteButton={false}
                />
            </div>
        );
    }
}

Opp.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Opp);
