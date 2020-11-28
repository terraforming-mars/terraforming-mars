import {expect} from 'chai';
import {NoctisCity} from '../../../src/cards/base/NoctisCity';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {SpaceName} from '../../../src/SpaceName';
import {TileType} from '../../../src/TileType';
import {Resources} from '../../../src/Resources';

describe('NoctisCity', function() {
  let card : NoctisCity; let player : Player; let game : Game;

  beforeEach(function() {
    card = new NoctisCity();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player);
  });

  it('Can\'t play without energy production', function() {
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY);
    expect(card.canPlay(player, game)).is.true;

    card.play(player, game);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);

    const noctis = game.getSpace(SpaceName.NOCTIS_CITY);
    expect(noctis.tile && noctis.tile.tileType).to.eq(TileType.CITY);
  });
});
