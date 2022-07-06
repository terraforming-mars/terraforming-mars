import {expect} from 'chai';
import {VoteOfNoConfidence} from '../../../src/cards/turmoil/VoteOfNoConfidence';
import {Game} from '../../../src/Game';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {isPlayerId, PlayerId} from '../../../src/common/Types';

describe('VoteOfNoConfidence', function() {
  it('Should play', function() {
    const card = new VoteOfNoConfidence();
    const player = TestPlayers.BLUE.newPlayer();

    const gameOptions = setCustomGameOptions();
    const game = Game.newInstance('gameid', [player], player, gameOptions);
    const turmoil = game.turmoil!;
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    turmoil.chairman = 'NEUTRAL';
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    const greens = game.turmoil!.getPartyByName(PartyName.GREENS)!;
    greens.partyLeader = player.id;
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(isPlayerId(turmoil.chairman)).is.true;
    expect(game.getPlayerById(turmoil.chairman as PlayerId)).to.eq(player);
    expect(player.getTerraformRating()).to.eq(15);
  });
});
