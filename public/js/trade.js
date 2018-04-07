$("#trade_btn").on("click", onTradeBtnClick);

function onTradeBtnClick(){
  console.log("click");

  send_amount_fld = $("#send_amount_fld")[0].value;
  send_coin = $("#send_select").val();
  rec_coin = $("#rec_select").val()

  if(send_amount_fld != ""){

    axios.post("https://cryptonut.herokuapp.com/trade/" + getCookie("username"),
     {send_coin: send_coin, rec_coin: rec_coin, send_amount: send_amount_fld})
      .then(res => {
        if(res.data.msg == "200: trade success"){
          var msg = "You have successfully traded " +
                    getCoinImage(res.data.send_coin) + "<b>" + res.data.send_coin + "</b>" + " for " +
                    getCoinImage(res.data.rec_coin) + "<b>" + res.data.rec_coin + "</b> <br/><br/>You received " +
                    "<span style='color: #4CAF50'>" + res.data.rec_amount + "</span> " +
                    getCoinImage(res.data.rec_coin) + "<b>" + res.data.rec_coin + "</b>" +
                    "<br/><br/>You now have " +
                    "<span style='color: #4CAF50'>" + res.data.send_balance + "</span> "+
                    getCoinImage(res.data.send_coin) + "<b>" + res.data.send_coin + "</b>" + " left." +
                    "<br/><br/>Check your wallet to see your newly traded coins and this trade transaction.";

          alerty.alert(msg, {title: "Exchange Was Successful"});
        }
        else{
          throw res;
        }

        top_bar_container.refreshUSDBalance();
      })
      .catch((err) => {
        console.log("error", err);
        console.log("error", err.response.data.msg);
        alerty.alert(err.response.data.msg, {title: "An <span style='color: #C62828'>error</span> occurred"});
      });
  }
}

function getCoinImage(coin_name){
  return "<img class='trade_success_coin_img' src='./index_files/" + coin_name + ".svg'/>";
}
