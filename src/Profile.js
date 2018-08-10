import React from "react";
import axios from "./Axios";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import Wall from "./Wall";
import { Bar } from "react-chartjs-2";

const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "My First dataset",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(255,99,132,0.4)",
            hoverBorderColor: "rgba(255,99,132,1)",
            data: [65, 59, 80, 81, 56, 55, 40]
        }
    ]
};

const styles = theme => ({
    opp: {
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        gridGap: `${theme.spacing.unit * 3}px`,
        marginTop: 10
    },
    bar: {
        height: 100,
        width: 100
    },
    card: {
        maxWidth: "auto",
        minWidth: 300
    },
    media: {
        height: 0,
        paddingTop: "100%" //"56.25%" // 16:9
    }
});

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null
        };
        this.handleChangeBio = this.handleChangeBio.bind(this);
        this.handleSubmitionBio = this.handleSubmitionBio.bind(this);
    }
    handleChangeBio(e) {
        this.setState(
            {
                [e.target.name]: e.target.value
            },
            () => {
                console.log(this.state);
            }
        );
    }

    handleSubmitionBio(e) {
        console.log("handle submit for Bio");
        e.preventDefault();
        console.log("this.state.bio", this.state.bio);
        axios.post("/update-bio", this.state).then(resp => {
            console.log("resp, from handle submit profile", resp);
            if (resp.data.error) {
                console.log("axios if");
                this.setState({
                    error: resp.data.error
                });
            } else {
                console.log("handle submit, setting the bio", resp.data);
                this.props.setBio(resp.data.bio);
            }
        });
    }

    render() {
        const {
            id,
            first_name,
            last_name,
            profile_pic,
            bio,
            showBio,
            toggleShowBio
        } = this.props;
        const { classes } = this.props;

        return (
            <div className={classes.opp}>
                <Bar
                    className={classes.bar}
                    data={data}
                    width={10}
                    height={5}
                    options={{
                        maintainAspectRatio: false
                    }}
                />
                <Card className={classes.card}>
                    <CardMedia
                        className={classes.media}
                        image={profile_pic || "./images/default.png"}
                    />
                    <CardContent>
                        <Typography
                            gutterBottom
                            variant="headline"
                            component="h2"
                        >
                            {first_name} {last_name}
                        </Typography>
                    </CardContent>
                    {showBio ? (
                        <div>
                            <CardContent>
                                <Typography>
                                    <textarea
                                        onChange={this.handleChangeBio}
                                        type="text"
                                        name="bio"
                                    />
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    onClick={this.handleSubmitionBio}
                                >
                                    Update bio
                                </Button>
                            </CardActions>
                        </div>
                    ) : bio ? (
                        <div>
                            <CardContent>
                                <Typography>{bio}</Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={toggleShowBio}
                                >
                                    Edit your bio
                                </Button>
                            </CardActions>
                        </div>
                    ) : (
                        <CardActions>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={toggleShowBio}
                            >
                                Add a bio
                            </Button>
                        </CardActions>
                    )}
                </Card>
                <Wall
                    profile_pic={
                        this.props.logged_profile_pic || "/images/default.png"
                    }
                    first_name={this.props.logged_first_name}
                    last_name={this.props.logged_last_name}
                    sender_id={this.props.logged_id}
                    receiver_id={this.props.logged_id}
                    showDeleteButton={true}
                />
            </div>
        );
    }
}

Profile.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Profile);
