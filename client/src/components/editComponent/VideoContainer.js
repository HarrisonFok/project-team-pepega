import React, { Component } from "react";
import {
  Player,
  BigPlayButton,
  LoadingSpinner,
  ControlBar,
  ReplayControl,
  ForwardControl
} from "video-react";
import { connect } from "react-redux";
import { Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import { set_duration, set_duration_player2 } from "../../actions/editActions";

class VideoContainer extends Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = { selectTab: "1" };
    this.toggle = this.toggle.bind(this);
    this.changeCurrentTime = this.changeCurrentTime.bind(this);
  }

  toggle = tab => {
    if (tab !== this.state.selectTab) {
      this.setState(state => ({
        selectTab: tab
      }));
    }
    console.log("state toggle: ", this.getState);
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    // subscribe state change
    this.player.subscribeToStateChange(this.handleStateChange.bind(this));
    this.player2.subscribeToStateChange(this.handlePlayerTwoChange.bind(this));
  }

  changeCurrentTime(seconds) {
    return () => {
      this.player.seek(seconds);
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.item.selectItemOne !== this.props.item.selectItemOne;
  }

  handleStateChange(state) {
    // copy player state to this component's state
    this.setState({
      player: state
    });
    console.log(this.state.player);
    const { player } = this.player.getState();
    this.props.set_duration(player.duration);
  }

  handlePlayerTwoChange(state) {
    this.setState({
      player2: state
    });
    const { player2 } = this.player2.getState();
    this.props.set_duration_player2(player2.duration);
    console.log(this.state.player2);
  }

  render() {
    // Note selectedFile is from VideoList
    // TODO: Update the placeholder for video
    const { selectItemOne, selectItemTwo } = this.props.item;
    console.log("videocontainer selectitemtwo: ", selectItemTwo);
    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={this.state.selectTab === "1" ? "active" : ""}
              onClick={() => {
                this.toggle("1");
              }}
            >
              Video One
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={this.state.selectTab === "2" ? "active" : ""}
              onClick={() => {
                this.toggle("2");
              }}
            >
              Video Two
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.selectTab}>
          <TabPane tabId="1">
            <Row>
              {selectItemOne ? (
                <Player
                  key={selectItemOne}
                  ref={player => {
                    this.player = player;
                  }}
                >
                  <BigPlayButton position="center" />
                  <LoadingSpinner />
                  <ControlBar>
                    <ReplayControl seconds={5} order={2.1} />
                    <ForwardControl seconds={5} order={3.1} />
                  </ControlBar>
                  <source src={"api/items/" + selectItemOne} />
                </Player>
              ) : (
                <Player
                  key={selectItemTwo}
                  ref={player => {
                    this.player = player;
                  }}
                >
                  <BigPlayButton position="center" />
                  <LoadingSpinner />
                  <ControlBar>
                    <ReplayControl seconds={5} order={2.1} />
                    <ForwardControl seconds={5} order={3.1} />
                  </ControlBar>
                  <source src={"http://www.w3schools.com/html/mov_bbb.mp4"} />
                </Player>
              )}
            </Row>
          </TabPane>
          {/* <TabPane tabId="2"> */}
          <Row>
            {selectItemTwo ? (
              <Player key={selectItemTwo}>
                <source src={"api/items/" + selectItemTwo} />
              </Player>
            ) : (
              <p> No video </p>
            )}
          </Row>
          {/* </TabPane> */}
        </TabContent>
      </div>
    );
  }
}

// Mapping a redux state to a component property
const mapStateToProps = state => ({
  // item because we called it that in reducers/index.js (root reducer)
  item: state.item,
  isAuthenticated: state.auth.isAuthenticated
});
export default connect(mapStateToProps, { set_duration })(VideoContainer);
