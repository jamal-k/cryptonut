function getCookie(name) {
    function escape(s) { return s.replace(/([.*+?\^${}()|\[\]\/\\])/g, '\\$1'); };
    var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
    return match ? match[1] : null;
}

var deleteCookie = function(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

function getCollection(callback) {

  axios.get("https://api.coinmarketcap.com/v1/ticker/")
    .then(res => {
      callback(res.data);
    });
}


/**
  Search coins
*/
$("#search_coins_fld").keyup((e) => {

    filter = e.target.value.toUpperCase();
    tr = $("#all_coins > tbody > tr");
    for (i = 0; i < tr.length; i++) {
        if (tr[i].getElementsByTagName("p")[0].innerHTML.toUpperCase().indexOf(filter) > -1 ||
        tr[i].getElementsByTagName("p")[1].innerHTML.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
});

function addUser() {

  axios.post("https://cryptonut.herokuapp.com/user", {name: "test ff", username: "test2", password: "lol"})
    .then(res => {
      console.log(res.data);
      addWallet();
    });
}

function addWallet() {

  axios.post("https://cryptonut.herokuapp.com/wallet/", {name: "BTC", amount: 0.4444, username: "test2"})
    .then(res => {
      console.log(res.data);
      getWallets();
    });
}

function getWallets() {

  axios.get("https://cryptonut.herokuapp.com/wallet/lolddsr")
    .then(res => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log("error", err.response.data);
    })
}

function getSortedCollection(callback) {
  let args = {
    url: "https://api.coinmarketcap.com/v1/ticker/"
  };

  axios.get("https://api.coinmarketcap.com/v1/ticker/")
    .then(res => {
      callback(res.data.sort(function(a, b){
        return a.name.localeCompare(b.name);
      }));
    });
}
