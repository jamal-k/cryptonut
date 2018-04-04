function SelectedChallenge(props){
  return (
    <tr>
      <td className="currency"><span className="currency_rank">{props.number}</span>
        <img className="currency_logo_img" src="./home/Challenge_completed.PNG" width="23" height="23" />{props.username}
      </td>
      <td className="price">{props.progress}</td>
    </tr>
  );
}

/**
All the coins that will be displayed in the select options.
*/
class SelectedChallengeContainer extends React.Component {
  constructor(props){
    super(props);

    this.startChallenge = this.startChallenge.bind(this);
  }

  componentDidMount (){
    console.log("mounteddd, loaddedd");
  }

  startChallenge(name){
    axios.post("http://localhost:5000/challenge", {username: getCookie("username"), name: name})
      .then(res => {
        if(res.data.msg == "200"){
          alerty.alert("The " + name + " challenge has been accepted! Check your wallet for any wallets you are suppose to receive and start trading!", {title: "Challenge Started"});
        }
      }).catch(err => {
        console.log(err.response);
        alerty.alert(err.response.data.msg, {title: "An <span style='color: #C62828'>error</span> occurred"});
      });
  }

  render(){
    return(
      <div>
        <h1>{this.props.name}</h1>
        <span className="description">{this.props.description}</span>
        <div>
          <a className="button button_green button_med button_start_challenge" onClick={() => this.startChallenge(this.props.name)}>
            <img className="exchange_button__img button__img" src="./home/sign_in.svg" width="12" height="15" />
            START CHALLENGE
          </a>
        </div>

        <table id="">
          <tr>
  					<th>USERNAME</th>
  					<th>PROGRESS</th>
  				</tr>

          {this.props.challenges.map((a, i) => {
              return <SelectedChallenge number={i} username={a.username}
                      progress={a.progress} />
          }
          )}

  			</table>
      </div>

      );

  }
}
