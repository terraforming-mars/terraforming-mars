import {expect} from 'chai';
import {NoctisCity} from '../../../src/server/cards/base/NoctisCity';
import {IGame} from '../../../src/server/IGame';
import {Resource} from '../../../src/common/Resource';
import {SpaceName} from '../../../src/common/boards/SpaceName';
import {TileType} from '../../../src/common/TileType';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {cast, churn} from '../../TestingUtils';
import {BoardName} from '../../../src/common/boards/BoardName';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';

describe('NoctisCity', () => {
  let card: NoctisCity;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new NoctisCity();
    [game, player] = testGame(2);
  });

  it('Cannot play without energy production', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('All land spaces are available on Hellas', () => {
    // With two players, there's no solo setup, so all spaces will be available.
    const [game, player] = testGame(2, {boardName: BoardName.HELLAS});

    const selectSpace = cast(churn(card.play(player), player), SelectSpace);
    expect(selectSpace.spaces).deep.eq(game.board.getAvailableSpacesForCity(player));
  });

  it('Should play', () => {
    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(3);

    const noctis = game.board.getSpaceOrThrow(SpaceName.NOCTIS_CITY);
    expect(noctis.tile?.tileType).to.eq(TileType.CITY);
  });
});
