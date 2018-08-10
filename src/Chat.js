import { emitChatMessage } from "./socket";
import React from "react";
import axios from "./Axios";
import { connect } from "react-redux";
import { receiveUsers, endFriend } from "./actions";
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
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
    card: {
        display: "flex",
        margin: 10
    },
    details: {
        display: "flex",
        flexDirection: "column"
    },
    content: {
        flex: "1 0 auto"
    },
    cover: {
        width: 151,
        height: 151
    },
    list: {
        height: 600,
        overflowY: "auto",
        overflowX: "hidden"
    }
});

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        console.log("component did mount for Chat");
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value
            },
            () => {
                console.log(this.state);
            }
        );
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log("this.props.profile_pic", this.props.profile_pic);
        let messageData = {
            message: this.state.chatMessage,
            profile_pic: this.props.profile_pic,
            first_name: this.props.first_name,
            last_name: this.props.last_name
        };
        console.log("handle submit, message=", messageData);
        emitChatMessage(messageData);
    }

    render() {
        console.log("rendering Chat");
        const { classes } = this.props;
        const { messages } = this.props;

        if (!messages) {
            return null;
        }
        console.log("messages", messages);
        const ListMessages = (
            <div className={classes.list}>
                {messages.map(messages => (
                    <Card className={classes.card} key={messages.UserId}>
                        <CardMedia
                            className={classes.cover}
                            image={
                                messages.profile_pic || "./images/default.png"
                            }
                            onClick={e =>
                                (location.href = /user/ + messages.UserId)
                            }
                        />
                        <div className={classes.details}>
                            <CardContent className={classes.content}>
                                <Typography variant="headline">
                                    {messages.message}
                                </Typography>
                                <Typography
                                    variant="subheading"
                                    color="textSecondary"
                                >
                                    {messages.first_name} {messages.last_name}
                                    {messages.date}
                                </Typography>
                            </CardContent>
                        </div>
                    </Card>
                ))}
            </div>
        );

        return (
            <div>
                <Typography variant="display1" gutterBottom>
                    Chat
                </Typography>
                {!messages.length && <div>No messages</div>}
                {!!messages.length && ListMessages}

                <form onSubmit={this.handleSubmit} className="">
                    <TextField
                        onChange={this.handleChange}
                        name="chatMessage"
                        label="Chat"
                        className={classes.textField}
                        margin="normal"
                    />
                    <Button variant="contained" color="primary" type="submit">
                        Submit
                    </Button>
                </form>
            </div>
        );
    }
}

Chat.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(
    connect(state => {
        return {
            messages: state.reduxUserMessages
        };
    })(Chat)
);
