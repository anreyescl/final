import React from "react";
import axios from "./Axios";
import { Link } from "react-router-dom";

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
        maxWidth: 300,
        minWidth: 200,
        margin: 10
    },
    media: {
        height: 0,
        paddingTop: "100%", // "56.25%" // 16:9
        cursor: "pointer"
    },
    list: {
        display: "flex"
    }
});

class AdminOverview extends React.Component {
    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.state = {
            sourcesList: []
        };
    }
    componentDidMount() {
        axios.get("/sourceslist").then(resp => {
            this.setState(resp.data);
            {
                sourcesList: resp.sourcesList;
            }
            console.log(
                "AdminOverview componentDidMount this.state=",
                this.state,
                this.state.sourcesList
            );
        });
    }

    render() {
        console.log("rendering AdminOverview");
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
                            onClick={e => (location.href = /user/ + source.id)}
                        />
                        <CardContent>
                            <Typography
                                gutterBottom
                                variant="headline"
                                component="h2"
                            >
                                {source.source_name}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                size="small"
                                color="primary"
                                onClick={e => console.log("click")}
                            >
                                Unfriend
                            </Button>
                        </CardActions>
                    </Card>
                ))}
            </div>
        );

        return (
            <div>
                <Typography variant="display1" gutterBottom>
                    Syndicated Sources List
                </Typography>
                {!this.state.sourcesList.length && <div>No sources</div>}
                {!!this.state.sourcesList.length && Sources}
            </div>
        );
    }
}

AdminOverview.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AdminOverview);
