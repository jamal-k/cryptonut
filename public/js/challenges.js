var sort_by = function (field, reverse, primer) {

  var key = primer ? function (x) {
    return primer(x[field]);
  } : function (x) {
    return x[field];
  };

  reverse = !reverse ? 1 : -1;

  return function (a, b) {
    return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
  };
};

function Challenge(props) {
  return React.createElement(
    "tr",
    { className: "challenge_row", onClick: props.onClick },
    React.createElement(
      "td",
      { className: "currency" },
      React.createElement(
        "span",
        { className: "currency_rank" },
        props.number
      ),
      React.createElement("img", { className: "currency_logo_img", src: "./home/Challenge_completed.png", width: "23", height: "23" }),
      props.name
    ),
    React.createElement(
      "td",
      { className: "price" },
      React.createElement(
        "p",
        null,
        props.description
      )
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
    axios.get("https://cryptonut.herokuapp.com/challenge").then(res => {
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
    axios.get("https://cryptonut.herokuapp.com/challenge/" + name).then(res => {
      var new_d = res.data;
      new_d.sort(sort_by('progress', true, parseFloat));
      if (res.status == 200) {
        console.log("r", new_d);
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

