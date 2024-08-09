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

describe('ColonialEnvoys', function() {
  let card: ColonialEnvoys;
  let player: TestPlayer;
  let game: IGame;
  let colony1: Luna;
  let colony2: Ganymede;
  let turmoil: Turmoil;

  beforeEach(function() {
    card = new ColonialEnvoys();
    [game, player] = testGame(2, {turmoilExtension: true, coloniesExtension: true});
    turmoil = player.game.turmoil!;
  });

  it('Can not play', function() {
    setRulingParty(game, PartyName.KELVINISTS);
    expect(card.canPlay(player)).is.false;
    setRulingParty(game, PartyName.UNITY);
    expect(card.canPlay(player)).is.true;
  });

  it('Can play - 0 colonies, 0 delegates', function() {
    setRulingParty(game, PartyName.UNITY);
    turmoil.delegateReserve.clear();
    expect(card.canPlay(player)).is.true;
  });

  it('Can play - 2 colonies, 7 delegates', function() {
    colony1 = new Luna();
    colony2 = new Ganymede();
    colony1.colonies.push(player.id);
    colony2.colonies.push(player.id);
    game.colonies.push(colony1);
    game.colonies.push(colony2);
    expect(turmoil.getAvailableDelegateCount(player)).eq(7);
    const marsFirst = turmoil.getPartyByName(PartyName.MARS);
    const greens = turmoil.getPartyByName(PartyName.GREENS);
    card.play(player);
    runAllActions(player.game);
    const action = cast(player.getWaitingFor(), SelectParty);
    action.cb(marsFirst.name);
    action.cb(greens.name);
    expect(turmoil.getAvailableDelegateCount(player)).eq(5);
    expect(marsFirst.delegates.get(player)).eq(1);
    expect(greens.delegates.get(player)).eq(1);
  });

  it('Cannot play - 1 colony, 0 delegates', function() {
    colony1 = new Luna();
    colony1.colonies.push(player.id);
    game.colonies.push(colony1);
    turmoil.delegateReserve.clear();
    expect(player.canPlay(card)).is.false;
  });
});
