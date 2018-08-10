import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Uploader from "./Uploader";

const styles = {
    avatar: {
        height: 48,
        width: 48,
        borderRadius: 50
    }
};

class ProfilePic extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        const { first_name, last_name, profile_pic, clickHandler } = this.props;
        return (
            <div>
                <img
                    src={profile_pic || "./images/default.png"}
                    alt={`${first_name} ${last_name}`}
                    onClick={clickHandler}
                    className={classes.avatar}
                />
            </div>
        );
    }
}

ProfilePic.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProfilePic);
