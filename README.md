[![Twitter](/assets/images/shiprock.jpg "Image by Mizter_X94 from Pixabay")](https://cdn.pixabay.com/photo/2016/11/22/06/47/twitter-1848505_1280.png)
# Twitter API

This project contains the basic Twitter endpoint that carries out the following:

* Signup
* Login
* Post Tweet
* Reply Tweet
* View Timeline
* Follow Another User
* Search for Users
* Search for Tweets

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

### Prerequisites

MongoDB has been setup using MongoDB Atlas. You can check the config to input your connection string.
That is your mongodb username and password.

### Installing

After forking the repository, then you will need to run the following npm command, This will install all dependencies that the application will run on:

```
npm install
```
After completing this step, you can now run the following npm command:

```
npm start
```

This will start nodemon. This has been setup in the package.json

### Design Pattern
Dependency Injection and Service Locator Pattern is heavily used in this project.

## Controller Endpoints
The sample payload can be gotten from the postman export file that is sent to the email.
You can also get the sample payload from the postman documentation

### Signup localhost:8000/api/v1/user/registration
This endpoint is responsible for signing up the new user.

### Login localhost:8000/api/v1/user/login
This endpoint is responsible for signing-in existing user. This responds with a jwt token which can be passed to the X-User-Token header for authentication and routing.

### Post Tweet localhost:8000/api/v1/user/tweet
This endpoint is responsible for posting tweets. This endpoint is authenticated.

### Reply Tweet localhost:8000/api/v1/reply/:tweet_id
This endpoint is responsible for replying to a particular tweet. This endpoint is authenticated.
The tweet_id has to be passed as a request params.

### Follow User localhost:8000/api/v1/user/follow/:user_id
This endpoint is responsible for following another user. This endpoint is authenticated.
The user_id that you want to follow has to be passed as a request params in the request url.

### Get Timeline localhost:8000/api/v1/user/timeline?page=0&limit=10
This endpoint is responsible for getting the authenticated user timeline - This contains both the latest tweets from the people the user is following and your own tweets. This endpoint is authenticated.
Pagination is also applied to this endpoint, so you can fetch the required number of data per time.

### Search Tweet localhost:8000/api/v1/user/tweet?search=query
This endpoint is responsible for searching through the tweets document collection and returns tweets that contains the query. This endpoint is authenticated.
Pagination is also applied to this endpoint, so you can fetch the required number of data per time.

### Search User localhost:8000/api/v1/user/search?user=user
This endpoint is responsible for searching through the user document collection and returns user details that contains the query. This endpoint is authenticated.
Pagination is also applied to this endpoint, so you can fetch the required number of data per time.


## Running the Unit tests

You can run the unit tests for the controller. The tests can be found in the test directory.
To run these tests, run the following npm command:

```
npm test
```

## Built With

* [Express](https://expressjs.com/) - Web framework used
* [ServiceLocator](https://www.npmjs.com/package/servicelocator) - Dependency Management

## Test Frameworks Used
* [Mocha] (https://mochajs.org/)
* [Chai] (chaijs.com) - Assertion Library
* [Sinon] (https://sinonjs.org/releases/latest/)

## Authors

* **Temitope Alagbada** - *Complete* - [alagbada](https://bitbucket.org/alagbada)

## License

This project is licensed under the MIT License
