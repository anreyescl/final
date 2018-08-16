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

class AdminSourcesNew extends React.Component {
    constructor(props) {
        super(props);
        this.imageSelected = this.imageSelected.bind(this);
        this.upload = this.upload.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);

        this.state = {
            error: null,
            users: [],
            source_contact_id: "",
            source_contact_name: ""
        };
    }

    componentDidMount() {
        axios.get("/allUsers").then(resp => {
            this.setState(resp.data);
            {
                users: resp.users;
            }
            console.log(
                "adminsourcesnew componentDidMount this.state.users=",
                this.state.users
            );
        });
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

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState(
            {
                source_contact_name: this.state.users.filter(
                    user => user.id == this.state.source_contact_id
                )[0].full_name
            },
            () => {
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
        );
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
                            Complete all the fields below
                        </DialogContentText>

                        <form
                            onSubmit={this.handleSubmit}
                            className=""
                            autoComplete="off"
                        >
                            <TextField
                                onChange={this.handleChange}
                                name="source_name"
                                label="Source Name"
                                className={classes.textField}
                                fullWidth
                                autoFocus
                                margin="normal"
                            />
                            {/*<input
                            id="file-field"
                            type="file"
                            onChange={this.imageSelected}
                            name=""
                            value=""
                            className={classes.hiddenInput}
                        />*/}
                            {/*<TextField
                            onChange={this.handleChange}
                            name="source_contact_id"
                            label="Verizon Contact"
                            className={classes.textField}
                            fullWidth
                            autoFocus
                            margin="normal"
                        />*/}

                            <FormControl
                                className={classes.formControl}
                                fullWidth
                            >
                                <InputLabel htmlFor="label-contact">
                                    Internal Admin
                                </InputLabel>
                                <Select
                                    value={this.state.source_contact_id}
                                    onChange={this.handleChange}
                                    inputProps={{
                                        name: "source_contact_id",
                                        id: "label-contact"
                                    }}
                                >
                                    {this.state.users.map(n => {
                                        return (
                                            <MenuItem value={n.id} key={n.id}>
                                                {n.full_name}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>

                            <TextField
                                onChange={this.handleChange}
                                name="description"
                                label="Description"
                                className={classes.textField}
                                margin="normal"
                                fullWidth
                                multiline
                            />
                            <TextField
                                onChange={this.handleChange}
                                name="total_hours"
                                label="Total hours"
                                className={classes.textField}
                                margin="normal"
                                type="number"
                                inputProps={{ min: "0", step: "0.5" }}
                                fullWidth
                            />
                            {/*<label htmlFor="file-field">
                            <Button variant="contained" color="default">
                                Upload
                                <CloudUploadIcon
                                    className={classes.rightIcon}
                                />
                            </Button>
                        </label>*/}
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

AdminSourcesNew.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AdminSourcesNew);
