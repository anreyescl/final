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
            source_name: "",
            source_contact_id: "",
            description: "",
            total_hours: ""
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id) {
            axios.get("/source/" + this.props.id).then(resp => {
                this.setState({
                    source_name: resp.data.source[0].source_name,
                    source_contact_id: Number(
                        resp.data.source[0].source_contact_id
                    ),
                    description: resp.data.source[0].description,
                    total_hours: resp.data.source[0].total_hours
                });

                console.log(
                    "Admin Requests Edit, this.state.request=",
                    this.state
                );
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
        axios.post("/updatesource/" + this.props.id, this.state).then(resp => {
            if (resp.data.error) {
                console.log("resp.data.error", resp.data.error);
            } else {
                console.log("source info updated");
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
                            <TextField
                                onChange={this.handleChange}
                                value={this.state.source_name}
                                name="source_name"
                                label="Source Name"
                                className={classes.textField}
                                margin="normal"
                            />

                            <TextField
                                onChange={this.handleChange}
                                value={this.state.source_contact_id}
                                name="source_contact_id"
                                label="Verizon Contact"
                                className={classes.textField}
                                margin="normal"
                            />
                            <TextField
                                onChange={this.handleChange}
                                value={this.state.description}
                                name="description"
                                label="Description"
                                className={classes.textField}
                                margin="normal"
                            />
                            <TextField
                                onChange={this.handleChange}
                                value={this.state.total_hours}
                                name="total_hours"
                                label="Total hours"
                                className={classes.textField}
                                margin="normal"
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
