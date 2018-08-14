import React from "react";
import ListWannabes from "./ListWannabes";
import AdminSources from "./AdminSources";
import AdminOverview from "./AdminOverview";
import AdminRequests from "./AdminRequests";

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

class Admin extends React.Component {
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
                    <Tab label="Overview" />
                    <Tab label="All Requests" />
                    <Tab label="Sources" />
                </Tabs>
                {value === 0 && <AdminOverview />}
                {value === 1 && <AdminRequests />}
                {value === 2 && <AdminSources />}
            </div>
        );
    }
}

Admin.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Admin);
