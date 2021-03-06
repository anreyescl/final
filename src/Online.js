import React from "react";
import axios from "./Axios";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import OnlineTabs from "./OnlineTabs";
import ListOnline from "./ListOnline";
import ListWannabes from "./ListWannabes";
import ListRejected from "./ListRejected";

import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

class Online extends React.Component {
    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        console.log("online component didmount");
    }
    render() {
        return (
            <div>
                <OnlineTabs />
            </div>
        );
    }
}

export default Online;
