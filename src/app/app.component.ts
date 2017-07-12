import { Component } from '@angular/core';
const Web3 = require('web3');
const contract = require('truffle-contract');
//const metaincoinArtifacts = require('../../build/contracts/MetaCoin.json');
const wagerArtifacts = require('../../build/contracts/Wager.json')
import { canBeNumber } from '../util/validation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  Wager = contract(wagerArtifacts);

  // TODO add proper types these variables
  account: any;
  accounts: any;
  web3: any;

  balance: number;
  sendingAmount: number;
  recipientAddress: string;
  status: string;
  canBeNumber = canBeNumber;

  constructor() {
    this.checkAndInstantiateWeb3();
    this.onReady();
  }

  checkAndInstantiateWeb3 = () => {
    this.web3 = new Web3(new Web3.providers.HttpProvider("http://bcjl3x55m.eastus.cloudapp.azure.com:8545"));
  }

  placeBet = () => {
    this.Wager.deployed()
      .then((instance) => {
        this.web3.personal.sendTransaction({
          from:"0x3f86b73c5248c1edae7fb33353f9aa6476938102", 
          to:instance.address, 
          value:this.web3.toWei(100, "ether"), 
          data:this.web3.toHex("Jake Paul"),
          gas:1000000}, "Travis")
      })
      .then(() => {
        this.refreshBalance();
      })
  }

  endRound = () => {
    this.Wager.deployed()
      .then((instance) => {
        instance.setWinningArtist(this.web3.toHex("Jake Paul"), { 
          from: "0x72e98c3c1be92b3195fa3a6dc62ca90e77e6f9be"
        })
      })
      .then(() => {
        this.refreshBalance();
      })
  }

  onReady = () => {
    this.refreshBalance();
    this.Wager.setProvider(this.web3.currentProvider);

    this.Wager.deployed()
      .then((instance) => {

        var betPlaced = instance.BetPlaced();
        betPlaced.watch(function(error, result) {
          if(!error) {
            console.log("sender: " + result.args._sender + "\n"
              + "amount: " + result.args._amount.toNumber() + "\n"
              + "artist: " + result.args._artist + "\n"
              + "currentRound: " + result.args._round.toNumber() + "\n"
              + "betCount: " + result.args._betCount.toNumber() + "\n"
              + "roundPot: " + result.args._pot.toNumber());
            console.log(result);
          }
        })

        var winnerSet = instance.WinnerSet();
        winnerSet.watch(function(error, result) {
          if(!error) {
            console.log("sender: " + result.args._sender + "\n"
              + "winner: " + result.args._winner + "\n"
              + "round: " + result.args._round.toNumber());
            console.log(result);
          }
        })

        var roundOver = instance.RoundOver();
        roundOver.watch(function(error, result) {
          if(!error) {
            console.log("round: " + result.args._round + "\n"
              + "betCount: " + result.args._betCount.toNumber() + "\n"
              + "winnerCount: " + result.args._winnerCount + "\n"
              + "payout: " + result.args._payout.toNumber() + "\n"
              + "pot: " + result.args._pot.toNumber() + "\n"
              + "winningArtist: " + result.args._winningArtist.toNumber() + "\n"
              + "rawArtist: " + result.args._rawArtist);
            console.log(result);
          }
        })
      })

    this.web3.eth.filter('pending').watch(function(error, result) {
      if(!error) {
        console.log(result);
      }
    })

    // Get the initial account balance so it can be displayed.
    this.web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
      this.accounts = accs;
      this.account = this.accounts[0];
    });
  }

  refreshBalance = () => {
    this.balance = this.web3.fromWei(this.web3.eth.getBalance("0x3f86b73c5248c1edae7fb33353f9aa6476938102").toNumber(), "ether");
  }

  setStatus = (message) => {
    this.status = message;
  }

  /*sendCoin = () => {
    const amount = this.sendingAmount;
    const receiver = this.recipientAddress;
    let meta;

    this.setStatus("Initiating transaction... (please wait)");

    this.MetaCoin.deployed()
      .then((instance) => {
        meta = instance;
        return meta.sendCoin(receiver, amount, {
          from: this.account
        });
      })
      .then(() => {
        this.setStatus("Transaction complete!");
        this.refreshBalance();
      })
      .catch((e) => {
        console.log(e);
        this.setStatus("Error sending coin; see log.");
      });
  }*/
}
