
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
      this.setState({
        coins: res.data
      });
    });
  }

  componentDidMount() {
    console.log("mounteddd, loaddedd");
    this.refreshCoins();
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

/**
All the coins that will be displayed in the select options.
*/
class SelectOptionsCoins extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coins: [],
      selected_coin_img: ""
    };

    this.refreshCoins = this.refreshCoins.bind(this);
    this.refronCoinSelecteshCoins = this.onCoinSelect.bind(this);
  }

  /* Get all coins from the 3rd party API*/
  refreshCoins() {
    axios.get("https://api.coinmarketcap.com/v1/ticker/").then(res => {
      this.setState({
        coins: res.data,
        selected_coin_img: "./index_files/" + res.data[0].symbol + ".svg"
      });
      console.log("LOL: ", res.data[0]["symbol"]);
    });
  }

  componentDidMount() {
    console.log("mounteddd, loaddedd");
    this.refreshCoins();
  }

  onCoinSelect(e) {
    this.setState({
      selected_coin_img: "./index_files/" + e.target.value.toLowerCase() + ".svg"
    });
  }

  render() {
    return React.createElement(
      "div",
      { className: "glow_text_box" },
      React.createElement("input", { type: "number", placeholder: "Amount" }),
      React.createElement("img", { src: this.state.selected_coin_img, className: "select_coin_img" }),
      React.createElement(
        "select",
        { className: "nav_select coin_select", onChange: e => this.onCoinSelect(e) },
        this.state.coins.map((coin, i) => {
          if (i != 0) {
            return React.createElement(
              "option",
              { value: coin.symbol },
              coin.symbol
            );
          }
          /* If it's the first element in the list, then set as selected */
          else {
              return React.createElement(
                "option",
                { value: coin.symbol, selected: "selected" },
                coin.symbol
              );
            }
        })
      )
    );
  }
}

ReactDOM.render(React.createElement(SelectOptionsCoins, null), document.getElementById('to_receive_box'));
ReactDOM.render(React.createElement(SelectOptionsCoins, null), document.getElementById('to_send_box'));

