import React from "react";
import axios from "./Axios";
import { Link } from "react-router-dom";
import RequestsNew from "./RequestsNew";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Toolbar from "@material-ui/core/Toolbar";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import TablePagination from "@material-ui/core/TablePagination";

const CustomTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    body: {
        fontSize: 14
    }
}))(TableCell);

const styles = theme => ({
    root: {
        width: "100%",
        marginTop: theme.spacing.unit * 3,
        overflowX: "auto"
    },
    table: {
        minWidth: 700
    },
    row: {
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.background.default
        }
    }
});

class Requests extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            NewRequestUploaderVisible: false,
            requestsList: []
        };
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.updateRequestsList = this.updateRequestsList.bind(this);
    }

    componentDidMount() {
        axios.get("/requestslist/1").then(resp => {
            this.setState(resp.data);
            {
                requestsList: resp.requestsList;
            }
            console.log(
                "Requests componentDidMount this.state=",
                this.state,
                this.state.requestsList
            );
        });
    }

    updateRequestsList() {
        axios.get("/requestslist/1").then(resp => {
            this.setState(resp.data);
            {
                requestssList: resp.requestsList;
            }
            console.log(
                "Updating requests after new one added",
                this.state,
                this.state.requestsList
            );
        });
    }

    handleClickOpen() {
        this.setState({ NewRequestUploaderVisible: true });
    }

    handleClose() {
        this.setState({ NewRequestUploaderVisible: false });
    }

    render() {
        console.log("rendering Requests");
        const { classes } = this.props;
        if (!this.state.requestsList) {
            return null;
        }

        return (
            <div>
                <Typography variant="display1" gutterBottom>
                    Requests Section
                </Typography>
                <RequestsNew
                    open={this.state.NewRequestUploaderVisible}
                    close={this.handleClose}
                    update={this.updateRequestsList}
                />
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    onClick={this.handleClickOpen}
                >
                    New Request
                </Button>
                <Paper className={classes.root}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <CustomTableCell>Status</CustomTableCell>
                                <CustomTableCell>Subject</CustomTableCell>
                                <CustomTableCell>
                                    Business Questions
                                </CustomTableCell>
                                <CustomTableCell>
                                    Preferred Source/Admin
                                </CustomTableCell>
                                <CustomTableCell>
                                    Preferred Analyst(s)
                                </CustomTableCell>
                                <CustomTableCell>
                                    Background Report
                                </CustomTableCell>
                                <CustomTableCell>
                                    Severity Level
                                </CustomTableCell>
                                <CustomTableCell>
                                    Requested hours
                                </CustomTableCell>
                                <CustomTableCell>Deadline</CustomTableCell>
                                <CustomTableCell>
                                    Commited hours
                                </CustomTableCell>
                                <CustomTableCell>Actual hours</CustomTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.requestsList.map(r => {
                                return (
                                    <TableRow
                                        className={classes.row}
                                        key={r.id}
                                    >
                                        <CustomTableCell
                                            component="th"
                                            scope="row"
                                        >
                                            {r.request_status}
                                        </CustomTableCell>
                                        <CustomTableCell>
                                            {r.subject}
                                        </CustomTableCell>
                                        <CustomTableCell>
                                            {r.business_questions}
                                        </CustomTableCell>
                                        <CustomTableCell>
                                            {r.preferred_source}
                                        </CustomTableCell>
                                        <CustomTableCell>
                                            {r.preferred_analyst}
                                        </CustomTableCell>
                                        <CustomTableCell>
                                            {r.background_report}
                                        </CustomTableCell>
                                        <CustomTableCell>
                                            {r.severity_level}
                                        </CustomTableCell>
                                        <CustomTableCell>
                                            {r.requested_hours}
                                        </CustomTableCell>
                                        <CustomTableCell>
                                            {r.deadline}
                                        </CustomTableCell>
                                        <CustomTableCell>
                                            {r.commited_hours}
                                        </CustomTableCell>
                                        <CustomTableCell>
                                            {r.actual_hours}
                                        </CustomTableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        );
    }
}

Requests.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Requests);
