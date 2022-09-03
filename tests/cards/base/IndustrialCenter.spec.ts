import {expect} from 'chai';
import {IndustrialCenter} from '../../../src/server/cards/base/IndustrialCenter';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {TileType} from '../../../src/common/TileType';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';

describe('IndustrialCenter', function() {
  let card: IndustrialCenter;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new IndustrialCenter();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play or act', function() {
    expect(card.canAct(player)).is.not.true;
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should action', function() {
    player.megaCredits = 7;
    card.action(player);
    game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(0);
    expect(player.production.steel).to.eq(1);
  });

  it('Should play', function() {
    game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
    expect(game.getCitiesOnMarsCount()).to.eq(1);

    const action = cast(card.play(player), SelectSpace);
    const space = action.availableSpaces[0];
    action.cb(space);
    expect(space.tile?.tileType).to.eq(TileType.INDUSTRIAL_CENTER);
    expect(space.adjacency?.bonus).eq(undefined);
  });
});
