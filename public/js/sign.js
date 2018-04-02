$(document).ready(function() {
  axios.get("http://localhost:3000/user/checkauth")
    .then(res => {
      if(res.data == "auth"){
        var username = getCookie("username");

        if(username != ""){
          displayTopHeaders(true, username);
        }
      }
  });
});

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

          if(res.data.msg == "200: success"){
            document.cookie = "username=" + res.data.username;
            displayTopHeaders(true, res.data.username);
          }
          else if(res.data.msg == "500: username already exists"){
            displayError("Username already exists");
          }
          else if(res.data.msg == "500: email already exists"){
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

$("#login_btn").on("click", () => {
  username = $("#login_username")[0].value;
  password = $("#login_password")[0].value;

  if(username != "" && password != ""){
    axios.post("http://localhost:3000/user/login", {username: username, password: password})
      .then(res => {
        if(res.data.msg == "200: login success"){
          document.cookie = "username=" + res.data.username;
          displayTopHeaders(true, res.data.username);
        }
        else{
          displaySignInError("Incorrect username or password.")
        }

      });
  }

});

$("#logout_btn").on("click", () =>{

  axios.get("http://localhost:3000/user/logout")
    .then(res => {
      console.log(res);
      if(res.data.msg == "200: logout success"){
        deleteCookie("username")
        displayTopHeaders(false, "");
      }

    });

});

function displayTopHeaders(b, username){
  if(b){
    top_bar_container.setLoggedIn(true, username);
    var sign_toggle = $("#sign_toggle");

    if(sign_toggle.is(":checked")){
      sign_toggle.trigger("click");
    }

    $("#open_trade_btn").trigger("click");
    $("#logout_btn").css({"display" : "block"});
    $("#signin_btn_main").css({"display" : "none"});

    top_bar_container.refreshUSDBalance();
  }
  else{
    top_bar_container.setLoggedIn(false, username);
    $("#home_btn").trigger("click");
    $("#logout_btn").css({"display" : "none"});
    $("#signin_btn_main").css({"display" : "block"});
  }
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function displayError(error){
  $("#register_error_txt").text("Error: " + error);
  $("#register_error_txt").removeClass("register_error_txt_OFF").addClass("register_error_txt_ON");
}

function displaySignInError(error){
  $("#signin_error_txt").text("Error: " + error);
  $("#signin_error_txt").removeClass("register_error_txt_OFF").addClass("register_error_txt_ON");
}
