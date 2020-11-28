import {expect} from 'chai';
import {IndustrialCenter} from '../../../src/cards/base/IndustrialCenter';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {TileType} from '../../../src/TileType';
import {Resources} from '../../../src/Resources';

describe('IndustrialCenter', function() {
  let card : IndustrialCenter; let player : Player; let game : Game;

  beforeEach(function() {
    card = new IndustrialCenter();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player);
  });

  it('Can\'t play or act', function() {
    expect(card.canAct(player)).is.not.true;
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should action', function() {
    player.megaCredits = 7;
    card.action(player, game);
    game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(0);
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
  });

  it('Should play', function() {
    game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
    expect(game.getCitiesInPlayOnMars()).to.eq(1);

    const action = card.play(player, game);
    const space = action!.availableSpaces[0];
        action!.cb(space);
        expect(space.tile).is.not.undefined;
        expect(space.tile && space.tile.tileType).to.eq(TileType.INDUSTRIAL_CENTER);
        expect(space.adjacency?.bonus).eq(undefined);
  });
});
