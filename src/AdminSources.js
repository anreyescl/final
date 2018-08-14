import React from "react";
import axios from "./Axios";
import { Link } from "react-router-dom";
import AdminSourcesNew from "./AdminSourcesNew";
import AdminSourcesEdit from "./AdminSourcesEdit";

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

class AdminSources extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            NewSourceUploaderVisible: false,
            SourceEditVisible: false,
            sourcesList: [],
            sourceId: "",
            sourceName: ""
        };
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClickOpenEdit = this.handleClickOpenEdit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.updateSourcesList = this.updateSourcesList.bind(this);
    }

    componentDidMount() {
        axios.get("/sourceslist").then(resp => {
            this.setState(resp.data);
            {
                sourcesList: resp.sourcesList;
            }
            console.log(
                "Admin Sources componentDidMount this.state=",
                this.state,
                this.state.sourcesList
            );
        });
    }

    updateSourcesList() {
        axios.get("/sourceslist").then(resp => {
            this.setState(resp.data);
            {
                sourcesList: resp.sourcesList;
            }
            console.log(
                "Updating sources after new one added",
                this.state,
                this.state.sourcesList
            );
        });
    }

    handleClickOpen() {
        this.setState({ NewSourceUploaderVisible: true });
    }

    handleClickOpenEdit(e) {
        console.log(
            "click",
            e.target.getAttribute("source_id"),
            e.target.getAttribute("source_name")
        );
        this.setState({
            SourceEditVisible: true,
            sourceId: e.target.getAttribute("source_id"),
            sourceName: e.target.getAttribute("source_name")
        });
    }

    handleClose() {
        this.setState({
            NewSourceUploaderVisible: false,
            SourceEditVisible: false
        });
    }

    render() {
        console.log("rendering AdminSources");
        const { classes } = this.props;

        if (!this.state.sourcesList) {
            return null;
        }

        return (
            <div>
                <Typography variant="display1" gutterBottom>
                    Sources Management Section
                </Typography>
                <AdminSourcesNew
                    open={this.state.NewSourceUploaderVisible}
                    close={this.handleClose}
                    update={this.updateSourcesList}
                />
                <AdminSourcesEdit
                    open={this.state.SourceEditVisible}
                    close={this.handleClose}
                    update={this.updateSourcesList}
                    title={this.state.sourceName}
                    id={this.state.sourceId}
                />
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    onClick={this.handleClickOpen}
                >
                    Add Source
                </Button>
                <Paper className={classes.root}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <CustomTableCell>Source</CustomTableCell>
                                <CustomTableCell>Logo</CustomTableCell>
                                <CustomTableCell>
                                    Verizon Contact
                                </CustomTableCell>
                                <CustomTableCell>Description</CustomTableCell>
                                <CustomTableCell>Total Hours</CustomTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.sourcesList.map(n => {
                                return (
                                    <TableRow
                                        className={classes.row}
                                        key={n.id}
                                        onClick={this.handleClickOpenEdit}
                                    >
                                        <CustomTableCell
                                            component="th"
                                            scope="row"
                                            source_id={n.id}
                                            source_name={n.source_name}
                                        >
                                            {n.source_name}
                                        </CustomTableCell>
                                        <CustomTableCell
                                            source_id={n.id}
                                            source_name={n.source_name}
                                        >
                                            {n.source_pic}
                                        </CustomTableCell>
                                        <CustomTableCell
                                            source_id={n.id}
                                            source_name={n.source_name}
                                        >
                                            {n.source_contact_id}
                                        </CustomTableCell>
                                        <CustomTableCell
                                            source_id={n.id}
                                            source_name={n.source_name}
                                        >
                                            {n.description}
                                        </CustomTableCell>
                                        <CustomTableCell
                                            source_id={n.id}
                                            source_name={n.source_name}
                                        >
                                            {n.total_hours}
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

AdminSources.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AdminSources);
