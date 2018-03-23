
/**
Each coin to display in the sidebar.
*/
function Coin(props){
  return (

    <tr className="Coin">
      <td>
        <div className="coin-logo"><img src={"./index_files/" + props.abbr.toLowerCase() + ".svg"} /></div>
      </td>
      <td>
        <div className="coin-name">
          <a style={{color: '#5ad6ad'}} href="">
            <p>{props.name}</p>
          </a>
        </div>
        <div className="coin-abb">
          <p className="text-uppercase">{props.abbr}</p>
        </div>
      </td>
      <td>
        <div className="coin-price">
          <p className="increment">${props.price}</p>
        </div>
        <div className="coin-price">
          <p className={props.percent_change_1h[0] == '-' ? "decrement" : "increment"}>{props.percent_change_1h}%</p>
        </div>
      </td>
    </tr>

  );
}

/**
All the coins that will be displayed in the sidebar.
*/
class SideBarCoins extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      coins: []
    };

    this.refreshCoins = this.refreshCoins.bind(this);
  }

  /* Get all coins from the 3rd party API*/
  refreshCoins(){
    axios.get("https://api.coinmarketcap.com/v1/ticker/")
      .then(res => {
        this.setState({
          coins: res.data
        });
      });
  }

  componentDidMount (){
    console.log("mounteddd, loaddedd");
    this.refreshCoins();
  }

  render(){
    return(
      <tbody>
        {/* For each coin in our list of coins, create a Coin component */}
        {this.state.coins.map(coin =>
          <Coin key={coin.name} name={coin.name} abbr={coin.symbol} price={coin.price_usd} percent_change_1h={coin.percent_change_1h} />
        )}
      </tbody>
      );

  }
}

ReactDOM.render(<SideBarCoins />, document.getElementById('all_coins'));






/**
All the coins that will be displayed in the select options.
*/
class SelectOptionsCoins extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      coins: [],
      selected_coin_img: ""
    };

    this.refreshCoins = this.refreshCoins.bind(this);
    this.refronCoinSelecteshCoins = this.onCoinSelect.bind(this);
  }

  /* Get all coins from the 3rd party API*/
  refreshCoins(){
    axios.get("https://api.coinmarketcap.com/v1/ticker/")
      .then(res => {
        this.setState({
          coins: res.data,
          selected_coin_img: "./index_files/" + res.data[0].symbol + ".svg"
        });
        console.log("LOL: ", res.data[0]["symbol"]);
      });
  }

  componentDidMount (){
    console.log("mounteddd, loaddedd");
    this.refreshCoins();
  }

  onCoinSelect(e){
    this.setState({
      selected_coin_img: "./index_files/" + e.target.value.toLowerCase() + ".svg"
    });
  }

  render(){
    return(
      <div className="glow_text_box">
      <input type="number" placeholder="Amount"/>

      <img src={this.state.selected_coin_img} className="select_coin_img" />

      <select className="nav_select coin_select" onChange={(e) => this.onCoinSelect(e)} >
        {/* For each coin in our list of coins, create a Coin component */}
        {this.state.coins.map((coin, i) => {
           if(i != 0){
             return <option value={coin.symbol}>{coin.symbol}</option>
          }
          /* If it's the first element in the list, then set as selected */
          else{
            return <option value={coin.symbol} selected="selected">{coin.symbol}</option>
          }
        }
        )}

      </select>
      </div>
      );

  }
}

ReactDOM.render(<SelectOptionsCoins />, document.getElementById('to_receive_box'));
ReactDOM.render(<SelectOptionsCoins />, document.getElementById('to_send_box'));
