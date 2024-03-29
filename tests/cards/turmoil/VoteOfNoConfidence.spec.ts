import {expect} from 'chai';
import {VoteOfNoConfidence} from '../../../src/server/cards/turmoil/VoteOfNoConfidence';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {runAllActions, testRedsCosts} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('VoteOfNoConfidence', function() {
  it('Should play', function() {
    const card = new VoteOfNoConfidence();
    const [game, player] = testGame(1, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    expect(card.canPlay(player)).is.not.true;

    turmoil.chairman = 'NEUTRAL';
    expect(card.canPlay(player)).is.not.true;

    const greens = game.turmoil!.getPartyByName(PartyName.GREENS);
    greens.partyLeader = player;
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(turmoil.chairman).to.eq(player);
    runAllActions(game);
    expect(player.getTerraformRating()).to.eq(15);
  });

  it('Neutral Delegate returns to Reserve', function() {
    const card = new VoteOfNoConfidence();
    const [game, player] = testGame(1, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    const neutralReserve = turmoil.getAvailableDelegateCount('NEUTRAL');
    turmoil.chairman = 'NEUTRAL';
    const greens = game.turmoil!.getPartyByName(PartyName.GREENS);
    greens.partyLeader = player;
    card.play(player);
    runAllActions(game);
    expect(turmoil.getAvailableDelegateCount('NEUTRAL')).to.eq(neutralReserve+1);
  });

  it('canPlay when Reds are in power', () => {
    const card = new VoteOfNoConfidence();
    const [game, player] = testGame(1, {turmoilExtension: true});
    const turmoil = game.turmoil!;

    // Card requirements
    turmoil.chairman = 'NEUTRAL';
    const greens = turmoil!.getPartyByName(PartyName.GREENS);
    greens.partyLeader = player;
    expect(card.canPlay(player)).is.true;

    testRedsCosts(() => player.canPlay(card), player, card.cost, 3);
  });
});
