[![Build Status](https://travis-ci.com/NeatoRobotics/neato-sdk-js.svg?token=ByJZpJTVhxGJyseW4ZnD&branch=master)](https://travis-ci.com/NeatoRobotics/neato-sdk-js)

# Neato SDK JS

The Neato JavaScript SDK enables easy interaction with Neato servers and robots via Ajax calls. The official Javascript SDK (Beta release) for the Neato API services can be found at this [link](https://github.com/NeatoRobotics/neato-sdk-js).

To boost your development, you can also check the *sample application*.

> This is a beta version. It is subject to change without prior notice.

## Preconditions

 - Create the Neato user account via the Neato portal or from the official Neato App
 - Link the robot to the user account via the official Neato App

## Demo
An example app can be found in the [demo](/demo) folder.

For your convenience, an online demo can be seen on the [Neato Developer Network](https://developers.neatorobotics.com) at the address:
[https://developers.neatorobotics.com/demo/sdk-js](https://developers.neatorobotics.com/demo/sdk-js)

## Setup
In order to use the Neato SDK JS simply import the *jQuery* and *hmac-sha256* dependencies and the *neato-x.y.z.min.js* file:

``` xml
<script src="//ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/hmac-sha256.js"></script>
<script src="../lib/neato-0.7.0.min.js"></script>
```

## Usage
The Neato SDK has 3 main roles:

1. Handling OAuth authentications
2. Simplifying users info interactions
3. Managing communication with Robots

These tasks are handled by two classes: `Neato.User` and `Neato.Robot`.

### Authentication
The Neato SDK leverages on OAuth 2 to perform user authentication.

#### 1. Retrieve your client_id, scopes and redirect_url
Before start please retrieve your *client_id*, *scopes* and *redirect_uri* you entered during the creation of your app on the Neato Developer Portal. These values must match in order to authenticate the user.


#### 2. Start the authentication flow
To start the authentication flow simply invoke the *login()* method on the user object passing the above data:

```javascript
var user = new Neato.User();
user.login({
  clientId:    "your_app_client_id",
  scopes:      "control_robots+email",
  redirectUrl: "your_redirect_uri"
});
```

The SDK will start the authentication flow navigating to the Neato authentication page where the user inserts his Neato account credentials and accept your app to handle your Neato data. If the authentication is successful, you will be redirected to the redirect uri page and an *access_token* parameters will be passed into the url.

#### 3. Check if the user is now connected

There's no need to parse the token yourself, the SDK handles it for you. You only have to check if the user is now connected to the Neato server or not:

```javascript
var user = new Neato.User();
user.isConnected()
  .done(function () {
    // ok you can retrieve your robot list now
  }).fail(function () {
    // authentication failure or user not yet logged in
  });
```

In order to understand why the *isConnected()* method returns failure, you can use these methods on the user object:

```javascript
if(user.authenticationError()) {
  // OAuth authentication failed/denied
} else if(!user.connected && user.token != null) {
  // invalid / expired token
} else {
  // nothing to do here, show the login form to the user
}
```

### Working with Users
Once the user is authenticated you can retrieve user information using the `NeatoUser` class:

```javascript
user.getUserInfo()
  .done(function (data) {
    var email = data.email || "";
  })
  .fail(function (data) {
    // server call error
  });
```
#### Get user robots
To get the user robot list you can do this:

```javascript
user.getRobots()
  .done(function (robots) {
    // now user.robots contains the NeatoRobots array
  })
  .fail(function (data) {
    // server call error
  });
```

*NeatoRobot* is a special class we have developed for you that can be used to directly invoke commands on the robot.

To count the robots do this:

``` javascript
var count = user.robots.length;
```

To retrieve a specific robot by serial number do this:

``` javascript
var robot = user.getRobotBySerial(serial);
```

### Communicating with Robots
Now that you have the robots for an authenticated user it’s time to communicate with them.
In the previous call you've seen how easy it is to retrieve `NeatoRobot` instances for your current user. Those instances are ready to receive messages from your app (if the robots are online obviously).

#### The robot status
Before, we saw how to retrieve the robot list from the `NeatoUser` class. It is best practice to check the robot state before sending commands, otherwise the robot may be in a state that cannot accept the command and return an error code. To update/get the robot state do this:

```javascript
robot.connect();
```

This method starts polling for the robot state every X seconds and invoke the *onStateChanged()* if a state change occurs.

So, if you are interested in these events you can do this:

``` javascript
robot.onConnected =  function () {
  console.log(robot.serial + " got connected");
};
robot.onDisconnected =  function (status, json) {
  console.log(robot.serial + " got disconnected");
};
robot.onStateChange =  function () {
  console.log(robot.serial + " got new state:", robot.state);
};
robot.connect();
```

#### Sending commands to a Robot
An online robot is ready to receive your commands like `startCleaning`. Some commands require parameters while others don't, see the API doc for details.

Pause cleaning doesn't require parameters:

```javascript
robot.pauseCleaning();
```

Get general info doesn't require parameters:

```javascript
robot.generalInfo();
```

Start cleaning requires parameters like the cleaning type (clean all house or spot), the cleaning mode (eco or turbo) and, in case of spot cleaning, the spot cleaning parameters (large or small area, 1x or 2x).

```javascript
robot.startCleaning({
  category: 2,
  mode: 1,
  modifier: 1,
  navigationMode: 1
});
```

#### Working with Robot schedule
To enable or disable all the schedule:

```javascript
robot.enableSchedule();
robot.disableSchedule();
```

To schedule a robot clean every Monday at 3:00pm:

```javascript
robot.setSchedule({
  1: { mode: 1, startTime: "15:00" }
});
```

To schedule a robot clean everyday at 3:00pm:

```javascript
robot.setSchedule({
  0: { mode: 1, startTime: "15:00" },
  1: { mode: 1, startTime: "15:00" },
  2: { mode: 1, startTime: "15:00" },
  3: { mode: 1, startTime: "15:00" },
  4: { mode: 1, startTime: "15:00" },
  5: { mode: 1, startTime: "15:00" },
  6: { mode: 1, startTime: "15:00" }
});
```

*Note: not all robot models support the eco/turbo cleaning mode. You should check the robot available services before sending those parameters.*



#### Checking robot available services

Different robot models and versions have different features. So before sending commands to the robot you should check if that command is available on the robot. Otherwise the robot will respond with an error. You can check the available services on the robot:

```javascript
var availableServices = robot.state.availableCommands;
```

In addition there are some utility methods you can use to check if the robot supports the services.

```javascript
if(availableServices["findMe"]) {
  //robot has the findMe service
}
```

## Dependencies

 * [jQuery](https://jquery.com/) (> 2.2.0)
 * [hmac-sha256.js](https://code.google.com/p/crypto-js/)

## Development
Install Ruby and bundle the gems.

```
$ bundle install
```

### TDD
Start [Jasmine](http://jasmine.github.io/) with:

```bash
$ rake jasmine
```

Point your browser to [http://localhost:8888](http://localhost:8888) to see the test results.

### CI
To run tests:

```bash
$ rake
```

## Building
To build the minified version of the library:

```bash
$ rake build
```
