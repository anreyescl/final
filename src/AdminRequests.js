import React from "react";
import axios from "./Axios";
import { Link } from "react-router-dom";
import AdminRequestsEdit from "./AdminRequestsEdit";

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

const CustomTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    body: {
        fontSize: 14,
        cursor: "pointer"
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
        },
        "&:hover": {
            backgroundColor: "#c9c9c9"
        }
    }
});

class Requests extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            RequestEditVisible: false,
            requestsList: [],
            requestId: "",
            requestTitle: ""
        };
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.updateRequestsList = this.updateRequestsList.bind(this);
    }

    componentDidMount() {
        axios.get("/requestslist/2").then(resp => {
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
        axios.get("/requestslist/2").then(resp => {
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

    handleClickOpen(e) {
        this.setState({
            RequestEditVisible: true,
            requestId: e.target.getAttribute("req_id"),
            requestTitle: e.target.getAttribute("req_title")
        });
    }

    handleClose() {
        this.setState({
            RequestEditVisible: false
        });
    }

    render() {
        console.log("rendering All Requests");
        const { classes } = this.props;

        if (!this.state.requestsList) {
            return null;
        }

        return (
            <div>
                <Typography variant="display1" gutterBottom>
                    All Requests
                </Typography>
                <AdminRequestsEdit
                    open={this.state.RequestEditVisible}
                    close={this.handleClose}
                    update={this.updateRequestsList}
                    title={this.state.requestTitle}
                    id={this.state.requestId}
                />
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
                                        onClick={this.handleClickOpen}
                                    >
                                        <CustomTableCell
                                            component="th"
                                            scope="row"
                                            req_id={r.id}
                                            req_title={r.subject}
                                        >
                                            {r.request_status}
                                        </CustomTableCell>
                                        <CustomTableCell
                                            req_id={r.id}
                                            req_title={r.subject}
                                        >
                                            {r.subject}
                                        </CustomTableCell>
                                        <CustomTableCell
                                            req_id={r.id}
                                            req_title={r.subject}
                                        >
                                            {r.business_questions}
                                        </CustomTableCell>
                                        <CustomTableCell
                                            req_id={r.id}
                                            req_title={r.subject}
                                        >
                                            {r.preferred_source}
                                        </CustomTableCell>
                                        <CustomTableCell
                                            req_id={r.id}
                                            req_title={r.subject}
                                        >
                                            {r.preferred_analyst}
                                        </CustomTableCell>
                                        <CustomTableCell
                                            req_id={r.id}
                                            req_title={r.subject}
                                        >
                                            {r.background_report}
                                        </CustomTableCell>
                                        <CustomTableCell
                                            req_id={r.id}
                                            req_title={r.subject}
                                        >
                                            {r.severity_level}
                                        </CustomTableCell>
                                        <CustomTableCell
                                            req_id={r.id}
                                            req_title={r.subject}
                                        >
                                            {r.requested_hours}
                                        </CustomTableCell>
                                        <CustomTableCell
                                            req_id={r.id}
                                            req_title={r.subject}
                                        >
                                            {r.deadline}
                                        </CustomTableCell>
                                        <CustomTableCell
                                            req_id={r.id}
                                            req_title={r.subject}
                                        >
                                            {r.commited_hours}
                                        </CustomTableCell>
                                        <CustomTableCell
                                            req_id={r.id}
                                            req_title={r.subject}
                                        >
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
