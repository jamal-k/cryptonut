function getCollection(callback) {

  axios.get("https://api.coinmarketcap.com/v1/ticker/")
    .then(res => {
      callback(res.data);
    });
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
