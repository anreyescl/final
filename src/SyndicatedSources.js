import React from "react";
import axios from "./Axios";
import { Link } from "react-router-dom";
import RequestsNew from "./RequestsNew";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
    card: {
        width: 400,
        margin: 10,
        height: "auto"
    },
    media: {
        height: 0,
        paddingTop: "56.25%" // "56.25%" // 16:9
    },
    description: {
        height: 60,
        overflow: "hidden"
    },
    list: {
        marginTop: 20,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center"
    }
});

class SyndicatedSources extends React.Component {
    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.updateRequestsList = this.updateRequestsList.bind(this);
        this.state = {
            sourcesList: [],
            NewRequestUploaderVisible: false
        };
    }
    componentDidMount() {
        axios.get("/sourceslist").then(resp => {
            this.setState(resp.data);
            {
                sourcesList: resp.sourcesList;
            }
            console.log(
                "SyndicatedSources componentDidMount this.state=",
                this.state,
                this.state.sourcesList
            );
        });
    }

    handleClose() {
        this.setState({
            NewRequestUploaderVisible: false
        });
    }

    updateRequestsList() {
        axios.get("/requestslist/1").then(resp => {
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

    handleClickOpen() {
        this.setState({ NewRequestUploaderVisible: true });
    }

    render() {
        console.log("rendering SyndicatedSources");
        const { classes } = this.props;
        if (!this.state.sourcesList) {
            return null;
        }
        console.log("this.state.sourcesList=", this.state.sourcesList);

        const Sources = (
            <div className={classes.list}>
                {this.state.sourcesList.map(source => (
                    <Card className={classes.card} key={source.id}>
                        <CardMedia
                            className={classes.media}
                            image={source.source_pic || "/images/default.png"}
                        />
                        <CardContent>
                            <Typography
                                gutterBottom
                                variant="headline"
                                component="h2"
                            >
                                {source.source_name}
                            </Typography>
                            <Typography
                                className={classes.description}
                                component="p"
                            >
                                {source.description}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                onClick={this.handleClickOpen}
                            >
                                Request Analysis
                            </Button>
                        </CardActions>
                    </Card>
                ))}
            </div>
        );

        return (
            <div>
                <RequestsNew
                    open={this.state.NewRequestUploaderVisible}
                    close={this.handleClose}
                    update={this.updateRequestsList}
                />
                {!!this.state.sourcesList.length && Sources}
            </div>
        );
    }
}

SyndicatedSources.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SyndicatedSources);
