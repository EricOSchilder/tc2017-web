pragma solidity ^0.4.2;

contract Wager {
    event BetPlaced(
        address _sender,
        uint _amount,
        string _artist,
        uint _round,
        uint _betCount,
        uint _pot
    );

    event WinnerSet(
        address _sender,
        string _winner,
        uint _round
    );

    event RoundOver(
        uint _round,
        uint _betCount,
        uint _winnerCount,
        uint _payout,
        uint _pot,
        string _winningArtist,
        bytes32 _rawArtist
    );

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

    uint roundNumber = 0;
    mapping (uint => Round) rounds;

    function setWinningArtist(bytes artist) public {
        rounds[roundNumber].winningArtist = string(artist);
        payoutWinners();
        endRound();
        WinnerSet(msg.sender, string(artist), roundNumber);
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

        RoundOver(
            roundNumber,
            thisRound.betCount,
            thisRound.winnerCount,
            winningAmount,
            thisRound.pot,
            string(thisRound.winningArtist),
            sha3(thisRound.winningArtist));
    }

    function() payable {
        var currentRound = rounds[roundNumber];
        currentRound.bets[currentRound.betCount] = Bet(msg.sender, msg.value, string(msg.data));
        currentRound.betCount++;
        currentRound.pot += msg.value;
        BetPlaced(
            msg.sender,
            msg.value,
            string(msg.data),
            roundNumber,
            currentRound.betCount,
            currentRound.pot);
    }
}
