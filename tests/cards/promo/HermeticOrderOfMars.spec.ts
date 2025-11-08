import {expect} from 'chai';
import {HermeticOrderOfMars} from '../../../src/server/cards/promo/HermeticOrderofMars';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {MarsBoard} from '../../../src/server/boards/MarsBoard';
import {addGreenery, addOcean, setOxygenLevel} from '../../TestingUtils';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TileType} from '../../../src/common/TileType';

describe('HermeticOrderOfMars', () => {
  let card: HermeticOrderOfMars;
  let player: TestPlayer;
  let game: IGame;
  let board: MarsBoard;

  beforeEach(() => {
    card = new HermeticOrderOfMars();
    [game, player/* , player2 */] = testGame(2);
    board = game.board;
  });

  it('can play', () => {
    setOxygenLevel(game, 6);

    expect(card.canPlay(player)).is.false;

    setOxygenLevel(game, 4);

    expect(card.canPlay(player)).is.true;
  });

  it('simple play', () => {
    card.play(player);

    expect(player.production.megacredits).eq(2);
    expect(player.megaCredits).eq(0);
  });

  it('One tile, no spaces next to it', () => {
    addGreenery(player, '50');
    card.play(player);

    expect(player.megaCredits).eq(6);
  });

  it('Two tiles next to each other', () => {
    addGreenery(player, '50');
    addGreenery(player, '51');
    card.play(player);

    expect(player.megaCredits).eq(8);
  });

  it('One tile next to them.', () => {
    addGreenery(player, '50');
    addGreenery(player, '51');
    addOcean(player, '43'); // Next to both 50 and 51.
    card.play(player);

    expect(player.megaCredits).eq(7);
  });

  it('Hazards count', () => {
    addGreenery(player, '50');
    addGreenery(player, '51');
    board.getSpaceOrThrow('43').tile = {tileType: TileType.DUST_STORM_MILD};
    card.play(player);

    expect(player.megaCredits).eq(8);
  });

  it('Restricted space does not count', () => {
    addGreenery(player, '50');
    addGreenery(player, '51');
    board.getSpaceOrThrow('43').spaceType = SpaceType.RESTRICTED;
    card.play(player);

    expect(player.megaCredits).eq(7);
  });
});
