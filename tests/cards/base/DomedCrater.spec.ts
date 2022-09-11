import {expect} from 'chai';
import {DomedCrater} from '../../../src/server/cards/base/DomedCrater';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';
import {TileType} from '../../../src/common/TileType';
import {cast, runAllActions} from '../../TestingUtils';

describe('DomedCrater', function() {
  let card: DomedCrater;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new DomedCrater();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play without energy production', function() {
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Can not play if oxygen level too high', function() {
    player.production.add(Resources.ENERGY, 1);
    (game as any).oxygenLevel = 8;
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resources.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    expect(card.play(player)).is.undefined;
    runAllActions(player.game);
    const action = cast(player.popWaitingFor(), SelectSpace);

    action.cb(action.availableSpaces[0]);
    expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.CITY);
    expect(player.plants).to.eq(3);
    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(3);

    expect(card.getVictoryPoints()).to.eq(1);
  });
});

