pragma solidity ^0.4.2;

contract Wager {
    event BetPlaced(
        address _sender,
        uint _amount,
        string _artist,
        uint _pot
    );

    address public owner = msg.sender;

    struct Round {
        uint betCount;
        uint winnerCount;
        string winningArtist;
        uint pot;
        bool isCashed;
        mapping (uint => Bet) bets;
        mapping (uint => Winner) winners;
    }

    struct Bet {
        address addr;
        uint amount;
        string artist;
    }

    struct Winner {
        address addr;
        uint amount;
    }

    uint roundNumber;
    mapping (uint => Round) rounds;

    modifier onlyBy(address _account)
    {
        if (msg.sender != _account) {
            throw;
        }
        _;
    }
    
    function setWinningArtist(string artist) public onlyBy(owner) {
        rounds[roundNumber].winningArtist = artist;
        payoutWinners();
        endRound();
    }

    function endRound() private {
        rounds[roundNumber].isCashed = true;
        roundNumber++;
    }

    function payoutWinners() private {
        var thisRound = rounds[roundNumber];

        if(thisRound.isCashed) {
            return;
        }

        for(var i = 0; i < thisRound.betCount; i++) {
            var thisBet = thisRound.bets[i];
            if(sha3(thisBet.artist) == sha3(thisRound.winningArtist)) {
                thisRound.winners[thisRound.winnerCount] = Winner(thisBet.addr, 0);
                thisRound.winnerCount++;
            }
        }

        var winningAmount = thisRound.pot/thisRound.winnerCount;
        for(var j = 0; j < thisRound.winnerCount; j++) {
            thisRound.winners[j].amount = winningAmount;
            thisRound.winners[j].addr.transfer(winningAmount);
        }
    }

    function bet() public {
        var currentRound = rounds[roundNumber];
        currentRound.bets[currentRound.betCount] = Bet(msg.sender, msg.value, string(msg.data));
        currentRound.betCount++;
        rounds[roundNumber].pot += msg.value;
        BetPlaced(msg.sender, msg.value, string(msg.data), rounds[roundNumber].pot);
    }
}