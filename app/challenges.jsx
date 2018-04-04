function Challenge(props){
  return (
    <tr className="challenge_row" onClick={props.onClick}>
      <td className="currency"><span className="currency_rank">{props.number}</span>
        <img className="currency_logo_img" src="../home/Challenge_completed.PNG" width="23" height="23" />{props.name}
      </td>
      <td className="price"><p>{props.description}</p></td>
      <td className="price">{props.progress}</td>
    </tr>
  );
}

/**
All the coins that will be displayed in the select options.
*/
class ChallengeContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      challenges: [],
    };

    this.refreshChallenges = this.refreshChallenges.bind(this);
    this.handleChallengeClick = this.handleChallengeClick.bind(this);
  }

  /* Get the given user's wallets */
  refreshChallenges(){
    axios.get("https://cryptonut.herokuapp.com/challenge")
      .then(res => {
        if(res.status == 200){
          this.setState({
            challenges: res.data
          });
        }
      });
  }

  handleChallengeClick(e, name, description){

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
    axios.get("https://cryptonut.herokuapp.com/challenge/" + name)
      .then(res => {
        if(res.status == 200){
          console.log("r", res.data);
          ReactDOM.render(<SelectedChallengeContainer challenges={res.data}
                           name={name} description={description}
            />, document.getElementById('selected_challenge_container'));
        }
      });
  }


  componentDidMount (){
    console.log("mounteddd, loaddedd");
  }

  render(){
    return(

      <table id="">
        <tr>
					<th>CHALLENGES</th>
					<th>DESCRIPTION</th>
					<th>PROGRESS</th>
				</tr>

        {this.state.challenges.map((a, i) => {
            return <Challenge number={i} name={a.name} description={a.description.replace("\"", " ")}
                    progress={a.progress} onClick={(e) => this.handleChallengeClick(e, a.name, a.description.replace("\"", " "))}/>
        }
        )}

			</table>

      );

  }
}

var chas = ReactDOM.render(<ChallengeContainer />, document.getElementById('challenges_container'));
