[![Build Status](https://travis-ci.com/NeatoRobotics/neato-sdk-js.svg?token=ByJZpJTVhxGJyseW4ZnD&branch=master)](https://travis-ci.com/NeatoRobotics/neato-sdk-js)

# Neato SDK JS
A javascript library to interact with Neato servers and robots via Ajax calls.

## Dependencies

 * [jQuery](https://jquery.com/) (> 2.2.0)
 * [hmac-sha256.js](https://code.google.com/p/crypto-js/)


## Development
You need to install Ruby and bundle the gems.

### Building
To build the minified version of the library:

```bash
$ rake build
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
