function getCookie(name) {
    function escape(s) { return s.replace(/([.*+?\^${}()|\[\]\/\\])/g, '\\$1'); };
    var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
    return match ? match[1] : null;
}

function getCollection(callback) {

  axios.get("https://api.coinmarketcap.com/v1/ticker/")
    .then(res => {
      callback(res.data);
    });
}

function addUser() {

  axios.post("http://localhost:3000/user", {name: "test ff", username: "test2", password: "lol"})
    .then(res => {
      console.log(res.data);
      addWallet();
    });
}

function addWallet() {

  axios.post("http://localhost:3000/wallet/", {name: "BTC", amount: 0.4444, username: "test2"})
    .then(res => {
      console.log(res.data);
      getWallets();
    });
}

function getWallets() {

  axios.get("http://localhost:3000/wallet/lolddsr")
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

// use the following to test your functions
getCollection(function(array){
  console.log("Total items in collection ",array.length)
  console.log("First item in collection ",array[0])
})

getSortedCollection(function(array) {
  console.log("Collection sorted ",array)
})

getWallets();
