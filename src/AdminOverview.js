import React from "react";
import axios from "./Axios";
import { Link } from "react-router-dom";
import DownloadDataButton from "./DownloadDataButton";
import AdminOverviewSource from "./AdminOverviewSource";

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
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Divider from "@material-ui/core/Divider";

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
        maxWidth: 300,
        minWidth: 500,
        margin: 10
    },
    media: {
        height: 0,
        paddingTop: "100%", // "56.25%" // 16:9
        cursor: "pointer"
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
    logo: {
        margin: 10,
        width: 80,
        height: 40,
        objectFit: "cover"
    },
    divisor: {
        marginBottom: 20,
        marginTop: 20
    },
    totalCard: {
        display: "flex",
        flexDirection: "row"
    },
    totalMedia: {
        width: 450
    }
});

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class AdminOverview extends React.Component {
    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        // this.getData = this.getData.bind(this);
        this.setTotals = this.setTotals.bind(this);
        this.getTotalData = this.getTotalData.bind(this);
        this.handleClickOpenSource = this.handleClickOpenSource.bind(this);
        this.handleCloseSource = this.handleCloseSource.bind(this);
        this.state = {
            overview: [],
            openSource: false,
            sourceId: "",
            sourceName: "",
            overviewActuals: 0,
            overviewCommited: 0,
            overviewTotal: 0,
            overviewRemaining: 0,
            data: {}
        };
    }
    componentDidMount() {
        axios.get("/requestsoverview").then(resp => {
            console.log("axios response component did mount");
            this.setState(resp.data);
            {
                overview: resp.overview;
            }
            this.getTotalData();
        });
    }

    handleClickOpenSource(e) {
        this.setState({
            openSource: true,
            sourceId: e.target.getAttribute("source_id"),
            sourceName: e.target.getAttribute("source_name")
        });
    }

    handleCloseSource() {
        this.setState({
            openSource: false
        });
    }

    setTotals(totalActual, totalCommited, totalTotal, totalRemaining) {
        this.setState({
            overviewActuals: totalActual,
            overviewCommited: totalCommited,
            overviewTotal: totalTotal,
            overviewRemaining: totalRemaining
        });
    }

    getTotalData() {
        console.log("get data overview review", this.state.overview);
        let totalActual = 0;
        let totalCommited = 0;
        let totalRemaining = 0;
        let totalTotal = 0;
        this.state.overview.map(source => {
            totalTotal = totalTotal + Number(source.total_hours);
        });
        this.state.overview.map(source => {
            totalActual = totalActual + Number(source.actual_hours);
        });
        this.state.overview.map(source => {
            totalCommited = totalCommited + Number(source.commited_hours);
        });
        this.state.overview.map(source => {
            totalRemaining =
                totalRemaining +
                Number(source.total_hours) -
                Number(source.actual_hours) -
                Number(source.commited_hours);
        });
        let data = {
            labels: ["Total Actuals", "Total Commited", "Total Remaining"],
            datasets: [
                {
                    data: [totalActual, totalCommited, totalRemaining],
                    backgroundColor: ["#FF6384", "#FFCE56", "#4bc0c0"],
                    hoverBackgroundColor: ["#FF6384", "#FFCE56", "#4bc0c0"]
                }
            ]
        };

        this.setState({
            data: data,
            overviewActuals: totalActual,
            overviewCommited: totalCommited,
            overviewTotal: totalTotal,
            overviewRemaining: totalRemaining
        });
    }

    // getData(idSource) {
    //     let actual = this.state.overview.filter(
    //         source => source.id == idSource
    //     )[0].actual_hours;
    //     let commited = this.state.overview.filter(
    //         source => source.id == idSource
    //     )[0].commited_hours;
    //     let remaining =
    //         this.state.overview.filter(source => source.id == idSource)[0]
    //             .total_hours -
    //         actual -
    //         commited;
    //     let data = {
    //         labels: ["Actuals", "Commited", "Remaining"],
    //         datasets: [
    //             {
    //                 data: [actual, commited, remaining],
    //                 backgroundColor: ["#FF6384", "#FFCE56", "#4bc0c0"],
    //                 hoverBackgroundColor: ["#FF6384", "#FFCE56", "#4bc0c0"]
    //             }
    //         ]
    //     };
    //     return data;
    // }

    render() {
        console.log("rendering AdminOverview");

        const { classes } = this.props;
        if (!this.state.overview) {
            return null;
        }
        console.log("this.state totals=", this.state);

        // const Sources = (
        //     <div className={classes.list}>
        //         {this.state.overview.map(source => (
        //             <Card className={classes.card} key={source.id}>
        //                 <CardContent>
        //                     <Typography
        //                         gutterBottom
        //                         variant="headline"
        //                         component="h2"
        //                     >
        //                         {source.source_name}
        //                     </Typography>
        //                     <Doughnut data={this.getData(source.id)} />
        //                 </CardContent>
        //                 <CardActions>
        //                     <Button
        //                         size="small"
        //                         color="primary"
        //                         onClick={e => console.log("click")}
        //                     >
        //                         Function
        //                     </Button>
        //                 </CardActions>
        //             </Card>
        //         ))}
        //     </div>
        // );

        const Total = (
            <div>
                <Card className={classes.totalCard} key="total">
                    <CardMedia className={classes.totalMedia} src="">
                        <Doughnut data={this.state.data} />
                    </CardMedia>
                    <CardContent>
                        <Typography
                            gutterBottom
                            variant="headline"
                            component="h2"
                        >
                            Total Overview
                        </Typography>
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
                                        "Total Actuals :" +
                                        " " +
                                        this.state.overviewCommited
                                    }
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary={
                                        "Total Remaining :" +
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
                </Card>
            </div>
        );

        return (
            <div className={classes.base}>
                <AdminOverviewSource
                    open={this.state.openSource}
                    close={this.handleCloseSource}
                    title={this.state.sourceName}
                    id={this.state.sourceId}
                    overview={this.state.overview}
                />
                {Total}
                {/*{Sources}*/}
                <Divider className={classes.divisor} />
                {!!this.state.overview.length && (
                    <DownloadDataButton
                        data={this.state.overview}
                        type={"overview"}
                    />
                )}
                <Paper className={classes.root}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <CustomTableCell>Logo</CustomTableCell>
                                <CustomTableCell>Source</CustomTableCell>
                                <CustomTableCell>
                                    Number of Requests
                                </CustomTableCell>
                                <CustomTableCell>Total Hours</CustomTableCell>
                                <CustomTableCell>
                                    Requested Hours
                                </CustomTableCell>
                                <CustomTableCell>
                                    Commited Hours
                                </CustomTableCell>
                                <CustomTableCell>Actual Hours</CustomTableCell>
                                <CustomTableCell>
                                    Remaining Hours
                                </CustomTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.overview.map(n => {
                                return (
                                    <TableRow
                                        className={classes.row}
                                        key={n.id}
                                        onClick={this.handleClickOpenSource}
                                    >
                                        <CustomTableCell
                                            component="th"
                                            scope="row"
                                            source_id={n.id}
                                            source_name={n.source_name}
                                        >
                                            <img
                                                src={
                                                    n.source_pic ||
                                                    "/images/default.png"
                                                }
                                                alt={n.source_name}
                                                className={classes.logo}
                                            />
                                        </CustomTableCell>
                                        <CustomTableCell
                                            source_id={n.id}
                                            source_name={n.source_name}
                                        >
                                            {n.source_name}
                                        </CustomTableCell>
                                        <CustomTableCell
                                            source_id={n.id}
                                            source_name={n.source_name}
                                        >
                                            {n.number_requests}
                                        </CustomTableCell>
                                        <CustomTableCell
                                            source_id={n.id}
                                            source_name={n.source_name}
                                        >
                                            {n.total_hours}
                                        </CustomTableCell>
                                        <CustomTableCell
                                            source_id={n.id}
                                            source_name={n.source_name}
                                        >
                                            {n.requested_hours}
                                        </CustomTableCell>
                                        <CustomTableCell
                                            source_id={n.id}
                                            source_name={n.source_name}
                                        >
                                            {n.commited_hours}
                                        </CustomTableCell>
                                        <CustomTableCell
                                            source_id={n.id}
                                            source_name={n.source_name}
                                        >
                                            {n.actual_hours}
                                        </CustomTableCell>
                                        <CustomTableCell
                                            source_id={n.id}
                                            source_name={n.source_name}
                                        >
                                            {n.total_hours -
                                                n.actual_hours -
                                                n.commited_hours}
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

AdminOverview.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AdminOverview);
