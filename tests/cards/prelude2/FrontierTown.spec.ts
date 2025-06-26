import {expect} from 'chai';
import {FrontierTown} from '../../../src/server/cards/prelude2/FrontierTown';
import {testGame} from '../../TestGame';
import {cast, churn, runAllActions, setRulingParty} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {BoardName} from '../../../src/common/boards/BoardName';
import {SpaceName} from '../../../src/common/boards/SpaceName';
import {HELLAS_BONUS_OCEAN_COST} from '../../../src/common/constants';

describe('FrontierTown', () => {
  const canPlayRuns = [
    {energyProduction: 0, party: PartyName.GREENS, expected: false},
    {energyProduction: 0, party: PartyName.MARS, expected: false},
    {energyProduction: 1, party: PartyName.GREENS, expected: false},
    {energyProduction: 1, party: PartyName.MARS, expected: true},
  ] as const;
  for (const run of canPlayRuns) {
    it('canPlay ' + JSON.stringify(run), () => {
      const card = new FrontierTown();
      const [game, player/* , player2 */] = testGame(2, {turmoilExtension: true});

      const turmoil = game.turmoil!;
      turmoil.rulingParty = turmoil.getPartyByName(run.party);
      player.production.override({energy: run.energyProduction});
      expect(card.canPlay(player)).eq(run.expected);
    });
  }

  it('play', () => {
    const card = new FrontierTown();
    const [/* game */, player] = testGame(2);

    player.production.override({energy: 1});

    const selectSpace = cast(churn(card.play(player), player), SelectSpace);

    expect(player.production.energy).eq(0);

    const space = selectSpace.spaces[0];
    space.bonus = [SpaceBonus.PLANT];
    selectSpace.cb(space);

    expect(space.tile?.tileType).eq(TileType.CITY);
    expect(player.plants).eq(3);
  });

  it('Does not apply to oceans ', () => {
    const card = new FrontierTown();
    const [game, player] = testGame(2);

    player.production.override({energy: 1});

    const selectSpace = cast(churn(card.play(player), player), SelectSpace);

    expect(player.production.energy).eq(0);

    const space = selectSpace.spaces[0];
    const oceanSpace = game.board.getAdjacentSpaces(space)[0];
    game.simpleAddTile(player, oceanSpace, {tileType: TileType.OCEAN});
    space.bonus = [SpaceBonus.PLANT];
    selectSpace.cb(space);

    expect(space.tile?.tileType).eq(TileType.CITY);
    expect(player.plants).eq(3);
    expect(player.megaCredits).eq(2); // 2, not 6.
  });

  it('Manages double placement costs', () => {
    const card = new FrontierTown();
    const [game, player] = testGame(2, {boardName: BoardName.HELLAS});
    player.production.override({energy: 1});
    const hellasOceanSpace = player.game.board.getSpaceOrThrow(SpaceName.HELLAS_OCEAN_TILE);

    player.megaCredits = card.cost + (HELLAS_BONUS_OCEAN_COST * 3) - 1;
    card.play(player);
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);

    expect(selectSpace.spaces).does.not.include(hellasOceanSpace);

    player.megaCredits++;
    card.play(player);
    runAllActions(game);
    const selectSpace2 = cast(player.popWaitingFor(), SelectSpace);

    expect(selectSpace2.spaces).includes(hellasOceanSpace);
  });

  it('Manages double placement and Reds costs', () => {
    const card = new FrontierTown();
    const [game, player] = testGame(2, {turmoilExtension: true, boardName: BoardName.HELLAS});
    setRulingParty(game, PartyName.REDS);
    player.production.override({energy: 1});

    const hellasOceanSpace = player.game.board.getSpaceOrThrow(SpaceName.HELLAS_OCEAN_TILE);

    player.megaCredits = card.cost + (HELLAS_BONUS_OCEAN_COST * 3) + 9 - 1;
    card.play(player);
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);

    expect(selectSpace.spaces).does.not.include(hellasOceanSpace);

    player.megaCredits++;
    card.play(player);
    runAllActions(game);
    const selectSpace2 = cast(player.popWaitingFor(), SelectSpace);

    expect(selectSpace2.spaces).includes(hellasOceanSpace);
  });
});
