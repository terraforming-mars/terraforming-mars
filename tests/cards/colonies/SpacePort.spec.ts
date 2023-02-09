import {expect} from 'chai';
import {SpacePort} from '../../../src/server/cards/colonies/SpacePort';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Resources} from '../../../src/common/Resources';
import {cast, runAllActions} from '../../TestingUtils';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {ColonyName} from '../../../src/common/colonies/ColonyName';

describe('SpacePort', function() {
  let card: SpacePort;
  let player: TestPlayer;

  beforeEach(function() {
    card = new SpacePort();
    const game = newTestGame(2, {coloniesExtension: true, customColoniesList: [
      ColonyName.CERES,
      ColonyName.CALLISTO,
      ColonyName.ENCELADUS,
      ColonyName.EUROPA,
      ColonyName.GANYMEDE,
    ]});
    player = getTestPlayer(game, 0);
  });

  it('Can not play without colony', function() {
    player.production.add(Resources.ENERGY, 1);
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Can not play without energy production', function() {
    player.game.colonies[0].colonies.push(player.id);
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resources.ENERGY, 1);
    player.game.colonies[0].colonies.push(player.id);
    expect(player.simpleCanPlay(card)).is.true;

    expect(card.play(player)).is.undefined;
    runAllActions(player.game);
    const action = cast(player.popWaitingFor(), SelectSpace);

    action.cb(action.availableSpaces[0]);
    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(4);
  });
});
