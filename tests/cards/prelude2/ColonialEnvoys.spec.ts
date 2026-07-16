import {expect} from 'chai';
import {ColonialEnvoys} from '../../../src/server/cards/prelude2/ColonialEnvoys';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {Luna} from '../../../src/server/colonies/Luna';
import {cast, runAllActions, testGame, setRulingParty} from '../../TestingUtils';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {SelectParty} from '../../../src/server/inputs/SelectParty';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {Ganymede} from '../../../src/server/colonies/Ganymede';

describe('ColonialEnvoys', () => {
  let card: ColonialEnvoys;
  let player: TestPlayer;
  let game: IGame;
  let luna: Luna;
  let ganymede: Ganymede;
  let turmoil: Turmoil;

  beforeEach(() => {
    card = new ColonialEnvoys();
    [game, player] = testGame(2, {turmoilExtension: true, coloniesExtension: true});
    turmoil = player.game.turmoil!;
    luna = new Luna();
    ganymede = new Ganymede();
    game.colonies.push(luna, ganymede);
  });

  it('Can not play, not in power', () => {
    setRulingParty(game, PartyName.KELVINISTS);

    expect(card.canPlay(player)).is.false;

    setRulingParty(game, PartyName.UNITY);

    expect(card.canPlay(player)).is.true;
  });

  it('Cannot play - 1 colony, 0 delegates', () => {
    luna.colonies.push(player.id);
    turmoil.delegateReserve.clear();

    expect(player.canPlay(card)).is.false;
  });

  it('Can play - 0 colonies, 0 delegates', () => {
    setRulingParty(game, PartyName.UNITY);
    turmoil.delegateReserve.clear();

    expect(card.canPlay(player)).is.true;
  });

  it('Can play - 2 colonies, 7 delegates', () => {
    luna.colonies.push(player.id);
    ganymede.colonies.push(player.id);

    expect(turmoil.getAvailableDelegateCount(player)).eq(7);

    const marsFirst = turmoil.getPartyByName(PartyName.MARS);
    const greens = turmoil.getPartyByName(PartyName.GREENS);
    card.play(player);
    runAllActions(player.game);

    let selectParty = cast(player.popWaitingFor(), SelectParty);
    selectParty.cb(marsFirst.name);

    expect(turmoil.getAvailableDelegateCount(player)).eq(6);

    runAllActions(game);
    selectParty = cast(player.popWaitingFor(), SelectParty);
    selectParty.cb(greens.name);
    runAllActions(game);

    expect(turmoil.getAvailableDelegateCount(player)).eq(5);
    expect(marsFirst.delegates.get(player)).eq(1);
    expect(greens.delegates.get(player)).eq(1);

    cast(player.popWaitingFor(), undefined);
  });
});
