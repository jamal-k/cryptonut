function Achievement(props) {
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
      React.createElement("img", { className: "currency_logo_img", src: "../home/Challenge_completed.PNG", width: "23", height: "23" }),
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
class AchievementContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      achievements: []
    };

    this.refreshAchievements = this.refreshAchievements.bind(this);;
  }

  /* Get the given user's wallets */
  refreshAchievements(username) {
    axios.get("https://cryptonut.herokuapp.com/achievement/" + username).then(res => {
      if (res.status == 200) {
        this.setState({
          achievements: res.data
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
      { id: "" },
      React.createElement(
        "tr",
        null,
        React.createElement(
          "th",
          null,
          "ACHIEVEMENTS"
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
      this.state.achievements.map((a, i) => {
        return React.createElement(Achievement, { number: i, name: a.name, description: a.description,
          progress: a.progress });
      })
    );
  }
}

var achs = ReactDOM.render(React.createElement(AchievementContainer, null), document.getElementById('achievements_container'));

