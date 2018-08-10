import React from "react";
import axios from "./Axios";
import { connect } from "react-redux";
import { receiveUsers, endFriend } from "./actions";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import {
    withStyles,
    MuiThemeProvider,
    createMuiTheme
} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import DeleteIcon from "@material-ui/icons/Delete";
import red from "@material-ui/core/colors/red";

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        margin: 5
    },
    card: {
        display: "flex",
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        margin: 5
    },
    content: {
        flex: "1 0 auto"
    },
    cover: {
        width: 151,
        height: 151
    },
    progress: {
        margin: theme.spacing.unit * 2
    },
    list: {
        height: 700,
        overflowY: "auto",
        overflowX: "hidden"
    },
    title: {
        marginBottom: 16,
        fontSize: 14
    },
    cssRoot: {
        color: theme.palette.getContrastText(red[500]),
        backgroundColor: red[500],
        "&:hover": {
            backgroundColor: red[700]
        }
    },
    wall: {
        maxWidth: "auto"
    }
});

class Wall extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            posts: []
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        console.log("component did mount for Wall");
        axios
            .get("/posts/" + this.props.receiver_id + ".info")
            .then(({ data }) => {
                console.log("componendidmount received data", data);
                this.setState({
                    posts: data.posts
                });
            });
    }

    handleChange(e) {
        console.log(this.state, e.target.name);
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        let postData = {
            post: this.state.postMessage,
            profile_pic: this.props.profile_pic,
            first_name: this.props.first_name,
            last_name: this.props.last_name,
            sender_id: this.props.sender_id,
            receiver_id: this.props.receiver_id
        };
        console.log("handle submit, message=", postData);
        axios.post("/postmessage", postData).then(resp => {
            if (resp.data.error) {
                console.log("axios if");
                this.setState({
                    error: resp.data.error
                });
            } else {
                console.log("axios else");
                console.log("wall axios response, resp=", resp.data);
                this.setState({
                    posts: [resp.data.posts, ...this.state.posts],
                    postMessage: ""
                });
            }
        });
    }

    render() {
        console.log("rendering Wall");
        const { classes } = this.props;
        const { posts } = this.state;
        console.log("rendering posts", posts);

        if (!this.state.posts) {
            return <CircularProgress className={classes.progress} />;
        }

        if (!posts) {
            return null;
        }
        const ListPosts = (
            <div className={classes.list}>
                {posts.map(post => (
                    <Card className={classes.card} key={post.id}>
                        <CardMedia
                            className={classes.cover}
                            image={post.profile_pic || "./images/default.png"}
                            onClick={e =>
                                (location.href = /user/ + post.sender_id)
                            }
                        />
                        <CardContent className={classes.content}>
                            <Typography
                                className={classes.title}
                                color="textSecondary"
                            >
                                {post.created_at}
                            </Typography>
                            <Typography variant="headline" noWrap>
                                {post.post}
                            </Typography>
                            <Typography
                                variant="subheading"
                                color="textSecondary"
                            >
                                {post.first_name} {post.last_name}
                            </Typography>
                        </CardContent>
                        {(this.props.showDeleteButton ||
                            this.props.sender_id == post.sender_id) && (
                            <CardActions>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.cssRoot}
                                >
                                    Delete
                                    <DeleteIcon className={classes.rightIcon} />
                                </Button>
                            </CardActions>
                        )}
                    </Card>
                ))}
            </div>
        );

        return (
            <div className={classes.wall}>
                <Typography variant="display1" gutterBottom>
                    Wall
                </Typography>
                <Paper className={classes.root} elevation={1}>
                    {" "}
                    <form onSubmit={this.handleSubmit} className="">
                        <TextField
                            onChange={this.handleChange}
                            name="postMessage"
                            id="full-width"
                            InputLabelProps={{
                                shrink: true
                            }}
                            label="Message"
                            className={classes.textField}
                            fullWidth
                            margin="normal"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                        >
                            Post
                        </Button>
                    </form>{" "}
                </Paper>
                {!posts.length && <div>No posts</div>}
                {!!posts.length && ListPosts}
            </div>
        );
    }
}

Wall.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Wall);
