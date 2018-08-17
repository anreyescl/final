import React from "react";
import axios from "./Axios";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import ProfilePic from "./ProfilePic";

const styles = {
    root: {
        flexGrow: 1
    },
    flex: {
        flexGrow: 1
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20
    },
    logo: {
        height: 48,
        width: 48
    },
    link1: {
        textDecoration: "none",
        color: "white"
    },
    link2: {
        textDecoration: "none",
        color: "black"
    }
};

class MenuAppBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: true,
            anchorEl: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleMenu = this.handleMenu.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleChange(event, checked) {
        console.log(event, checked);
        this.setState({ auth: checked });
        checked ? (location.hash = "/login") : (location.href = "/logout");
    }

    handleMenu(event) {
        this.setState({ anchorEl: event.currentTarget });
    }

    handleClose() {
        this.setState({ anchorEl: null });
    }

    render() {
        const { classes } = this.props;
        const { auth, anchorEl } = this.state;
        const open = Boolean(anchorEl);
        const { first_name, last_name, profile_pic, clickHandler } = this.props;

        return (
            <div className={classes.root}>
                <AppBar position="static" title="My social network">
                    <Toolbar>
                        <IconButton
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="Menu"
                            onClick={this.handleMenu}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "left"
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left"
                            }}
                            open={open}
                            onClose={this.handleClose}
                        >
                            {first_name && (
                                <div>
                                    <MenuItem onClick={this.handleClose}>
                                        <a
                                            className={classes.link2}
                                            href="/logout"
                                        >
                                            Logout
                                        </a>
                                    </MenuItem>
                                </div>
                            )}

                            {!first_name && (
                                <div>
                                    <MenuItem onClick={this.handleClose}>
                                        <Link
                                            className={classes.link2}
                                            to="/login"
                                        >
                                            Login
                                        </Link>
                                    </MenuItem>
                                </div>
                            )}
                        </Menu>
                        <Typography
                            variant="title"
                            color="inherit"
                            className={classes.flex}
                        >
                            <Link className={classes.link1} to="/">
                                {first_name} {last_name}
                            </Link>
                        </Typography>
                        {/*{first_name && (
                            <div>
                                <IconButton
                                    aria-owns={open ? "menu-appbar" : null}
                                    aria-haspopup="true"
                                    color="inherit"
                                >
                                    <ProfilePic
                                        profile_pic={profile_pic}
                                        first_name={first_name}
                                        last_name={last_name}
                                        clickHandler={clickHandler}
                                    />
                                </IconButton>
                            </div>
                        )}*/}
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

MenuAppBar.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MenuAppBar);
