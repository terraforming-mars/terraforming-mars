import {expect} from 'chai';
import {KaguyaTech} from '../../../src/server/cards/promo/KaguyaTech';
import {testGame} from '../../TestGame';
import {addGreenery, cast, runAllActions} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {EmptyBoard} from '../../ares/EmptyBoard';
import {BoardName} from '../../../src/common/boards/BoardName';
import {SpaceName} from '../../../src/server/SpaceName';
import {assertPlaceOcean} from '../../assertions';

describe('KaguyaTech', () => {
  it('canPlay', () => {
    const card = new KaguyaTech();
    const [/* game */, player] = testGame(2);

    expect(card.canPlay(player)).is.not.true;

    addGreenery(player);

    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    const card = new KaguyaTech();
    const [game, player] = testGame(2);
    game.board = EmptyBoard.newInstance();

    const greenerySpace = addGreenery(player);

    expect(player.production.megacredits).eq(0);
    expect(player.cardsInHand).has.length(0);
    expect(game.getOxygenLevel()).eq(1);

    const selectSpace = cast(card.play(player), SelectSpace);

    expect(player.production.megacredits).eq(2);
    expect(player.cardsInHand).has.length(1);

    selectSpace.cb(greenerySpace);

    expect(greenerySpace?.tile?.tileType).eq(TileType.CITY);
    expect(game.getOxygenLevel()).eq(1);
  });

  it('compatible with ocean bonus', () => {
    const card = new KaguyaTech();
    const [game, player] = testGame(2, {boardName: BoardName.HELLAS});

    const greenerySpace = game.board.getSpaceOrThrow(SpaceName.HELLAS_OCEAN_TILE);
    game.simpleAddTile(player, greenerySpace, {tileType: TileType.GREENERY});

    expect(player.production.megacredits).eq(0);
    expect(player.cardsInHand).has.length(0);

    player.stock.megacredits = card.cost + 5;

    expect(player.canPlay(card)).is.false;

    player.stock.megacredits = card.cost + 6;

    expect(player.canPlay(card)).is.true;

    const selectSpace = cast(card.play(player), SelectSpace);

    expect(player.production.megacredits).eq(2);
    expect(player.cardsInHand).has.length(1);

    selectSpace.cb(greenerySpace);

    expect(greenerySpace?.tile?.tileType).eq(TileType.CITY);

    runAllActions(game);

    assertPlaceOcean(player, player.popWaitingFor());
  });
});
