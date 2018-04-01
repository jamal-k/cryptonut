function TradeTransaction(props){
  return (
    <tr>
      <td className="price">{props.type}</td>
      <td className="price">{props.date}</td>
      <td className="price">{props.amount}</td>
      <td className="price">{props.balance}</td>
    </tr>
  );
}

/**
All the coins that will be displayed in the select options.
*/
class TradeTransactionsContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      tradetrans: []
    };

    this.refreshTradeTrans = this.refreshTradeTrans.bind(this);
  }

  /* Get the given user's wallets */
  refreshTradeTrans(username, wallet_name){
    axios.get("http://localhost:3000/trade/transactions/" + username + "/" + wallet_name)
      .then(res => {
        if(res.status == 200){
          this.setState({
            tradetrans: res.data
          });
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  }

  componentDidMount (){
    console.log("mounteddd, loaddedd");
  }

  render(){
    return(
      <table id="t02">
        <tr>
          <th>Type</th>
          <th>Time</th>
          <th>Amount</th>
          <th>Balance</th>
        </tr>

        {/* For each trade trans in our list of trade trans, create a TradeTransaction component */}
        {this.state.tradetrans.reverse().map((tt) => {
            return <TradeTransaction type={tt.type} date={tt.date} amount={tt.amount} balance={tt.balance} />
        }
        )}

      </table>

      );

  }
}

var tradetrans = ReactDOM.render(<TradeTransactionsContainer />, document.getElementById('trade_transactions_container'));
