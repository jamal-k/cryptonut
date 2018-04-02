# Team

- Hamza Yousaf | yousafh1
- Shahmir Ali | alishah
- Jamal Khan | khanjam9

# Project Outline

Users can open a simulated trading account to purchase and trade various cryptocurrencies. They can track their investments' growth and manage account funds. Users can participate in unique weekly and monthly challenges focused around maximizing investment value with limited starting funds. Leaderboard rankings and recognition for the top investors will be available for each challenge.

The Cryptocurrency Market Capitalizations API will be used to acquire and update market data, including prices for numerous cryptocurrencies. Additional information such as volume and historical prices will also be provided for market analytics. Market data received from the API will be displayed to users in a form that allows for easy comparison between prices, to assist investment decisions.

# API Use

We selected the coinmarketcap API for our project:

https://coinmarketcap.com/api/

We will use the API to provide the user with market information about a particular currency which will allow them to buy/sell their holdings of a currency based on that information. 

The coinmarketcap API is well documented. It provides API usage and response examples and shows ways of adding parameters to the headers to get more filtered results. The API uses RESTful notation well: It uses nouns but no verbs in its resource structure, for example it uses the /v1/ticker resource and /v1/global resource. The GET methods do not alter states, it uses plural nouns wherever possible, uses sub-resources for relations, provides filtering such as allowing to set limits and convert currencies, and it is also versioned as 'v1' to differentiate it from different versions of the API. The API only supports GET as it requires you to retrieve information about currencies, but not modify any information as that doesn't make sense since it will jeapordize the exchange. 

We will integrate the list of currencies returned by the API by providing market information for the user when they are trading. The user will be able to view information on a particular currency such as price in another currency, available/total supply, percentage change in the last 23 hours, etc. This information will influence the decision of the user as it will allow them to decide at what market price to buy/sell the currency at. 

# API

## User:

### Add User:

    Creates the user and adds it to the database.

    TYPE: POST

    ENDPOINT: /user/

    BODY:
      email: email of the user to create
      username: username of the user to create
      password: password of the user to create
      
### Login User:

    Logs the user in by authenticating with DB and then creating a session.

    TYPE: POST
    
    ENDPOINT: /user/login

    BODY:
      username: username of the user to logged in
      password: password of the user to log in

### Logout User:

    Logs the user out by deleting the session.

    TYPE: GET

    ENDPOINT: /user/logout
    
### Check Auth:

    Checks if the user is already logged in.

    TYPE: GET
    
    ENDPOINT: /user/checkauth


## Wallet:

### Get All User Wallets

    Retrieves all the wallets for a specific user.

    TYPE: GET
    
    ENDPOINT: /wallet/username=

    PARAMETERS:
      username: username of the user's wallets to retrieve
      
### Get A User Wallet

    Retrieves specified wallet for the user.

    TYPE: GET
    
    ENDPOINT: /wallet/username=/wallet=

    PARAMETERS:
      username: username of the user's wallet to retrieve
      wallet: the name of the wallet to retrieve
      
### Add Wallet

    Adds a wallet to the database for a specific user.

    TYPE: POST
    
    ENDPOINT: /wallet/

    BODY:
      username: username of the user to add wallet to
      name: name of the wallet being added
      secret_key: required to make calls to this api endpoint
      
### Update Wallet

    Updates a user's specific wallet's amount.

    TYPE: POST
    
    ENDPOINT: /wallet/name=/username=

    BODY:
      username: username of the user for which the wallet is being updated
      name: name of the wallet being updated
      amount: the amount to add (or subtract if negative) from the wallet
      secret_key: required to make calls to this api endpoint
 
 
## Trade:

### Trade Coins

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
      Code 200 Success: 
        Content: [ {
        msg: the message
        send_coin: the coin sent
        rec_coin: the coin received
        rec_amount: they amount of the coin received
        send_balance: the balance left for the sent coin  } ]
      Code 500 Internal Server Error: 
        Content: { msg: "[error message]" }

### Get All Trade Transactions

    Retrieve all the trade transactions of a wallet for a specific user.

    TYPE: GET
    
    ENDPOINT: /trade/username=/wallet_name=

    PARAMETERS:
      username: username of the user's trade transactions to retrieve
      wallet_name: name of the wallet's trade transactions to retrieve

## Achievement:

### Get Achievements

    Return a list of all achievements. 

    TYPE: GET 

    ENDPOINT: /achievement/username= 

    PARAMETERS: 
      username: username of the user's achievements to get 

    RESPONSE: 
        Code 200 Success: 
           Content: [ { name, progress, username, description } ]
        Code 500 Internal Server Error: 
           Content: { msg: "[error message]" }
           
## Challenge:

### Get Challenges

    Return a list of all challenges of a given name.

    TYPE: GET
    
    ENDPOINT: /challenge/name=

    PARAMETERS:
      name: the unique name of the challenges to return

    RESPONSE: 
        Code 200 Success: 
           Content: [ { name, progress, username, description } ]
        Code 500 Internal Server Error: 
           Content: { msg: "[error message]" }
      
### Get All Challenges

    Return a list of all challenges

    TYPE: GET
    
    ENDPOINT: /challenge

    RESPONSE: 
        Code 200 Success: 
           Content: [ { name, progress, username, description } ]
        Code 500 Internal Server Error: 
           Content: { msg: "[error message]" }
      
## Extension

### Get Coins With User

    Returns a list of coins from the coinmarket API and the coins the user owns.

    TYPE: GET
    
    ENDPOINT: extension/coins/username=

    PARAMETERS:
      username: the user's owned coins to retrieve

    RESPONSE:
      coins_owned: a list of coins

