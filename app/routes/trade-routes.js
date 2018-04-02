var express = require('express');
var router = express.Router();
var axios = require('axios');


const Wallet = require('../models/wallet-model');
const User = require('../models/user-model');
const TradeTransaction = require('../models/trade-transaction-model');
const ChallengesManager = require('../challenges-manager');

/**
Trades two coins of the user.

TYPE: POST
ENDPOINT: /trade/username=

PARAMETERS:
  username: username of the user's coins to trade

BODY:
  send_coin: symbol of the wallet from which we are sending money
  rec_coin: symbol of the wallet which will be receiving money
  send_amount: the amount of coins we are trading

RESPONSE:
  msg: the message
  send_coin: the coin sent
  rec_coin: the coin received
  rec_amount: they amount of the coin received
  send_balance: the balance left for the sent coin
*/
router.post("/:username", function tradeCoins (req, res) {
  console.log('tradeCoins()', req.body);

  if(!req.session.userID){
    res.status(500).send({msg: "NOT AUTHORIZED"});
    return;
  }

  /* Make sure user, for which wallets are being retrieved, actually exists */
  User.findOne({username: req.params.username}, (err, user) => {

    if(!user){ res.status(500).send({msg: "User does not exist for this trade to happen."}); return; }
    if(err){ console.log("tradeCoins() 1: ", err); return; }

    /* Check if user has the wallet for the coin they are sending */
    Wallet.findOne({user : user._id, name: req.body.send_coin}, (err, send_wallet) => {

      /* If the user doesn't, then send an error */
      if(!send_wallet){ res.status(500).send({msg: "You do not have any " + req.body.send_coin + "."}); return; }
      if(err){ console.log("tradeCoins() 2: ", err); return; }

      /* If not enough coins in sending wallet, then return error */
      if(Number(req.body.send_amount) <= 0){
        res.status(500).send({msg: "You must trade at least 1 " + req.body.send_coin});
        return;
      }

      /* If not enough coins in sending wallet, then return error */
      if(Number(send_wallet.amount) < Number(req.body.send_amount)){
        res.status(500).send({msg: "You do not have enough " + req.body.send_coin + " in your wallet."});
        return;
      }

      /* Check if user has the wallet for the coin they are receiving */
      Wallet.findOne({user : user._id, name: req.body.rec_coin}, (err, rec_wallet) => {

        if(!rec_wallet || rec_wallet == undefined){

          console.log("doesnt exist")

          /* Create an empty wallet if wallet doesn't exist */
          createEmptyWallet(user.username, req.body.rec_coin, (add_response) => {

            if(add_response == "200: wallet added"){

              Wallet.findOne({user : user._id, name: req.body.rec_coin}, (err, rec_wallet2) => {

                /* Commit to the trade since all tests have passed */
                commitTrade(user.username, send_wallet, rec_wallet2, req.body.send_amount, (trade_resp) => {
                  if(trade_resp.status == 500){
                    res.status(500).send(trade_resp);
                  }
                  else{
                    res.send(trade_resp);
                  }
                });

              });

            }
            else{ res.status(500).send(add_response); return; }

          });

        }
        else if(err){ console.log("tradeCoins() 3: ", err); return; }
        else{

          /* If both wallets are challenge wallets, then they cannot be traded */
          if(send_wallet.challenge_currency != "" && rec_wallet.challenge_currency != ""){
            res.status(500).send({msg: "You cannot trade between challenge wallets."});
            return;
          }

          /* Can't trade between the same currencies */
          if(rec_wallet.name == send_wallet.name ||
            send_wallet.challenge_currency == rec_wallet.name ||
            rec_wallet.challenge_currency == send_wallet.name){
            res.status(500).send({msg: "You cannot trade between the same currencies."});
            return;
          }

          /* Commit to the trade since the receiving wallet exists and all prev test pass */
          commitTrade(user.username, send_wallet, rec_wallet, req.body.send_amount, (trade_resp) => {
            if(trade_resp.status == 500){
              res.status(500).send(trade_resp);
            }
            else{
              res.send(trade_resp);
            }
          });

        }

      });

    });

  });

});

function createEmptyWallet(username, name, callback){
  axios.post("http://localhost:3000/wallet/", {name: name, amount: 0, username: username, secret_key: "clock50boisonly"})
    .then(res => {
      callback(res.data);
  });
}

function commitTrade(username, send_wallet, rec_wallet, send_amnt, callback){

  /* New amount in sending wallet is it's current balance minus the sending amount */
  var new_amount = Number(send_wallet.amount) - Number(send_amnt);
  var send_currency = send_wallet.challenge_currency == "" ? send_wallet.name : send_wallet.challenge_currency;
  var rec_currency = rec_wallet.challenge_currency == "" ? rec_wallet.name : rec_wallet.challenge_currency;

  /* Update the sending wallet's amount */
  axios.post("http://localhost:3000/wallet/update", {name: send_wallet.name,
    amount: send_amnt, username: username, negative: true, secret_key: "clock50boisonly"})

    .then(res => {
      if(res.data == "200: wallet updated"){

        /* Get the exchange rate from send_wallet to rec_wallet */
        axios.get("https://min-api.cryptocompare.com/data/price?fsym=" + send_currency + "&tsyms=" + rec_currency)
          .then(res => {

            var receiving_amount = (res.data[rec_currency] * send_amnt) * 0.99;

            /* Covert the amount to rec_coin, and update the rec_wallet */
            axios.post("http://localhost:3000/wallet/update", {name: rec_wallet.name,
              amount: receiving_amount, username: username, negative: false, secret_key: "clock50boisonly"})

              .then(res => {

                /* On success, send response informing of trade between two coins */
                if(res.data == "200: wallet updated"){

                  callback({msg: "200: trade success", send_coin: send_wallet.name, rec_coin: rec_wallet.name,
                  rec_amount: receiving_amount, send_balance: new_amount, status: 200})

                  createTradeTransaction(username, send_wallet.name, new_amount, rec_wallet.name, send_amnt, receiving_amount);
                  handleChallenges(username, send_wallet.name, new_amount, rec_wallet.name, send_amnt, receiving_amount);
                }
                else{
                  callback({msg: "Trade failed.", status: 500})
                }

            })
            .catch((err) => {
              console.log("commitTrade() 1: ", err);
            });

          })
          .catch((err) => {
            console.log("commitTrade() 2: ", err);
          });
      }
      else{
        console.log("fo", res.data);
        callback({msg: "Trade failed. Failed to update sending wallet.", status: 500})
      }
  })
  .catch((err) => {
    console.log("commitTrade() 3: ", err);
  });
}

function createTradeTransaction(username, send_wallet_name, send_wallet_balance, rec_wallet_name, send_amount, rec_amount){

  /* Find the receiving wallet so we can retrieve the balance */
  Wallet.findOne({name: rec_wallet_name}, (err, rec_wallet) => {
    rec_wallet_balance = rec_wallet.amount;

    var d = new Date();

    var t1 = new TradeTransaction({
      wallet: send_wallet_name,
      type: "trade",
      date: d,
      amount: "-" + send_amount,
      balance: send_wallet_balance,
      username: username
    });

    var t2 = new TradeTransaction({
      wallet: rec_wallet_name,
      type: "trade",
      date: d,
      amount: rec_amount,
      balance: rec_wallet_balance,
      username: username
    });

    t1.save((err) => {
      if(err){ console.log("createTradeTransaction() 1: ", err); return; }
    });

    t2.save((err) => {
      if(err){ console.log("createTradeTransaction() 2: ", err); return; }
    });

  });
}

function handleChallenges(username, send_wallet_name, send_wallet_balance, rec_wallet_name, send_amount, rec_amount){
  console.log("names: ", send_wallet_name, " AND ", rec_wallet_name)
  ChallengesManager.updateValueCha(username, send_wallet_name);
  ChallengesManager.updateValueCha(username, rec_wallet_name);
}

/**
Retrieves all the trade transactions of a wallet for a specific user.

TYPE: GET
ENDPOINT: /trade/username=/wallet_name=

PARAMETERS:
  username: username of the user's trade transactions to retrieve
  wallet_name: name of the wallet's trade transactions to retrieve

*/
router.get("/transactions/:username/:wallet_name", function findTradeTrans (req, res) {
  console.log('findTradeTrans()');

  if(!req.session.userID){
    res.status(500).send("NOT AUTHORIZED");
    return;
  }

  /* Make sure user, for which wallets are being retrieved, actually exists */
  TradeTransaction.find({username: req.params.username, wallet: req.params.wallet_name}, (err, trades) => {
    if(!trades || trades.length == 0){ res.status(500).send("No trade transactions"); return; }
    if(err){ console.log(err); return; }

    res.status(200).json(trades);

  });

});

function apiTest(send_wallet, rec_wallet){

    axios.get("https://min-api.cryptocompare.com/data/price?fsym=" + send_wallet + "&tsyms=" + rec_wallet)
      .then(res => {
        console.log(res.data[rec_wallet])
      });

}


module.exports = router
