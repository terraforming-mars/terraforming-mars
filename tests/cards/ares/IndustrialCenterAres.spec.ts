import {expect} from 'chai';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {TileType} from '../../../src/TileType';
import {IndustrialCenterAres} from '../../../src/cards/ares/IndustrialCenterAres';
import {SpaceBonus} from '../../../src/SpaceBonus';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayers} from '../../TestingUtils';

describe('IndustrialCenterAres', function() {
  let card : IndustrialCenterAres; let player : Player; let game : Game;

  beforeEach(function() {
    card = new IndustrialCenterAres();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);
  });

  it('Should play', function() {
    game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
    expect(game.getCitiesInPlayOnMars()).to.eq(1);

    const action = card.play(player, game);
    const space = action!.availableSpaces[0];
        action!.cb(space);
        expect(space.tile).is.not.undefined;
        expect(space.tile && space.tile.tileType).to.eq(TileType.INDUSTRIAL_CENTER);
        expect(space.adjacency).to.deep.eq({bonus: [SpaceBonus.STEEL]});
  });
});
