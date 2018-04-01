Achievement:

Return a list of all achievements.
TYPE: GET
ENDPOINT: /achievement/username=
PARAMETERS:
  username: username of the user's achievements to get
RESPONSE:
  achievements: a list of achievements of the given user


Challenge:

Return a list of all challenges of a given name.
TYPE: GET
ENDPOINT: /challenge/name=
PARAMETERS:
  name: the unique name of the challenges to return
RESPONSE:
  achievements: a list of achievements of the given user

Return a list of all challenges
TYPE: GET
ENDPOINT: /challenge
RESPONSE:
  challenges: a list of challenges

Start  a given challenge for the user.
TYPE: POST
ENDPOINT: /challenge
BODY:
  username: the user for which to start the challenge
  name: the name of the challenge to start

Return a list of all challenges of a given name.
TYPE: GET
ENDPOINT: /challenge/name=
PARAMETERS:
  name: the unique name of the challenges to return
RESPONSE:
  achievements: a list of achievements of the given user


Trade:
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

Retrieves all the trade transactions of a wallet for a specific user.
TYPE: GET
ENDPOINT: /trade/username=/wallet_name=
PARAMETERS:
  username: username of the user's trade transactions to retrieve
  wallet_name: name of the wallet's trade transactions to retrieve


User:

Creates the user and adds it to the database.
TYPE: POST
ENDPOINT: /user/
BODY:
  email: email of the user to create
  username: username of the user to create
  password: password of the user to create

Logs the user in by authenticating with DB and then creating a session.
TYPE: POST
ENDPOINT: /user/login
BODY:
  username: username of the user to logged in
  password: password of the user to log in

Logs the user out by deleting the session.
TYPE: GET
ENDPOINT: /user/logout

Checks if the user is already logged in.
TYPE: GET
ENDPOINT: /user/checkauth


Wallet:

Retrieves all the wallets for a specific user.
TYPE: GET
ENDPOINT: /wallet/username=
PARAMETERS:
  username: username of the user's wallets to retrieve

Retrieves specified wallet for the user.
TYPE: GET
ENDPOINT: /wallet/username=/wallet=
PARAMETERS:
  username: username of the user's wallet to retrieve
  wallet: the name of the wallet to retrieve

Adds a wallet to the database for a specific user.
TYPE: POST
ENDPOINT: /wallet/
BODY:
  username: username of the user to add wallet to
  name: name of the wallet being added
  secret_key: required to make calls to this api

Updates a user's specific wallet's amount.
TYPE: POST
ENDPOINT: /wallet/name=/username=
BODY:
  username: username of the user for which the wallet is being updated
  name: name of the wallet being updated
  amount: the amount to add (or subtract if negative) from the wallet
  secret_key: required to make calls to this api
