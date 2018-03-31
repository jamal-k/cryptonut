function TradeTransaction(props) {
  return React.createElement(
    "tr",
    null,
    React.createElement(
      "td",
      { className: "price" },
      props.type
    ),
    React.createElement(
      "td",
      { className: "price" },
      props.date
    ),
    React.createElement(
      "td",
      { className: "price" },
      props.amount
    ),
    React.createElement(
      "td",
      { className: "price" },
      props.balance
    )
  );
}

/**
All the coins that will be displayed in the select options.
*/
class TradeTransactionsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tradetrans: []
    };

    this.refreshTradeTrans = this.refreshTradeTrans.bind(this);
  }

  /* Get the given user's wallets */
  refreshTradeTrans(username, wallet_name) {
    axios.get("http://localhost:3000/trade/transactions/" + username + "/" + wallet_name).then(res => {
      if (res.status == 200) {
        this.setState({
          tradetrans: res.data
        });
      }
    });
  }

  componentDidMount() {
    console.log("mounteddd, loaddedd");
  }

  render() {
    return React.createElement(
      "table",
      { id: "t02" },
      React.createElement(
        "tr",
        null,
        React.createElement(
          "th",
          null,
          "Type"
        ),
        React.createElement(
          "th",
          null,
          "Time"
        ),
        React.createElement(
          "th",
          null,
          "Amount"
        ),
        React.createElement(
          "th",
          null,
          "Balance"
        )
      ),
      this.state.tradetrans.reverse().map(tt => {
        return React.createElement(TradeTransaction, { type: tt.type, date: tt.date, amount: tt.amount, balance: tt.balance });
      })
    );
  }
}

var tradetrans = ReactDOM.render(React.createElement(TradeTransactionsContainer, null), document.getElementById('trade_transactions_container'));

