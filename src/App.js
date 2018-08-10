import React from "react";
import Logo from "./Logo";
import ProfilePic from "./Profilepic";
import Uploader from "./Uploader";
import axios from "./Axios";
import Profile from "./Profile";
import Opp from "./Opp";
import MenuAppBar from "./MenuAppBar";
import { BrowserRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import reducer from "./reducers";
import Friends from "./Friends";
import Online from "./Online";
import Chat from "./Chat";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
const theme = createMuiTheme({
    palette: {
        primary: {
            // light: will be calculated from palette.primary.main,
            main: "#26a69a"
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contast with palette.primary.main
        },
        secondary: {
            //light: "#ff0000",
            main: "#indigo"
            // dark: will be calculated from palette.secondary.main,
            //  contrastText: "#ff0000"
        }
        // error: will use the default color
    }
});

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.showUploader = this.showUploader.bind(this);
        this.closeUploader = this.closeUploader.bind(this);
        this.setImage = this.setImage.bind(this);
        this.setBio = this.setBio.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.state = { showBio: false };
        this.state = { uploaderIsVisible: false };
        this.toggleShowBio = this.toggleShowBio.bind(this);
    }
    showUploader() {
        this.setState({
            uploaderIsVisible: true
        });
    }

    closeUploader() {
        this.setState({ uploaderIsVisible: false });
    }
    setImage(url) {
        console.log("url", url);
        this.setState({
            profile_pic: url,
            uploaderIsVisible: false
        });
    }
    setBio(bio) {
        console.log("App SetBio", bio);
        this.setState({
            bio: bio,
            showBio: !this.state.showBio
        });
    }
    componentDidMount() {
        axios.get("/user").then(resp => {
            this.setState(resp.data);
            {
                resp.data.profile_pic
                    ? console.log("there is a profile pic already")
                    : this.setState({ profile_pic: "/images/default.png" });
            }
            console.log("App component did mouunt this.state=", this.state);
        });
    }
    toggleShowBio() {
        this.setState({
            showBio: !this.state.showBio
        });
    }
    render() {
        console.log("App rendering");
        if (!this.state.id) {
            return <div>Loading</div>;
        }

        const {
            id,
            first_name,
            last_name,
            profile_pic,
            bio,
            showBio,
            toggleShowBio
        } = this.state;

        console.log("this.state.profile_pic", this.state.profile_pic);

        if (!this.state.id) {
            return <img src="/images/progress.gif" />;
        }
        return (
            <MuiThemeProvider theme={theme}>
                <div id="App">
                    <BrowserRouter>
                        <div>
                            <MenuAppBar
                                profile_pic={
                                    profile_pic || "/images/default.png"
                                }
                                first_name={first_name}
                                last_name={last_name}
                                clickHandler={this.showUploader}
                            />
                            {this.state.uploaderIsVisible && (
                                <Uploader
                                    setImage={this.setImage}
                                    open={this.state.uploaderIsVisible}
                                    close={this.closeUploader}
                                    clickHandler={this.showUploader}
                                />
                            )}
                            <Route
                                exact
                                path="/"
                                render={() => (
                                    <Profile
                                        setBio={this.setBio}
                                        bio={this.state.bio}
                                        id={id}
                                        first_name={first_name}
                                        last_name={last_name}
                                        profile_pic={
                                            profile_pic || "/images/default.png"
                                        }
                                        bio={this.state.bio}
                                        showBio={showBio}
                                        toggleShowBio={this.toggleShowBio}
                                        logged_profile_pic={
                                            profile_pic || "/images/default.png"
                                        }
                                        logged_first_name={first_name}
                                        logged_last_name={last_name}
                                        logged_id={id}
                                    />
                                )}
                            />
                            <Route exact path="/friends" component={Friends} />
                            <Route
                                exact
                                path="/chat"
                                render={() => (
                                    <Chat
                                        profile_pic={
                                            profile_pic || "/images/default.png"
                                        }
                                        first_name={first_name}
                                        last_name={last_name}
                                    />
                                )}
                            />
                            <Route exact path="/online" component={Online} />

                            <Route
                                exact
                                path="/user/:id"
                                render={props => (
                                    <Opp
                                        match={props.match}
                                        logged_profile_pic={
                                            profile_pic || "/images/default.png"
                                        }
                                        logged_first_name={first_name}
                                        logged_last_name={last_name}
                                        logged_id={id}
                                    />
                                )}
                            />
                        </div>
                    </BrowserRouter>
                </div>
            </MuiThemeProvider>
        );
    }
}
