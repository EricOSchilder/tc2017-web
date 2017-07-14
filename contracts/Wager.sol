pragma solidity ^0.4.2;

contract Wager {
    event BetPlaced(address from, string artist, uint totalPot);
    event RoundOver(address[] winners, uint payout, uint contractBalance, uint totalPot);

    uint roundNumber;
    mapping(uint => Round) rounds;

    struct Round {
        mapping(bytes => address[]) bets;
        bool isRoundCashed;
        uint pot;
    }

    function endRound(bytes artist) public {
        var thisRound = rounds[roundNumber];

        if(thisRound.isRoundCashed) {
            return;
        }

        if(thisRound.bets[artist].length == 0) {
            roundNumber++;
            rounds[roundNumber].pot = thisRound.pot;
            return;
        }

        var payout = thisRound.pot/thisRound.bets[artist].length;

        for(uint128 i = 0; i < thisRound.bets[artist].length; i++) {
            thisRound.bets[artist][i].transfer(payout);
        }

        thisRound.isRoundCashed = true;
        roundNumber++;
        RoundOver(thisRound.bets[artist], payout, this.balance, thisRound.pot);
    }

    function bet(address from, bytes artist) payable {
        var thisRound = rounds[roundNumber];

        if(msg.value != 1 ether || artist.length == 0) {
            return;
        }

        thisRound.pot += msg.value;
        thisRound.bets[artist].push(from);
        BetPlaced(from, string(artist), thisRound.pot);
    }
}
