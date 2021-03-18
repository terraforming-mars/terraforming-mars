import {expect} from 'chai';
import {IndustrialCenter} from '../../../src/cards/base/IndustrialCenter';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TileType} from '../../../src/TileType';
import {TestPlayers} from '../../TestPlayers';

describe('IndustrialCenter', function() {
  let card : IndustrialCenter; let player : Player; let game : Game;

  beforeEach(function() {
    card = new IndustrialCenter();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play or act', function() {
    expect(card.canAct(player)).is.not.true;
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should action', function() {
    player.megaCredits = 7;
    card.action(player);
    game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(0);
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
  });

  it('Should play', function() {
    game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
    expect(game.getCitiesInPlayOnMars()).to.eq(1);

    const action = card.play(player);
    const space = action!.availableSpaces[0];
        action!.cb(space);
        expect(space.tile).is.not.undefined;
        expect(space.tile && space.tile.tileType).to.eq(TileType.INDUSTRIAL_CENTER);
        expect(space.adjacency?.bonus).eq(undefined);
  });
});
