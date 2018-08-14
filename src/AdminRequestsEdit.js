import React from "react";
import ReactDOM from "react-dom";
import axios from "./Axios";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const styles = theme => ({
    hiddenInput: {
        display: "none"
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit
    },
    rightIcon: {
        marginLeft: theme.spacing.unit
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2
    }
});

class AdminRequestsEdit extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.state = {
            error: null,
            request_status: "",
            commited_hours: "",
            actual_hours: ""
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id) {
            axios.get("/request/" + this.props.id).then(resp => {
                console.log(
                    "resp.data.request",
                    resp.data.request[0].request_status
                );
                this.setState({
                    request_status: resp.data.request[0].request_status,
                    commited_hours: Number(resp.data.request[0].commited_hours),
                    actual_hours: Number(resp.data.request[0].actual_hours)
                });
                console.log("Admin Requests Edit, this.state", this.state);
            });
        }
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        axios.post("/updaterequest/" + this.props.id, this.state).then(resp => {
            if (resp.data.error) {
                console.log("resp.data.error", resp.data.error);
            } else {
                console.log("Request info updated");
                this.props.update();
                this.props.close();
            }
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <div id="AdminRequestsEdit">
                <Dialog
                    open={this.props.open}
                    onClose={this.props.close}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">
                        Update Request for {this.props.title}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Edit the next fields if necessary
                        </DialogContentText>

                        <form
                            onSubmit={this.handleSubmit}
                            className=""
                            autoComplete="off"
                        >
                            <FormControl
                                className={classes.formControl}
                                fullWidth
                            >
                                <InputLabel htmlFor="label-status">
                                    Request Status
                                </InputLabel>
                                <Select
                                    value={this.state.request_status}
                                    onChange={this.handleChange}
                                    inputProps={{
                                        name: "request_status",
                                        id: "label-status"
                                    }}
                                >
                                    <MenuItem value={"draft"}>Draft</MenuItem>
                                    <MenuItem value={"Pending"}>
                                        Pending
                                    </MenuItem>
                                    <MenuItem value={"Approved"}>
                                        Approved
                                    </MenuItem>
                                    <MenuItem value={"In progress"}>
                                        In progress
                                    </MenuItem>
                                    <MenuItem value={"Cancelled"}>
                                        Cancelled
                                    </MenuItem>
                                    <MenuItem value={"Postponed"}>
                                        Postponed
                                    </MenuItem>
                                    <MenuItem value={"Completed"}>
                                        Completed
                                    </MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                onChange={this.handleChange}
                                value={this.state.commited_hours}
                                name="commited_hours"
                                label="Commited Hours"
                                margin="normal"
                                type="number"
                                inputProps={{ min: "0", max: "5", step: "0.5" }}
                                fullWidth
                            />
                            <TextField
                                onChange={this.handleChange}
                                value={this.state.actual_hours}
                                name="actual_hours"
                                label="Actual Hours"
                                margin="normal"
                                type="number"
                                inputProps={{ min: "0", max: "5", step: "0.5" }}
                                fullWidth
                            />
                            <DialogActions>
                                <Button
                                    color="primary"
                                    id="upload-button"
                                    onClick={this.upload}
                                    name="button"
                                    type="submit"
                                >
                                    Submit
                                </Button>
                                <Button
                                    onClick={this.props.close}
                                    color="primary"
                                >
                                    Cancel
                                </Button>
                            </DialogActions>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}

AdminRequestsEdit.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AdminRequestsEdit);
