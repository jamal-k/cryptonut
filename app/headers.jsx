function TabButton(props){
  return (
    <button className="tab_button" onClick={props.onClick} id={props.id}>
      <span>
        {props.name}
      </span>
    </button>
  );
}

/**
All the coins that will be displayed in the sidebar.
*/
class TopBarContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loggedIn: true,
      username: ""
    };

    this.handleTabClick = this.handleTabClick.bind(this);
    this.checkAuth = this.checkAuth.bind(this);
  }

  /**
    Set the status of loggedIn to true or false
  */
  setLoggedIn(status, username){
    this.setState({
      loggedIn: status,
      username: username
    });
    wallets.refreshWallets(username);
  }

  componentDidMount (){
    console.log("");
  }

  /**
    Check if a user is authenticated when the username is clicked.
  */
  checkAuth(){
    axios.get("http://localhost:3000/user/checkauth")
      .then(res => {
        console.log("CHECKAUTH(): " + res.data);
    });
  }

  /**
    Change the currently displayed panel to the one based on the tab button clicked.
  */
  handleTabClick(e, panel_name){
    var i, tabcontent, tablinks;

    /* Hide other tabs */
    tabcontent = document.getElementsByClassName("panel");
    for (i = 0; i < tabcontent.length; i++) {
      if (tabcontent[i].classList.contains("panel_target")) {
        tabcontent[i].classList.remove("panel_target");
      }
    }

    $("#" + panel_name)[0].classList.add("panel_target");
    e.target.focus();
  }

  render(){
    if(this.state.loggedIn){
      return(
        <div>
          <TabButton id="wallet_btn" name="WALLET" onClick={(e) => this.handleTabClick(e, "Wallet")} />
          <TabButton id="challenges_btn" name="CHALLENGES" onClick={(e) => this.handleTabClick(e, "Challenges")} />
          <TabButton id="achievements_btn" name="ACHIEVEMENTS" onClick={(e) => this.handleTabClick(e, "Achievements")} />
          <TabButton id="profile_btn" name="PROFILE" onClick={(e) => this.handleTabClick(e, "Profile")} />
    			<div className="wallet_cash" onClick="" id="wallet_cash"><span>USD $1000.00</span></div>
          <div className="username_header" onClick={() => this.checkAuth()} id="username_header"><span>{this.state.username}</span></div>
        </div>
      );
    }
    else{
      return(
        <div></div>
      );
    }

  }
}

var top_bar_container = ReactDOM.render(<TopBarContainer />, document.getElementById('top_bar_container'));
