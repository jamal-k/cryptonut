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
