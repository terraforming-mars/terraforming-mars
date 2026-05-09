import {expect} from 'chai';
import {NoctisCity} from '../../../src/server/cards/base/NoctisCity';
import {IGame} from '../../../src/server/IGame';
import {Resource} from '../../../src/common/Resource';
import {SpaceName} from '../../../src/common/boards/SpaceName';
import {TileType} from '../../../src/common/TileType';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {churn, runAllActions} from '../../TestingUtils';
import {BoardName} from '../../../src/common/boards/BoardName';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {cast} from '../../../src/common/utils/utils';

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

    player.production.add(Resource.ENERGY, 1);
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

  it('Can play with 0 energy on Arabia Terra when energy production space is available', () => {
    const [game2, player2] = testGame(2, {boardName: BoardName.ARABIA_TERRA});

    // energy = 0 — no Noctis space on Arabia Terra
    expect(card.canPlay(player2)).is.true;

    // Only energy-production spaces should be offered
    const selectSpace = cast(churn(card.play(player2), player2), SelectSpace);
    expect(selectSpace.spaces.every((s) => s.bonus.includes(SpaceBonus.ENERGY_PRODUCTION))).is.true;

    selectSpace.cb(selectSpace.spaces[0]);
    runAllActions(game2);

    // Net: +1 from space, -1 from card = 0; +3 MC from behavior
    expect(player2.production.energy).to.eq(0);
    expect(player2.production.megacredits).to.eq(3);
  });
});
