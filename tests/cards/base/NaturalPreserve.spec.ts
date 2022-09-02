import {expect} from 'chai';
import {NaturalPreserve} from '../../../src/server/cards/base/NaturalPreserve';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';
import {TileType} from '../../../src/common/TileType';
import {cast} from '../../TestingUtils';

describe('NaturalPreserve', () => {
  let card: NaturalPreserve;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new NaturalPreserve();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Cannot play if no spaces available', () => {
    const lands = game.board.getAvailableSpacesOnLand(player);
    for (const land of lands) {
      game.addTile(player, land.spaceType, land, {tileType: TileType.NATURAL_PRESERVE});
    }

    expect(card.canPlay(player)).is.not.true;
  });

  it('Cannot play if oxygen level too high', () => {
    (game as any).oxygenLevel = 5;
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play', () => {
    (game as any).oxygenLevel = 4;
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    expect(card.canPlay(player)).is.true;
    const action = cast(card.play(player), SelectSpace);
    const space = action.availableSpaces[0];
    action.cb(space);
    expect(player.production.megacredits).to.eq(1);
    expect(space.tile && space.tile.tileType).to.eq(TileType.NATURAL_PRESERVE);
    expect(space.adjacency?.bonus).eq(undefined);

    expect(card.getVictoryPoints()).to.eq(1);
  });
});
