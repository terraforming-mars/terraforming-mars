import {expect} from 'chai';
import {ArtificialLake} from '../../../src/cards/base/ArtificialLake';
import * as constants from '../../../src/constants';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';
import {SpaceType} from '../../../src/SpaceType';
import {TileType} from '../../../src/TileType';
import {TestPlayers} from '../../TestPlayers';

describe('ArtificialLake', function() {
  let card : ArtificialLake; let player : TestPlayer; let game : Game;

  beforeEach(function() {
    card = new ArtificialLake();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    const action = card.play(player);
    expect(action instanceof SelectSpace).is.true;

        action!.availableSpaces.forEach((space) => {
          expect(space.spaceType).to.eq(SpaceType.LAND);
        });

        action!.cb(action!.availableSpaces[0]);
        const placedTile = action!.availableSpaces[0].tile;
        expect(placedTile!.tileType).to.eq(TileType.OCEAN);

        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
  });

  it('Cannot place ocean if all oceans are already placed', function() {
    // Set temperature level to fit requirements
    (game as any).temperature = -6;

    // Set oceans count to the max value
    for (const space of game.board.getSpaces(SpaceType.OCEAN, player)) {
      if (game.board.getOceansOnBoard() < constants.MAX_OCEAN_TILES) {
        game.addOceanTile(player, space.id);
      }
    }

    // Card is still playable to get VPs...
    expect(card.canPlay(player)).is.true;

    // ...but an action to place ocean is not unavailable
    const action = card.play(player);
    expect(action).is.undefined;
  });
});
