import React from "react";
import { HashRouter, Route } from "react-router-dom"; ///added
import Registration from "./Registration";
import Login from "./Login"; /// added
import MenuAppBar from "./MenuAppBar";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
const theme = createMuiTheme({
    palette: {
        primary: {
            // light: will be calculated from palette.primary.main,
            main: "#26a69a"
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contast with palette.primary.main
        },
        secondary: {
            //light: "#ff0000",
            main: "#indigo"
            // dark: will be calculated from palette.secondary.main,
            //  contrastText: "#ff0000"
        }
        // error: will use the default color
    }
});

const styles = {
    root: {
        width: "100%",
        maxWidth: 500
    }
};

class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            posts: []
        };
    }
    render() {
        const { classes } = this.props;
        return (
            <div>
                <MuiThemeProvider theme={theme}>
                    <HashRouter>
                        <div>
                            <MenuAppBar />
                            <Typography variant="display2" gutterBottom>
                                Welcome
                            </Typography>
                            <img src="" alt="" />
                            <Route exact path="/" component={Registration} />
                            <Route path="/login" component={Login} />
                        </div>
                    </HashRouter>
                </MuiThemeProvider>
            </div>
        );
    }
}

Welcome.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Welcome);
