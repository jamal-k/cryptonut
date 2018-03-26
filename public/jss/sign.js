/**
When the register button is clicked, register the user using the fields they
have filled in.
*/
$("#register_btn").click(() =>{
  email = $("#register_email")[0].value;
  username = $("#register_username")[0].value;
  password = $("#register_password")[0].value;

  if(email != "" && username != "" && password != ""){
    if(validateEmail(email)){

      axios.post("http://localhost:3000/user", {email: email, username: username, password: password})
        .then(res => {

          console.log("res: ", res);

          if(res.data == "200: success"){
            $("#open_trade_btn").trigger("click");
            console.log("USER CREATED");
          }
          else if(res.data == "500: username already exists"){
            displayError("Username already exists");
          }
          else if(res.data == "500: email already exists"){
            displayError("Email already exists");
          }
          else{
            displayError("An occurred while registering. Please try again later.");
          }

        });
    }
    else{
      displayError("Invalid email.");
    }
  }
  else{
    displayError("Fields are empty.");
  }
});

$("#login_btn").on("click", () =>{
  username = $("#login_username")[0].value;
  password = $("#login_password")[0].value;

  if(username != "" && password != ""){
    axios.post("http://localhost:3000/user/login", {username: username, password: password})
      .then(res => {

        console.log(res);

      });
  }1

});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function displayError(error){
  $("#register_error_txt").text("Error: " + error);
  $("#register_error_txt").removeClass("register_error_txt_OFF").addClass("register_error_txt_ON");
}
