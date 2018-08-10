import React from "react";
import axios from "./Axios";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
    button: {
        margin: theme.spacing.unit
    },
    input: {
        display: "none"
    }
});

class FriendshipButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleClick = this.handleClick.bind(this);
        this.updateButton = this.updateButton.bind(this);
        this.inviteFriend = this.inviteFriend.bind(this);
        this.terminateFriend = this.terminateFriend.bind(this);
        this.acceptFriend = this.acceptFriend.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    componentDidMount() {
        this.updateButton();
    }
    updateButton() {
        console.log("updateButton friendship this.props.id=", this.props.id);
        axios
            .get("/friendstatus/" + this.props.id + ".json")
            .then(({ data }) => {
                if (!data) {
                    this.setState({
                        buttonText: "Send friend request",
                        status: false
                    });
                } else if (data.status == 1) {
                    if (data.sessionUserId == data.receiverId) {
                        this.setState({
                            buttonText: "Accept Invitation",
                            status: 1,
                            senderId: data.senderId,
                            receiverId: data.receiverId,
                            sessionUserId: data.sessionUserId
                        });
                    } else {
                        this.setState({
                            buttonText: "Cancel Invitation",
                            status: 1,
                            senderId: data.senderId,
                            receiverId: data.receiverId,
                            sessionUserId: data.sessionUserId
                        });
                    }
                } else if (data.status == 2) {
                    this.setState({
                        buttonText: "End friendship",
                        status: 2,
                        senderId: data.senderId,
                        receiverId: data.receiverId,
                        sessionUserId: data.sessionUserId
                    });
                }
                console.log(
                    "Friendshipbutton end of axios update this.state=",
                    this.state
                );
            });
    }
    handleClick() {
        console.log("current status is: ", this.state.status);
        if (!this.state.status) {
            this.inviteFriend();
        } else if (
            this.state.status == 1 &&
            this.state.receiverId == this.state.sessionUserId
        ) {
            this.acceptFriend();
        } else if (
            this.state.status == 1 &&
            this.state.receiverId != this.state.sessionUserId
        ) {
            this.terminateFriend();
        } else if (this.state.status == 2) {
            this.terminateFriend();
        }
        this.updateButton();
    }
    inviteFriend() {
        console.log("invite happening");
        axios
            .post("/friendstatus/" + this.props.id + ".json")
            .then(({ data }) => {
                this.setState({
                    buttonText: "Cancel Invitation",
                    status: 1
                });
            });
    }

    terminateFriend() {
        console.log("terminate happening");
        axios.post("/terminate/" + this.props.id + ".json").then(({ data }) => {
            this.setState({
                buttonText: "Send friend request",
                status: false
            });
        });
    }

    acceptFriend() {
        console.log("accept happening");
        axios.post("/accept/" + this.props.id + ".json").then(({ data }) => {
            console.log("Axios post of accept friend in button");
            this.setState({
                buttonText: "End friendship",
                status: 2
            });
        });
    }
    render() {
        console.log("rendering FriendshipButton");
        const { classes } = this.props;
        console.log(
            "friendship button rendering state and props",
            this.state,
            this.props
        );
        const { buttonText } = this.state;
        return (
            <div id="FriendshipButton">
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={this.handleClick}
                >
                    <div>{buttonText}</div>
                </Button>
            </div>
        );
    }
}

FriendshipButton.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FriendshipButton);
