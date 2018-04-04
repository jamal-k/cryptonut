function SelectedChallenge(props) {
  return React.createElement(
    "tr",
    null,
    React.createElement(
      "td",
      { className: "currency" },
      React.createElement(
        "span",
        { className: "currency_rank" },
        props.number
      ),
      React.createElement("img", { className: "currency_logo_img", src: "./home/Challenge_completed.PNG", width: "23", height: "23" }),
      props.username
    ),
    React.createElement(
      "td",
      { className: "price" },
      props.progress
    )
  );
}

/**
All the coins that will be displayed in the select options.
*/
class SelectedChallengeContainer extends React.Component {
  constructor(props) {
    super(props);

    this.startChallenge = this.startChallenge.bind(this);
  }

  componentDidMount() {
    console.log("mounteddd, loaddedd");
  }

  startChallenge(name) {
    axios.post("https://cryptonut.herokuapp.com/challenge", { username: getCookie("username"), name: name }).then(res => {
      if (res.data.msg == "200") {
        alerty.alert("The " + name + " challenge has been accepted! Check your wallet for any wallets you are suppose to receive and start trading!", { title: "Challenge Started" });
      }
    }).catch(err => {
      console.log(err.response);
      alerty.alert(err.response.data.msg, { title: "An <span style='color: #C62828'>error</span> occurred" });
    });
  }

  render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "h1",
        null,
        this.props.name
      ),
      React.createElement(
        "span",
        { className: "description" },
        this.props.description
      ),
      React.createElement(
        "div",
        null,
        React.createElement(
          "a",
          { className: "button button_green button_med button_start_challenge", onClick: () => this.startChallenge(this.props.name) },
          React.createElement("img", { className: "exchange_button__img button__img", src: "./home/sign_in.svg", width: "12", height: "15" }),
          "START CHALLENGE"
        )
      ),
      React.createElement(
        "table",
        { id: "" },
        React.createElement(
          "tr",
          null,
          React.createElement(
            "th",
            null,
            "USERNAME"
          ),
          React.createElement(
            "th",
            null,
            "PROGRESS"
          )
        ),
        this.props.challenges.map((a, i) => {
          return React.createElement(SelectedChallenge, { number: i, username: a.username,
            progress: a.progress });
        })
      )
    );
  }
}

