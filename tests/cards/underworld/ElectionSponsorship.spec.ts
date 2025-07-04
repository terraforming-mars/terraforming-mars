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

    expect(turmoil.getAvailableDelegateCount(player)).eq(7);

    const marsFirst = turmoil.getPartyByName(PartyName.MARS);

    expect(turmoil.getAvailableDelegateCount(player)).eq(7);
    expect(marsFirst.delegates.get(player)).eq(0);

    const selectParty = cast(player.popWaitingFor(), SelectParty);
    selectParty.cb(marsFirst.name);

    expect(turmoil.getAvailableDelegateCount(player)).eq(5);
    expect(marsFirst.delegates.get(player)).eq(2);

    expect(player.underworldData.corruption).eq(1);
  });

  it('effect', () => {
    const card = new ElectionSponsorship();
    const [game, player] = testGame(2, {turmoilExtension: true});
    const turmoil = Turmoil.getTurmoil(game);

    card.play(player);

    expect(turmoil.getInfluence(player)).eq(1);
  });
});
