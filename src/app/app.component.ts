import { Component } from '@angular/core';
const Web3 = require('web3');
const contract = require('truffle-contract');
//const metaincoinArtifacts = require('../../build/contracts/MetaCoin.json');
const wagerArtifacts = require('../../build/contracts/Wager.json')
import { canBeNumber } from '../util/validation';
const SolidityFunction = require('web3/lib/web3/function');
const _ = require('lodash');
const Tx = require('ethereumjs-tx');
declare const Buffer;

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
  currentArtist: string;

  betArtist: string;
  pKey: string;

  winningArtist: string;

  status: string;
  canBeNumber = canBeNumber;

  constructor() {
    this.checkAndInstantiateWeb3();
    this.onReady();
  }

  checkAndInstantiateWeb3 = () => {
    this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  unlockAccount = () => {
    this.web3.personal.unlockAccount("0xe50c83d4d2136e2972c5b67a9544af403d192dd4", this.pKey, 1)
  }

  placeBet = () => {
    this.Wager.deployed()
      .then((instance) => {
        const artist = this.betArtist;
        const pKey = this.pKey;
        
        //this.web3.personal.unlockAccount("0xafe52045b68d0650209b6209684890dc2bcbae96", pKey, 2);
        instance.bet.sendTransaction( 
        this.web3.toHex(artist), 
        {
          from:"0xafe52045b68d0650209b6209684890dc2bcbae96", 
          to:instance.address, 
          value:this.web3.toWei(1, "ether"), 
          gas:4712388
        })
      })
      .then( () => {
        this.refreshBalance();
      })
  }

  endRound = () => {
    this.Wager.deployed()
      .then((instance) => {
        instance.endRound.sendTransaction(
          this.web3.toHex("Bon Jovi"),
          this.web3.toHex("{ \"artist\": \"Bon Jovi\" }"),
          { 
            from:"0x459ff107403c90ac2ca9340e6421d9d9282399f2",
            gas:4712388
          }
        )
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
        let betPlaced = instance.BetPlaced();
        betPlaced.watch(function(error, result) {
          if(!error) {
            console.log("from: " + result.args.from + "\n"
              + "artist: " + result.args.artist + "\n"
              + "totalPot: " + result.args.totalPot.toNumber());
            console.log(result);
          }
        })

        let roundOver = instance.RoundOver();
        roundOver.watch((error, result) => {
          if(!error) {
            console.log("payout: " + result.args.payout.toNumber() + "\n"
              + "contractBalance: " + result.args.contractBalance.toNumber() + "\n"
              + "totalPot: " + result.args.totalPot.toNumber() + "\n");
            console.log(result.args.winners);
            console.log(result);

            this.winningArtist = JSON.parse(result.args.songData).artist;
            this.refreshBalance();
          }
        })
      })

    this.web3.eth.filter('pending').watch(function(error, result) {
      if(!error) {
        console.log(result);
      }
    })

    /*this.web3.eth.getAccounts((err, accs) => {
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
    });*/
  }

  refreshBalance = () => {
    this.balance = this.web3.fromWei(this.web3.eth.getBalance("0xafe52045b68d0650209b6209684890dc2bcbae96").toNumber(), "ether");
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
