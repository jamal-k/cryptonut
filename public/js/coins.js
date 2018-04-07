
/**
Each coin to display in the sidebar.
*/
function Coin(props) {
  return React.createElement(
    "tr",
    { className: "Coin" },
    React.createElement(
      "td",
      null,
      React.createElement(
        "div",
        { className: "coin-logo" },
        React.createElement("img", { src: "./index_files/" + props.abbr.toLowerCase() + ".svg" })
      )
    ),
    React.createElement(
      "td",
      null,
      React.createElement(
        "div",
        { className: "coin-name" },
        React.createElement(
          "a",
          { style: { color: '#5ad6ad' }, href: "" },
          React.createElement(
            "p",
            null,
            props.name
          )
        )
      ),
      React.createElement(
        "div",
        { className: "coin-abb" },
        React.createElement(
          "p",
          { className: "text-uppercase" },
          props.abbr
        )
      )
    ),
    React.createElement(
      "td",
      null,
      React.createElement(
        "div",
        { className: "coin-price" },
        React.createElement(
          "p",
          { className: "increment" },
          "$",
          props.price
        )
      ),
      React.createElement(
        "div",
        { className: "coin-price" },
        React.createElement(
          "p",
          { className: props.percent_change_1h[0] == '-' ? "decrement" : "increment" },
          props.percent_change_1h,
          "%"
        )
      )
    )
  );
}

/**
All the coins that will be displayed in the sidebar.
*/
class SideBarCoins extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coins: []
    };

    this.refreshCoins = this.refreshCoins.bind(this);
  }

  /* Get all coins from the 3rd party API*/
  refreshCoins() {
    axios.get("https://api.coinmarketcap.com/v1/ticker/").then(res => {
      console.log("REFRESHED");
      this.setState({
        coins: res.data
      });
    });
  }

  componentDidMount() {
    console.log("mounteddd, loaddedd");

    /* Retrieve the list of coi1ns from the API and refresh every 60 seconds */
    this.refreshCoins();
    this.interval = setInterval(() => this.refreshCoins(), 60000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return React.createElement(
      "tbody",
      null,
      this.state.coins.map(coin => React.createElement(Coin, { key: coin.name, name: coin.name, abbr: coin.symbol, price: coin.price_usd, percent_change_1h: coin.percent_change_1h }))
    );
  }
}

ReactDOM.render(React.createElement(SideBarCoins, null), document.getElementById('all_coins'));

var coins_timeout = null;

/**
All the coins that will be displayed in the select options.
*/
class SelectOptionsCoins extends React.Component {
  constructor(props) {
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
  refreshCoins() {

    if (!getCookie("username")) {
      return;
    }

    axios.get("https://cryptonut.herokuapp.com/extension/coins/" + getCookie("username")).then(res => {

      this.setState({
        coins: res.data,
        selected_coin_img: "./index_files/" + this.props.default_coin.toLowerCase() + ".svg"
      });
    }).catch(err => {
      console.log("retreieve coins rerror");
      console.log(err.response);
    });

    axios.get("https://cryptonut.herokuapp.com/wallet/" + getCookie("username")).then(res => {
      this.setState({
        my_coins: res.data
      });

      if (coins_timeout) {
        coins_timeout = null;
      }
    }).catch(err => {
      coins_timeout = setTimeout(() => this.refreshCoins(), 2000);
    });
  }

  componentDidMount() {
    console.log("mounteddd, loaddedd");
    this.refreshCoins();
  }

  calculateAmount(e) {
    var selected_coin = $("#" + this.props.select_id).val();
    var other_selected_coin = $("#" + this.props.other_select_id).val();
    var val = e.target.value;

    if (selected_coin.indexOf("[") != -1) {
      selected_coin = selected_coin.substring(selected_coin.indexOf('[') + 1, selected_coin.indexOf(']'));
    }

    if (other_selected_coin.indexOf("[") != -1) {
      other_selected_coin = other_selected_coin.substring(other_selected_coin.indexOf('[') + 1, other_selected_coin.indexOf(']'));
    }

    axios.get("https://min-api.cryptocompare.com/data/price?fsym=" + selected_coin + "&tsyms=" + other_selected_coin).then(res => {
      $("#" + this.props.other_amount_fld_id).val(res.data[other_selected_coin] * val);
    });
  }

  /**
    Display the coin image on the option picker when a coin is selected.
  */
  onCoinSelect(e) {
    this.setState({
      selected_coin_img: "./index_files/" + e.target.value.toLowerCase() + ".svg"
    });

    $("#" + this.props.amount_fld_id).val("");
    $("#" + this.props.other_amount_fld_id).val("");
  }

  render() {
    /* Only display user's owned coins to send */
    if (this.props.amount_fld_id == "send_amount_fld") {
      return React.createElement(
        "div",
        { className: "glow_text_box" },
        React.createElement("input", { id: this.props.amount_fld_id, onKeyUp: e => this.calculateAmount(e), type: "number", placeholder: "Amount" }),
        React.createElement("img", { src: this.state.selected_coin_img, onError: e => {
            e.target.src = "/index_files/usd.svg";
          }, className: "select_coin_img" }),
        React.createElement(
          "select",
          { id: this.props.select_id, className: "nav_select coin_select", onChange: e => this.onCoinSelect(e) },
          this.state.my_coins.map((coin, i) => {

            /* If it's the first element in the list, then set as selected */
            if (coin.name == this.props.default_coin) {
              return React.createElement(
                "option",
                { value: coin.name, selected: "selected" },
                coin.name
              );
            } else {
              return React.createElement(
                "option",
                { value: coin.name },
                coin.name
              );
            }
          })
        )
      );
    }
    /* Only display all coins to send */
    else {
        return React.createElement(
          "div",
          { className: "glow_text_box" },
          React.createElement("input", { id: this.props.amount_fld_id, onKeyUp: e => this.calculateAmount(e), type: "number", placeholder: "Amount" }),
          React.createElement("img", { src: this.state.selected_coin_img, onError: e => {
              e.target.src = "/index_files/usd.svg";
            }, className: "select_coin_img" }),
          React.createElement(
            "select",
            { id: this.props.select_id, className: "nav_select coin_select", onChange: e => this.onCoinSelect(e) },
            React.createElement(
              "option",
              { value: "USD" },
              "USD"
            ),
            this.state.coins.map((coin, i) => {
              /* If it's the first element in the list, then set as selected */
              if (coin.symbol == this.props.default_coin) {
                return React.createElement(
                  "option",
                  { value: coin.symbol, selected: "selected" },
                  coin.symbol
                );
              } else {
                return React.createElement(
                  "option",
                  { value: coin.symbol },
                  coin.symbol
                );
              }
            })
          )
        );
      }
  }
}

var send_amount_main = ReactDOM.render(React.createElement(SelectOptionsCoins, { amount_fld_id: "send_amount_fld", default_coin: "USD",
  other_amount_fld_id: "rec_amount_fld", select_id: "send_select", other_select_id: "rec_select" }), document.getElementById('to_send_box'));

var rec_amount_main = ReactDOM.render(React.createElement(SelectOptionsCoins, { amount_fld_id: "rec_amount_fld", default_coin: "BTC",
  other_amount_fld_id: "send_amount_fld", select_id: "rec_select", other_select_id: "send_select" }), document.getElementById('to_receive_box'));

