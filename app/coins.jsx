
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
        console.log("REFRESHED");
        this.setState({
          coins: res.data
        });
      });
  }

  componentDidMount (){
    console.log("mounteddd, loaddedd");

    /* Retrieve the list of coi1ns from the API and refresh every 60 seconds */
    this.refreshCoins()
    this.interval = setInterval(() => this.refreshCoins(), 60000);
  }

  componentWillUnmount() {
  clearInterval(this.interval);
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




var coins_timeout = null;

/**
All the coins that will be displayed in the select options.
*/
class SelectOptionsCoins extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      coins: [],
      my_coins: [],
      selected_coin_img: ""
    };

    this.refreshCoins = this.refreshCoins.bind(this);
    this.onCoinSelect = this.onCoinSelect.bind(this);
    this.calculateAmount = this.calculateAmount.bind(this);
  }

  /**
  Get all coins from the 3rd party API
  */
  refreshCoins(){

    if(!getCookie("username")){
      return;
    }

    axios.get("http://localhost:3000/extension/coins/" + getCookie("username"))
      .then(res => {

        this.setState({
          coins: res.data,
          selected_coin_img: "./index_files/" + this.props.default_coin.toLowerCase() + ".svg"
        });

      })
      .catch(err => {
        console.log("retreieve coins rerror");
        console.log(err.response);
      });

    axios.get("http://localhost:3000/wallet/" + getCookie("username"))
      .then(res => {
        this.setState({
          my_coins: res.data,
        });

        if(coins_timeout){
          coins_timeout = null;
        }
      })
      .catch(err => {
        coins_timeout = setTimeout(() => this.refreshCoins(), 2000);
      });
  }

  componentDidMount (){
    console.log("mounteddd, loaddedd");
    this.refreshCoins();
  }

  calculateAmount(e){
    var selected_coin = $("#" + this.props.select_id).val()
    var other_selected_coin = $("#" + this.props.other_select_id).val()
    var val = e.target.value;

    if(selected_coin.indexOf("[") != -1){
      selected_coin = selected_coin.substring(selected_coin.indexOf('[') + 1, selected_coin.indexOf(']'))
    }

    if(other_selected_coin.indexOf("[") != -1){
      other_selected_coin = other_selected_coin.substring(other_selected_coin.indexOf('[') + 1, other_selected_coin.indexOf(']'))
    }

    axios.get("https://min-api.cryptocompare.com/data/price?fsym=" + selected_coin + "&tsyms=" + other_selected_coin)
      .then(res => {
        $("#" + this.props.other_amount_fld_id).val(res.data[other_selected_coin] * val);
    });
  }

  /**
    Display the coin image on the option picker when a coin is selected.
  */
  onCoinSelect(e){
      this.setState({
        selected_coin_img: "./index_files/" + e.target.value.toLowerCase() + ".svg"
      });

      $("#" + this.props.amount_fld_id).val("");
      $("#" + this.props.other_amount_fld_id).val("");
  }

  render(){
    /* Only display user's owned coins to send */
    if(this.props.amount_fld_id == "send_amount_fld"){
      return(
        <div className="glow_text_box">
        <input id={this.props.amount_fld_id} onKeyUp={(e) => this.calculateAmount(e)} type="number" placeholder="Amount"/>

        <img src={this.state.selected_coin_img} onError={(e) => {e.target.src="/index_files/usd.svg"}} className="select_coin_img" />

        <select id={this.props.select_id} className="nav_select coin_select" onChange={(e) => this.onCoinSelect(e)} >
          {this.state.my_coins.map((coin, i) => {

                /* If it's the first element in the list, then set as selected */
                if(coin.name == this.props.default_coin){
                   return <option value={coin.name} selected="selected">{coin.name}</option>
                }
                else{
                  return <option value={coin.name}>{coin.name}</option>
                }

              }
            )
          }

        </select>
        </div>
      );
    }
    /* Only display all coins to send */
    else{
      return(
        <div className="glow_text_box">
        <input id={this.props.amount_fld_id} onKeyUp={(e) => this.calculateAmount(e)} type="number" placeholder="Amount"/>

        <img src={this.state.selected_coin_img} onError={(e) => {e.target.src="/index_files/usd.svg"} } className="select_coin_img" />

        <select id={this.props.select_id} className="nav_select coin_select" onChange={(e) => this.onCoinSelect(e)} >
          <option value="USD">USD</option>
          {this.state.coins.map((coin, i) => {
                /* If it's the first element in the list, then set as selected */
                if(coin.symbol == this.props.default_coin){
                   return <option value={coin.symbol} selected="selected">{coin.symbol}</option>
                }
                else{
                  return <option value={coin.symbol}>{coin.symbol}</option>
                }

              }
          )
        }

        </select>
        </div>
      );
    }
  }
}

var send_amount_main = ReactDOM.render(<SelectOptionsCoins amount_fld_id="send_amount_fld" default_coin="USD"
other_amount_fld_id="rec_amount_fld" select_id="send_select" other_select_id="rec_select"  />,
document.getElementById('to_send_box'));

var rec_amount_main = ReactDOM.render(<SelectOptionsCoins amount_fld_id="rec_amount_fld" default_coin="BTC"
other_amount_fld_id="send_amount_fld" select_id="rec_select" other_select_id="send_select"/>,
document.getElementById('to_receive_box'));
