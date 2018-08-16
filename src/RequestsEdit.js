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

class RequestsEdit extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.state = {
            error: null,
            sourcesList: [],
            subject: "",
            business_questions: "",
            preferred_source: "",
            preferred_analyst: "",
            background_report: "",
            severity_level: "",
            requested_hours: "",
            deadline: ""
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id) {
            axios.get("/request/" + this.props.id).then(resp => {
                this.setState({
                    subject: resp.data.request[0].subject,
                    business_questions: resp.data.request[0].business_questions,
                    preferred_source: resp.data.request[0].preferred_source,
                    preferred_analyst: resp.data.request[0].preferred_analyst,
                    background_report: resp.data.request[0].background_report,
                    severity_level: resp.data.request[0].severity_level,
                    requested_hours: resp.data.request[0].requested_hours,
                    deadline: resp.data.request[0].deadline
                });

                console.log("Requests Edit, this.state.request=", this.state);
            });
        }
    }

    componentDidMount() {
        axios.get("/sourceslist").then(resp => {
            this.setState(resp.data);
            {
                sourcesList: resp.sourcesList;
            }
            console.log(
                "SyndicatedSources componentDidMount this.state=",
                this.state.sourcesList
            );
        });
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        axios
            .post("/updaterequestuser/" + this.props.id, this.state)
            .then(resp => {
                if (resp.data.error) {
                    console.log("resp.data.error", resp.data.error);
                } else {
                    console.log("Request updated");
                    this.props.update();
                    this.props.close();
                }
            });
    }

    render() {
        const { classes } = this.props;
        return (
            <div id="RequestsEdit">
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
                            Please fill all the necessary information below
                            including all the mandatory fields (*)
                        </DialogContentText>

                        <form
                            onSubmit={this.handleSubmit}
                            className=""
                            autoComplete="off"
                        >
                            <TextField
                                onChange={this.handleChange}
                                value={this.state.subject}
                                name="subject"
                                label="Subject"
                                margin="normal"
                                fullWidth
                                autoFocus
                                margin="dense"
                            />
                            <TextField
                                onChange={this.handleChange}
                                value={this.state.business_questions}
                                name="business_questions"
                                label="Business questions to address "
                                margin="normal"
                                fullWidth
                                multiline
                            />
                            <FormControl
                                className={classes.formControl}
                                fullWidth
                            >
                                <InputLabel htmlFor="label-source">
                                    Preferred Source
                                </InputLabel>
                                <Select
                                    value={this.state.preferred_source}
                                    onChange={this.handleChange}
                                    inputProps={{
                                        name: "preferred_source",
                                        id: "label-source"
                                    }}
                                >
                                    {this.state.sourcesList.map(n => {
                                        return (
                                            <MenuItem value={n.id} key={n.id}>
                                                {n.id}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                            <TextField
                                onChange={this.handleChange}
                                value={this.state.preferred_analyst}
                                name="preferred_analyst"
                                label="Preferred Analyst(s)"
                                margin="normal"
                                fullWidth
                            />

                            <TextField
                                onChange={this.handleChange}
                                value={this.state.background_report}
                                name="background_report"
                                label="Background Report, if relevant"
                                margin="normal"
                                fullWidth
                            />
                            <FormControl
                                className={classes.formControl}
                                fullWidth
                            >
                                <InputLabel htmlFor="label-severity">
                                    Severity Level
                                </InputLabel>
                                <Select
                                    value={this.state.severity_level}
                                    onChange={this.handleChange}
                                    inputProps={{
                                        name: "severity_level",
                                        id: "label-severity"
                                    }}
                                >
                                    <MenuItem value={"Normal"}>Normal</MenuItem>
                                    <MenuItem value={"High"}>High</MenuItem>
                                    <MenuItem value={"Critical"}>
                                        Critical
                                    </MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                onChange={this.handleChange}
                                value={this.state.requested_hours}
                                name="requested_hours"
                                label="Number of hours – 0.5 hrs, 1 hr, others ( please describe )"
                                margin="normal"
                                type="number"
                                inputProps={{ min: "0", max: "5", step: "0.5" }}
                                fullWidth
                            />
                            <TextField
                                onChange={this.handleChange}
                                value={this.state.deadline}
                                name="deadline"
                                label="Deadline, if applicable "
                                margin="normal"
                                fullWidth
                                type="date"
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                            <DialogActions>
                                <Button
                                    color="primary"
                                    id="upload-button"
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

RequestsEdit.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RequestsEdit);
