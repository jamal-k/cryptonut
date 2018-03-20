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

class FetchCoins extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coins: []
    };

    this.refreshCoins = this.refreshCoins.bind(this);
  }

  refreshCoins() {
    axios.get("https://api.coinmarketcap.com/v1/ticker/").then(res => {
      this.setState({
        coins: res.data
      });
    });
  }

  componentDidMount() {
    console.log("mounteddd");
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

ReactDOM.render(React.createElement(FetchCoins, null), document.getElementById('all_coins'));

