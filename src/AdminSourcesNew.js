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
import Select from "react-select";

const styles = theme => ({
    hiddenInput: {
        display: "none"
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200
    },
    rightIcon: {
        marginLeft: theme.spacing.unit
    }
});

class AdminSourcesNew extends React.Component {
    constructor(props) {
        super(props);
        this.imageSelected = this.imageSelected.bind(this);
        this.upload = this.upload.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            error: null
        };
    }
    imageSelected(e) {
        this.setState({
            imageFile: e.target.files[0]
        });
        console.log("imageFile", e.target.files[0].name);
    }
    upload() {
        var self = this;
        var formData = new FormData();
        console.log("imageFile: ", this.state.imageFile);
        if (this.state.imageFile == "") {
            this.setState({
                error: "Please select a file in order to upload",
                single: null
            });
        } else {
            formData.append("file", this.state.imageFile);
            axios.post("/upload", formData).then(res => {
                console.log("axios post /upload : ", res);
                if (res.data.success) {
                    this.props.setImage(res.data.image);
                }
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
        axios.post("/newsource", this.state).then(resp => {
            if (resp.data.error) {
                console.log("resp.data.error", resp.data.error);
            } else {
                console.log("new source added");
                this.props.update();
                this.props.close();
            }
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <div id="AdminSourcesNew">
                <Dialog
                    open={this.props.open}
                    onClose={this.props.close}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">
                        Add a new source
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please select your new profile image
                        </DialogContentText>
                    </DialogContent>
                    <form onSubmit={this.handleSubmit} className="">
                        <TextField
                            onChange={this.handleChange}
                            name="source_name"
                            label="Source Name"
                            className={classes.textField}
                            margin="normal"
                        />
                        <input
                            id="file-field"
                            type="file"
                            onChange={this.imageSelected}
                            name=""
                            value=""
                            className={classes.hiddenInput}
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="source_contact_id"
                            label="Verizon Contact"
                            className={classes.textField}
                            margin="normal"
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="description"
                            label="Description"
                            className={classes.textField}
                            margin="normal"
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="total_hours"
                            label="Total hours"
                            className={classes.textField}
                            margin="normal"
                        />
                        <label htmlFor="file-field">
                            <Button variant="contained" color="default">
                                Upload
                                <CloudUploadIcon
                                    className={classes.rightIcon}
                                />
                            </Button>
                        </label>
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
                            <Button onClick={this.props.close} color="primary">
                                Cancel
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </div>
        );
    }
}

AdminSourcesNew.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AdminSourcesNew);
