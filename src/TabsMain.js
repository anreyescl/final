import React from "react";
import SyndicatedSources from "./SyndicatedSources";
import Requests from "./Requests";
import Admin from "./Admin";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

const styles = {
    root: {
        flexGrow: 1
    }
};

class TabsMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event, value) {
        this.setState({ value });
    }

    render() {
        const { classes } = this.props;
        const { value } = this.state;

        return (
            <div>
                <Tabs
                    value={this.state.value}
                    onChange={this.handleChange}
                    indicatorColor="secondary"
                    textColor="primary"
                >
                    <Tab label="Sources" />
                    <Tab label="My Requests" />
                    {this.props.admin == 2 && <Tab label="Admin" />}
                </Tabs>
                {value === 0 && <SyndicatedSources />}
                {value === 1 && <Requests />}
                {this.props.admin == 2 && (value === 2 && <Admin />)}
            </div>
        );
    }
}

TabsMain.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TabsMain);
