Achievement:

Return a list of all achievements.
TYPE: GET
ENDPOINT: /achievement/username=
PARAMETERS:
  username: username of the user's achievements to get
RESPONSE:
  Code 200 Success:
    Content: { achievements: [list of achievements] }
  Code 500 Internal Server Error:
    Content: { msg: "[error message]" }


Challenge:

Return a list of all challengers and their progress of a given challenge.
TYPE: GET
ENDPOINT: /challenge/name=
PARAMETERS:
  name: the name of the challenge
RESPONSE:
  Code 200 Success:
    Content: { challenges: [list of challengers with progress for each] }
  Code 500 Internal Server Error:
    Content: { msg: "[error message]" }

Return a list of all challenges.
TYPE: GET
ENDPOINT: /challenge
RESPONSE:
  Code 200 Success:
    Content: { challenges: [list of challenges] }
  Code 500 Internal Server Error:
    Content: { msg: "[error message]" }

Start a given challenge for a user.
TYPE: POST
ENDPOINT: /challenge
BODY:
  { username: "username",
    name: "challenge_name" }
RESPONSE:
  Code 200 Success:
    Content: { msg: "200: challenge started" }
  Code 500 Internal Server Error:
    Content: { msg: "[error message]" }


Trade:

Trade two coins of a user.
TYPE: POST
ENDPOINT: /trade/username=
PARAMETERS:
  username: username of the user's coins to trade
BODY:
  { send_coin: "sending_wallet_symbol",
    rec_coin: "receiving_wallet_symbol",
    send_amount: integer coin amount }
RESPONSE:
  Code 200 Success:
    Content :
	  { msg: "",
	    send_coin: "sent_coin",
		rec_coin: "received_coin",
		rec_amount: integer coin amount,
		send_balance: integer remaining balance of sent coin }
  Code 500 Internal Server Error:
    Content: { msg: "[error message]" }

Retrieve all the trade transactions of a wallet for a user.
TYPE: GET
ENDPOINT: /trade/username=/wallet_name=
PARAMETERS:
  username: username of the user's trade transactions to retrieve
  wallet_name: name of the wallet's trade transactions to retrieve
RESPONSE:
XXXXXXXXXXXXXXXXXXXXXXXXXXXX TODO XXXXXXXXXXXXXXXXXXXXXXXXXXXX


User:

Create the user and adds it to the database.
TYPE: POST
ENDPOINT: /user/
BODY:
  { email: "email",
    username: "username",
    password: "password" }
RESPONSE:
  Code 200 Success:
    Content: { msg: "200: success" }
  Code 500 Internal Server Error:
    Content: { msg: "[error message]" }

Log the user in by authenticating with DB and then creating a session.
TYPE: POST
ENDPOINT: /user/login
BODY:
  { username: "username",
    password: "password" }
RESPONSE:
  Code 200 Success:
    Content: { msg: "200: login success" }
  Code 500 Internal Server Error:
    Content: { msg: "500: login failed" }

Log the user out by deleting the session.
TYPE: GET
ENDPOINT: /user/logout
RESPONSE:
  Code 200 Success:
    Content: { msg: "200: logout success" }
  Code 500 Internal Server Error:
    Content: { msg: "500: logout failed" }

Checks if the user is already logged in.
TYPE: GET
ENDPOINT: /user/checkauth
RESPONSE:
XXXXXXXXXXXXXXXXXXXXXXXXXXXX TODO XXXXXXXXXXXXXXXXXXXXXXXXXXXX


Wallet:

Retrieve all the wallets for a specific user.
TYPE: GET
ENDPOINT: /wallet/username=
PARAMETERS:
  username: username of the user's wallets to retrieve
RESPONSE:
XXXXXXXXXXXXXXXXXXXXXXXXXXXX TODO XXXXXXXXXXXXXXXXXXXXXXXXXXXX

Retrieve specified wallet for the user.
TYPE: GET
ENDPOINT: /wallet/username=/wallet=
PARAMETERS:
  username: username of the user's wallet to retrieve
  wallet: the name of the wallet to retrieve
RESPONSE:
XXXXXXXXXXXXXXXXXXXXXXXXXXXX TODO XXXXXXXXXXXXXXXXXXXXXXXXXXXX

Add a wallet to the database for a specific user.
TYPE: POST
ENDPOINT: /wallet/
BODY:
  { username: "username",
    name: "wallet_name",
	secret_key: "key" }
RESPONSE:
  Code 200 Success:
    Content: { msg: "200: wallet added" }
  Code 500 Internal Server Error:
    Content: { msg: "[error message]" }

Update a user's specific wallet's amount.
TYPE: POST
ENDPOINT: /wallet/name=/username=
BODY:
  { username: "username",
    name: "wallet_name",
	amount: integer amount to modify wallet by,
	secret_key: "key" }
RESPONSE:
  Code 200 Success:
    Content: { msg: "200: wallet updated" }
  Code 500 Internal Server Error:
    Content: { msg: "[error message]" }
