import {expect} from 'chai';
import {VoteOfNoConfidence} from '../../../src/server/cards/turmoil/VoteOfNoConfidence';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {runAllActions, testGameOptions} from '../../TestingUtils';
import {isPlayerId, PlayerId} from '../../../src/common/Types';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('VoteOfNoConfidence', function() {
  it('Should play', function() {
    const card = new VoteOfNoConfidence();
    const game = newTestGame(1, testGameOptions({turmoilExtension: true}));
    const player = getTestPlayer(game, 0);
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
    runAllActions(game);
    expect(player.getTerraformRating()).to.eq(15);
  });
});
