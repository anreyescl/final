import React from "react";
import axios from "./Axios";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
    container: {
        display: "flex",
        flexWrap: "wrap"
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200
    },
    menu: {
        width: 200
    },
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2
    }
});

class Login extends React.Component {
    constructor() {
        super();

        this.state = {
            error: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        axios.post("/login", this.state).then(resp => {
            if (resp.data.error) {
                console.log("axios if");
                this.setState({
                    error: resp.data.error
                });
            } else {
                console.log("axios else");
                location.replace("/");
            }
        });
    }
    render() {
        const { classes } = this.props;
        return (
            <div className="Login">
                <Paper className={classes.root} elevation={1}>
                    <Typography variant="headline" component="h3">
                        Login
                    </Typography>
                    {this.state.error ? (
                        <div>ERROR: {this.state.error}</div>
                    ) : null}
                    <form onSubmit={this.handleSubmit} className="">
                        <TextField
                            onChange={this.handleChange}
                            name="email"
                            label="E-mail"
                            className={classes.textField}
                            margin="normal"
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="password"
                            label="Password"
                            className={classes.textField}
                            margin="normal"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                        >
                            Log in
                        </Button>
                    </form>
                </Paper>
            </div>
        );
    }
}

Login.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Login);
