# tc2017-web

This project is the web component of the 2017 That Conference offering from Omni Resources.

## How to use

### Part 1

1. `git clone https://github.com/omni-resources/tc2017-web.git`
2. `cd tc2017-web`
3. `npm install`

### Part 2

4. `truffle compile && truffle migrate --reset` to compile your contracts
5. `ng serve` 
6. Navigate to `http://localhost:4200/`.

# tc2017-web

## How to use
There are 2 small parts to successfully running this project.

### Part 1

1. `git clone https://github.com/Nikhil22/angular2-truffle-starter-dapp.git`
2. `cd angular2-truffle-starter-dapp`
3. `npm install`

### Part 2
For the second part, be sure you're connected to an Ethereum client before running the commands below.

And then in the original tab, run:

4. `truffle compile` to compile your contracts
5. `truffle migrate` to deploy those contracts to the network
6. `ng serve`. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
7. Make sure there are no errors in browser console

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

1. Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
2. Run `truffle test` to run tests associated with your solidity smart contracts. The test folder for this can be found in the `test` directory at the root level of this project

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Technologies & Languages Used
1. Angular2 (Typescript/Javascript)
2. Truffle (Solidity)
