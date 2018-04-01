function Challenge(props) {
  return React.createElement(
    "tr",
    { onClick: props.onClick },
    React.createElement(
      "td",
      { className: "currency" },
      React.createElement(
        "span",
        { className: "currency_rank" },
        props.number
      ),
      React.createElement("img", { className: "currency_logo_img", src: "./home/Challenge_completed.PNG", width: "23", height: "23" }),
      props.name
    ),
    React.createElement(
      "td",
      { className: "price" },
      props.description
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
class ChallengeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      challenges: []
    };

    this.refreshChallenges = this.refreshChallenges.bind(this);
    this.handleChallengeClick = this.handleChallengeClick.bind(this);
  }

  /* Get the given user's wallets */
  refreshChallenges() {
    axios.get("http://localhost:3000/challenge").then(res => {
      if (res.status == 200) {
        this.setState({
          challenges: res.data
        });
      }
    });
  }

  handleChallengeClick(e, name, description) {

    console.log("clicked me");

    /** DISPLAY SELECTED CHALLENGE TAB **/
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("panel");
    for (i = 0; i < tabcontent.length; i++) {
      if (tabcontent[i].classList.contains("panel_target")) {
        tabcontent[i].classList.remove("panel_target");
      }
    }

    $("#" + "SelectedChallenge")[0].classList.add("panel_target");
    e.target.focus();
    /** END **/

    /* Get the selected challenge and display it in the container */
    axios.get("http://localhost:3000/challenge/" + name).then(res => {
      if (res.status == 200) {
        console.log("r", res.data);
        ReactDOM.render(React.createElement(SelectedChallengeContainer, { challenges: res.data,
          name: name, description: description
        }), document.getElementById('selected_challenge_container'));
      }
    });
  }

  componentDidMount() {
    console.log("mounteddd, loaddedd");
  }

  render() {
    return React.createElement(
      "table",
      { id: "" },
      React.createElement(
        "tr",
        null,
        React.createElement(
          "th",
          null,
          "CHALLENGES"
        ),
        React.createElement(
          "th",
          null,
          "DESCRIPTION"
        ),
        React.createElement(
          "th",
          null,
          "PROGRESS"
        )
      ),
      this.state.challenges.map((a, i) => {
        return React.createElement(Challenge, { number: i, name: a.name, description: a.description.replace("\"", " "),
          progress: a.progress, onClick: e => this.handleChallengeClick(e, a.name, a.description.replace("\"", " ")) });
      })
    );
  }
}

var chas = ReactDOM.render(React.createElement(ChallengeContainer, null), document.getElementById('challenges_container'));
