import {expect} from 'chai';
import {CupolaCity} from '../../../src/server/cards/base/CupolaCity';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Resources} from '../../../src/common/Resources';
import {TileType} from '../../../src/common/TileType';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions, setOxygenLevel} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('CupolaCity', function() {
  let card: CupolaCity;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new CupolaCity();
    [game, player] = testGame(2);
  });

  it('Can not play without energy production', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can not play if oxygen level too high', function() {
    player.production.add(Resources.ENERGY, 1);
    setOxygenLevel(game, 10);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resources.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    expect(card.play(player)).is.undefined;
    runAllActions(player.game);
    const action = cast(player.popWaitingFor(), SelectSpace);

    action.cb(action.availableSpaces[0]);
    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(3);
    expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.CITY);
  });
});
