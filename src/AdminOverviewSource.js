import React from "react";
import axios from "./Axios";
import { Link } from "react-router-dom";
import DownloadDataButton from "./DownloadDataButton";
import AdminRequestsEdit from "./AdminRequestsEdit";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import Avatar from "@material-ui/core/Avatar";

import { Doughnut } from "react-chartjs-2";

let data;

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
    },
    card: {
        display: "flex",
        flexDirection: "row",
        margin: 10
    },
    chart: {
        minWidth: 500,
        maxWidth: 700
    },
    details: {
        display: "flex",
        flexDirection: "column"
    },
    list: {
        display: "flex"
    },
    base: {
        marginTop: 20
    },
    appBar: {
        position: "relative"
    },
    flex: {
        flex: 1
    },
    content: {
        display: "flex",
        flexDirection: "column"
    },
    logo: {
        width: 200,
        height: 100,
        margin: 10,
        objectFit: "cover"
    },
    hours: {
        minWidth: 250
    }
});

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class AdminOverviewSource extends React.Component {
    constructor(props) {
        super(props);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.updateRequestsList = this.updateRequestsList.bind(this);
        this.state = {
            overview: [],
            openSource: false,
            source_name: "",
            description: "",
            data: {},
            overviewActuals: 0,
            overviewCommited: 0,
            overviewTotal: 0,
            overviewRemaining: 0,
            requestsList: [],
            RequestEditVisible: false,
            requestId: "",
            requestTitle: ""
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id) {
            axios.get("/source/" + this.props.id).then(resp => {
                this.setState(
                    {
                        source_name: resp.data.source[0].source_name,
                        description: resp.data.source[0].description,
                        overview: this.props.overview,
                        source_pic: resp.data.source[0].source_pic,
                        requestsList: this.props.requestsList.filter(
                            request =>
                                request.preferred_source_id == this.props.id
                        )
                    },
                    () => {
                        let actual = this.state.overview.filter(
                            source => source.id == this.props.id
                        )[0].actual_hours;
                        let commited = this.state.overview.filter(
                            source => source.id == this.props.id
                        )[0].commited_hours;
                        let remaining =
                            this.state.overview.filter(
                                source => source.id == this.props.id
                            )[0].total_hours -
                            actual -
                            commited;
                        this.setState({
                            data: {
                                labels: ["Actuals", "Commited", "Remaining"],
                                datasets: [
                                    {
                                        data: [actual, commited, remaining],
                                        backgroundColor: [
                                            "#FF6384",
                                            "#FFCE56",
                                            "#4bc0c0"
                                        ],
                                        hoverBackgroundColor: [
                                            "#FF6384",
                                            "#FFCE56",
                                            "#4bc0c0"
                                        ]
                                    }
                                ]
                            },
                            overviewActuals: Number(actual) || 0,
                            overviewCommited: Number(commited) || 0,
                            overviewTotal:
                                Number(actual) +
                                    Number(commited) +
                                    Number(remaining) || 0,
                            overviewRemaining: Number(remaining) || 0
                        });
                    }
                );

                console.log("AdminOverviewSource, this.state=", this.state);
            });
        }
    }

    updateRequestsList() {
        axios.get("/requestslist/2").then(resp => {
            this.setState({
                requestsList: resp.data.requestsList.filter(
                    request => request.preferred_source_id == this.props.id
                )
            });
        });
        this.props.update();
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
        console.log("rendering AdminOverviewSource");

        const { classes } = this.props;
        if (!this.state.overview) {
            console.log("no state.overview yet");
            return null;
        }
        console.log(
            "AdminOverview source this.state.overview=",
            this.state.overview
        );

        return (
            <div>
                <AdminRequestsEdit
                    open={this.state.RequestEditVisible}
                    close={this.handleClose}
                    update={this.updateRequestsList}
                    title={this.state.requestTitle}
                    id={this.state.requestId}
                />
                <Dialog
                    fullScreen
                    open={this.props.open}
                    onClose={this.props.close}
                    TransitionComponent={Transition}
                >
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                onClick={this.props.close}
                                aria-label="Close"
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography
                                variant="title"
                                color="inherit"
                                className={classes.flex}
                            >
                                {this.props.title}
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <List>
                        <Card className={classes.card} key={this.props.id}>
                            <CardMedia className={classes.chart}>
                                <Doughnut data={this.state.data} />
                            </CardMedia>
                            <CardContent className={classes.hours}>
                                <List>
                                    <ListItem>
                                        <ListItemText
                                            primary={
                                                "Total Hours :" +
                                                " " +
                                                this.state.overviewTotal
                                            }
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary={
                                                "Total Commited :" +
                                                " " +
                                                this.state.overviewCommited
                                            }
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary={
                                                "Total Actuals :" +
                                                " " +
                                                this.state.overviewActuals
                                            }
                                        />
                                    </ListItem>
                                    <Divider />
                                    <ListItem>
                                        <ListItemText
                                            primary={
                                                "Total Remaining :" +
                                                " " +
                                                this.state.overviewRemaining
                                            }
                                        />
                                    </ListItem>
                                </List>
                            </CardContent>
                            <CardContent className={classes.content}>
                                <img
                                    src={
                                        this.state.source_pic ||
                                        "/images/default.png"
                                    }
                                    alt={this.state.source_name}
                                    className={classes.logo}
                                />
                                <Typography
                                    gutterBottom
                                    variant="headline"
                                    component="h2"
                                >
                                    {this.state.source_name}
                                </Typography>
                                <Typography component="p">
                                    {this.state.description}
                                </Typography>
                            </CardContent>
                        </Card>
                        <Divider />
                        {/*{!!this.state.overview.length && (
                            <DownloadDataButton
                                data={this.state.overview}
                                type={"overview"}
                            />
                        )}*/}
                        <Paper className={classes.root}>
                            <Table className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <CustomTableCell>
                                            Status
                                        </CustomTableCell>
                                        <CustomTableCell>
                                            Created
                                        </CustomTableCell>
                                        <CustomTableCell>
                                            Requester
                                        </CustomTableCell>
                                        <CustomTableCell>
                                            Subject
                                        </CustomTableCell>
                                        <CustomTableCell>
                                            Business Questions
                                        </CustomTableCell>
                                        <CustomTableCell>
                                            Preferred Source
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
                                        <CustomTableCell>
                                            Deadline
                                        </CustomTableCell>
                                        <CustomTableCell>
                                            Commited hours
                                        </CustomTableCell>
                                        <CustomTableCell>
                                            Actual hours
                                        </CustomTableCell>
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
                                                    {r.created_at}
                                                </CustomTableCell>
                                                <CustomTableCell
                                                    req_id={r.id}
                                                    req_title={r.subject}
                                                >
                                                    {r.requester_full_name}
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
                                                    {r.preferred_source_name}
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
                    </List>
                </Dialog>
            </div>
        );
    }
}

AdminOverviewSource.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AdminOverviewSource);
