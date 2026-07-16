import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {Units} from '../../../src/common/Units';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {IGame} from '../../../src/server/IGame';
import {cast, runAllActions, testGame} from '../../TestingUtils';
import {RiseToPower} from '../../../src/server/cards/prelude2/RiseToPower';
import {SelectParty} from '../../../src/server/inputs/SelectParty';
import {PartyName} from '../../../src/common/turmoil/PartyName';

describe('RiseToPower', () => {
  let card: RiseToPower;
  let game: IGame;
  let player: TestPlayer;
  let turmoil: Turmoil;

  beforeEach(() => {
    card = new RiseToPower();
    [game, player] = testGame(1, {turmoilExtension: true});
    turmoil = game.turmoil!;
  });

  it('cannot play, not enough delegates', () => {
    turmoil.delegateReserve.clear();
    expect(card.canPlay(player)).is.false;
  });

  it('play', () => {
    expect(turmoil.getAvailableDelegateCount(player)).eq(7);
    const marsFirst = turmoil.getPartyByName(PartyName.MARS);
    const greens = turmoil.getPartyByName(PartyName.GREENS);
    expect(marsFirst.delegates.get(player)).eq(0);
    expect(greens.delegates.get(player)).eq(0);
    card.play(player);
    runAllActions(player.game);
    const action = cast(player.getWaitingFor(), SelectParty);
    action.cb(marsFirst.name);
    expect(turmoil.getAvailableDelegateCount(player)).eq(6);
    action.cb(greens.name);
    expect(turmoil.getAvailableDelegateCount(player)).eq(5);
    action.cb(greens.name);
    expect(turmoil.getAvailableDelegateCount(player)).eq(4);

    expect(marsFirst.delegates.get(player)).eq(1);
    expect(greens.delegates.get(player)).eq(2);
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 3}));
  });
});
