import {expect} from 'chai';
import {ElectionSponsorship} from '../../../src/server/cards/underworld/ElectionSponsorship';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {SelectParty} from '../../../src/server/inputs/SelectParty';

describe('ElectionSponsorship', () => {
  it('play', () => {
    const card = new ElectionSponsorship();
    const [game, player] = testGame(2, {turmoilExtension: true});
    const turmoil = Turmoil.getTurmoil(game);

    expect(player.underworldData.corruption).eq(0);

    cast(card.play(player), undefined);
    runAllActions(game);

    expect(turmoil.getAvailableDelegateCount(player.id)).eq(7);

    const marsFirst = turmoil.getPartyByName(PartyName.MARS);

    expect(turmoil.getAvailableDelegateCount(player.id)).eq(7);
    expect(marsFirst.delegates.get(player.id)).eq(0);

    const selectParty = cast(player.popWaitingFor(), SelectParty);
    selectParty.cb(marsFirst.name);

    expect(turmoil.getAvailableDelegateCount(player.id)).eq(6);
    expect(marsFirst.delegates.get(player.id)).eq(1);

    expect(player.underworldData.corruption).eq(1);
  });

  it('effect', () => {
    const card = new ElectionSponsorship();
    const [game, player] = testGame(2, {turmoilExtension: true});
    const turmoil = Turmoil.getTurmoil(game);

    expect(turmoil.getPlayerInfluence(player)).eq(0);

    player.playedCards = [card];

    expect(turmoil.getPlayerInfluence(player)).eq(2);

    game.generation = 3;
    expect(turmoil.getPlayerInfluence(player)).eq(2);

    game.generation = 4;
    expect(turmoil.getPlayerInfluence(player)).eq(2);

    game.generation = 5;
    expect(turmoil.getPlayerInfluence(player)).eq(0);
  });
});
