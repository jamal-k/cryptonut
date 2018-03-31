function Wallet(props) {
  return React.createElement(
    "li",
    { onClick: props.onClick },
    React.createElement(
      "a",
      { className: props.side_style },
      React.createElement(
        "h3",
        null,
        props.name.toUpperCase(),
        " ACCOUNT"
      ),
      React.createElement(
        "div",
        { className: "side_bar_entry_labels_wrapper" },
        React.createElement(
          "h5",
          { className: "side_bar_entry_labels" },
          React.createElement(
            "span",
            null,
            "Available"
          ),
          React.createElement("span", { className: "side_bar_entry_dashes" }),
          React.createElement(
            "span",
            null,
            props.amount
          )
        ),
        React.createElement(
          "h5",
          { className: "side_bar_entry_labels" },
          React.createElement(
            "span",
            null,
            "Total"
          ),
          React.createElement("span", { className: "side_bar_entry_dashes" }),
          React.createElement(
            "span",
            null,
            props.amount
          )
        )
      )
    )
  );
}

/**
All the coins that will be displayed in the select options.
*/
class WalletContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wallets: [],
      active: null
    };

    this.refreshWallets = this.refreshWallets.bind(this);
    this.handleWalletClick = this.handleWalletClick.bind(this);
  }

  /* Get the given user's wallets */
  refreshWallets(username) {
    axios.get("http://localhost:3000/wallet/" + username).then(res => {
      if (res.status == 200) {
        this.setState({
          wallets: res.data
        });
      }
    });
  }

  handleWalletClick(i, wallet_name) {
    this.setState({
      active: i
    });

    tradetrans.refreshTradeTrans(getCookie("username"), wallet_name);
  }

  componentDidMount() {
    console.log("mounteddd, loaddedd");
  }

  render() {
    return React.createElement(
      "ul",
      { id: "wallet_coin_list" },
      this.state.wallets.map((wallet, i) => {
        return React.createElement(Wallet, { name: wallet.name, amount: wallet.amount,
          side_style: this.state.active == i ? "sidebar_entry sidebar_entry_active" : "sidebar_entry", onClick: () => this.handleWalletClick(i, wallet.name) });
      })
    );
  }
}

var wallets = ReactDOM.render(React.createElement(WalletContainer, null), document.getElementById('wallets_container'));

