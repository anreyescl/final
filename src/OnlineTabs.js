import React from "react";
import ListOnline from "./ListOnline";

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

class OnlineTabs extends React.Component {
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
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab label="Online" />
                    <Tab label="Offline" />
                </Tabs>
                {value === 0 && <ListOnline />}
            </div>
        );
    }
}

OnlineTabs.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(OnlineTabs);
