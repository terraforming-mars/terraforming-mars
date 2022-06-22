import {expect} from 'chai';
import {DomedCrater} from '../../../src/cards/base/DomedCrater';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';
import {TileType} from '../../../src/common/TileType';
import {TestPlayers} from '../../TestPlayers';

describe('DomedCrater', function() {
  let card : DomedCrater; let player : TestPlayer; let game : Game;

  beforeEach(function() {
    card = new DomedCrater();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play without energy production', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can\'t play if oxygen level too high', function() {
    player.addProduction(Resources.ENERGY, 1);
    (game as any).oxygenLevel = 8;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY, 1);
    expect(player.canPlayIgnoringCost(card)).is.true;

    const action = card.play(player);
    expect(action).instanceOf(SelectSpace);

    action.cb(action.availableSpaces[0]);
    expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.CITY);
    expect(player.plants).to.eq(3);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);

    expect(card.getVictoryPoints()).to.eq(1);
  });
});

