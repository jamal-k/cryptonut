function TabButton(props){
  return (
    <button className="tab_button" onClick={props.onClick} id={props.id}>
        {props.name}
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
      username: "",
      usd_balance: "0"
    };

    this.handleTabClick = this.handleTabClick.bind(this);
    this.checkAuth = this.checkAuth.bind(this);
    this.refreshUSDBalance = this.refreshUSDBalance.bind(this);
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
  Refreshes the USD balance displayed in the heahders.
  */
  refreshUSDBalance(){
    axios.get("http://localhost:3000/wallet/" + getCookie("username") + "/" + "USD")
      .then(res => {
        this.setState({
          usd_balance: res.data.amount
        })
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

    /* If the wallet button was clicked, then refresh wallets */
    if(e.target.getAttribute("id") == "wallet_btn"){
      wallets.refreshWallets(getCookie("username"));
    }

    /* If the achievements button was clicked, then refresh achievements */
    if(e.target.getAttribute("id") == "achievements_btn"){
      achs.refreshAchievements(getCookie("username"));
    }

    /* If the achievements button was clicked, then refresh achievements */
    if(e.target.getAttribute("id") == "challenges_btn"){
      chas.refreshChallenges();
    }
  }

  render(){
    if(this.state.loggedIn){
      return(
        <div>
          <TabButton id="wallet_btn" name="WALLET" onClick={(e) => this.handleTabClick(e, "Wallet")} />
          <TabButton id="challenges_btn" name="CHALLENGES" onClick={(e) => this.handleTabClick(e, "Challenges")} />
          <TabButton id="achievements_btn" name="ACHIEVEMENTS" onClick={(e) => this.handleTabClick(e, "Achievements")} />
          <TabButton id="profile_btn" name={this.state.username} onClick={(e) => this.handleTabClick(e, "Profile")} />
    			<div className="wallet_cash" onClick="" id="wallet_cash"><span>$ {this.state.usd_balance} USD</span></div>
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
