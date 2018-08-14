import React from "react";
import ReactDOM from "react-dom";
import axios from "./Axios";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
    uploader: {
        display: "none"
    }
});

class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.imageSelected = this.imageSelected.bind(this);
        this.upload = this.upload.bind(this);
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
                error: "Please select a file in order to upload"
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

    render() {
        const { classes } = this.props;
        return (
            <div id="uploader">
                <Dialog
                    open={this.props.open}
                    onClose={this.props.close}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">
                        Change your profile picture
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please select your new profile image
                        </DialogContentText>
                    </DialogContent>
                    <input
                        id="file-field"
                        type="file"
                        onChange={this.imageSelected}
                        name=""
                        value=""
                        className={classes.uploader}
                    />
                    <label htmlFor="file-field">
                        <Button variant="raised" component="span">
                            Upload
                        </Button>
                    </label>

                    <DialogActions>
                        <Button
                            color="primary"
                            id="upload-button"
                            onClick={this.upload}
                            name="button"
                        >
                            Upload
                        </Button>
                        <Button onClick={this.props.close} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

Uploader.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Uploader);
