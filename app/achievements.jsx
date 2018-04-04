function Achievement(props){
  return (
    <tr>
      <td className="currency"><span className="currency_rank">{props.number}</span>
        <img className="currency_logo_img" src="./home/Challenge_completed.PNG" width="23" height="23" />{props.name}
      </td>
      <td className="price">{props.description}</td>
      <td className="price">{props.progress}</td>
    </tr>
  );
}

/**
All the coins that will be displayed in the select options.
*/
class AchievementContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      achievements: [],
    };

    this.refreshAchievements = this.refreshAchievements.bind(this);;
  }

  /* Get the given user's wallets */
  refreshAchievements(username){
    axios.get("http://localhost:5000/achievement/" + username)
      .then(res => {
        if(res.status == 200){
          this.setState({
            achievements: res.data
          });
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
					<th>ACHIEVEMENTS</th>
					<th>DESCRIPTION</th>
					<th>PROGRESS</th>
				</tr>

        {this.state.achievements.map((a, i) => {
            return <Achievement number={i} name={a.name} description={a.description}
                    progress={a.progress} />
        }
        )}

			</table>

      );

  }
}

var achs = ReactDOM.render(<AchievementContainer />, document.getElementById('achievements_container'));
