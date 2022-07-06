import {expect} from 'chai';
import {NaturalPreserve} from '../../../src/cards/base/NaturalPreserve';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';
import {TileType} from '../../../src/common/TileType';
import {TestPlayers} from '../../TestPlayers';
import {cast} from '../../TestingUtils';

describe('NaturalPreserve', () => {
  let card : NaturalPreserve; let player : TestPlayer; let game : Game;

  beforeEach(() => {
    card = new NaturalPreserve();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Cannot play if no spaces available', () => {
    const lands = game.board.getAvailableSpacesOnLand(player);
    for (const land of lands) {
      game.addTile(player, land.spaceType, land, {tileType: TileType.NATURAL_PRESERVE});
    }

    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Cannot play if oxygen level too high', () => {
    (game as any).oxygenLevel = 5;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can play', () => {
    (game as any).oxygenLevel = 4;
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('Should play', () => {
    expect(player.canPlayIgnoringCost(card)).is.true;
    const action = cast(card.play(player), SelectSpace);
    const space = action.availableSpaces[0];
    action.cb(space);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    expect(space.tile && space.tile.tileType).to.eq(TileType.NATURAL_PRESERVE);
    expect(space.adjacency?.bonus).eq(undefined);

    expect(card.getVictoryPoints()).to.eq(1);
  });
});
