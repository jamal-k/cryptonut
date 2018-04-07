function Wallet(props){
  return (
    <li onClick={props.onClick}>
      <a className={props.side_style}>
        <h3>{props.name.toUpperCase()} ACCOUNT</h3>
        <div className="side_bar_entry_labels_wrapper">

          <h5 className="side_bar_entry_labels">
            <span>Available</span>
            <span className="side_bar_entry_dashes"></span>
            <span>{props.amount}</span>
          </h5>

          <h5 className="side_bar_entry_labels">
            <span>Total</span>
            <span className="side_bar_entry_dashes"></span>
            <span>{props.amount}</span>
          </h5>

        </div>
      </a>
    </li>
  );
}

var wallet_timeout = null;

/**
All the coins that will be displayed in the select options.
*/
class WalletContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      wallets: [],
      active: null
    };

    this.refreshWallets = this.refreshWallets.bind(this);
    this.handleWalletClick = this.handleWalletClick.bind(this);
  }


  /* Get the given user's wallets */
  refreshWallets(username){

    if(!getCookie("username")){
      return;
    }

    axios.get("https://cryptonut.herokuapp.com/wallet/" + username)
      .then(res => {
        if(res.status == 200){
          this.setState({
            wallets: res.data
          });

          if(wallet_timeout){
            wallet_timeout = null;
          }
        }
      })
      .catch(err => {
        wallet_timeout = setTimeout(() => this.refreshWallets(username), 2000);
      });
  }

  handleWalletClick(i, wallet_name){
    this.setState({
      active: i
    });

    tradetrans.refreshTradeTrans(getCookie("username"), wallet_name);
  }

  componentDidMount (){
    console.log("mounteddd, loaddedd");
  }

  render(){
    return(
      <ul id="wallet_coin_list">
        {/* For each wallet in our list of wallet, create a wallet component */}
        {this.state.wallets.map((wallet, i) => {
            return <Wallet name={wallet.name} amount={wallet.amount}
              side_style={this.state.active == i ? "sidebar_entry sidebar_entry_active" : "sidebar_entry"} onClick={() => this.handleWalletClick(i, wallet.name)} />
        }
        )}

      </ul>
      );

  }
}

var wallets = ReactDOM.render(<WalletContainer />, document.getElementById('wallets_container'));
