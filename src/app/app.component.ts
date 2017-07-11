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
  //MetaCoin = contract(metaincoinArtifacts);
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
    
    this.Wager.deployed()
      .then((instance) => {
        instance.BetPlaced().watch(function(res,err){
          console.log(res);
        })
        
        /*subscribe(res => {
          console.log(res);
        }, err => {
          console.log(err);
        })*/
      })
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
          value:100000000000000000000, 
          data:this.web3.toHex("Jake Paul")}, "Travis")
      })
  }

  endRound = () => {
    this.Wager.deployed()
      .then((instance) => {
        instance.setWinningArtist(this.web3.toHex("Jake Paul"), { 
          from: "0x72e98c3c1be92b3195fa3a6dc62ca90e77e6f9be"
        })
      })
  }

  onReady = () => {
    // Bootstrap the MetaCoin abstraction for Use.
    //this.MetaCoin.setProvider(this.web3.currentProvider);
    this.Wager.setProvider(this.web3.currentProvider);

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

      //this.refreshBalance();
    });
  }

  /*refreshBalance = () => {
    let meta;
    this.MetaCoin.deployed()
      .then((instance) => {
        meta = instance;
        return meta.getBalance.call(this.account, {
          from: this.account
        });
      })
      .then((value) => {
        this.balance = value;
      })
      .catch((e) => {
        console.log(e);
        this.setStatus("Error getting balance; see log.");
      });
  }

  setStatus = (message) => {
    this.status = message;
  }

  sendCoin = () => {
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
