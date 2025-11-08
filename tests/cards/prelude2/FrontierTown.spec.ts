import {expect} from 'chai';
import {FrontierTown} from '../../../src/server/cards/prelude2/FrontierTown';
import {testGame} from '../../TestGame';
import {addOcean, cast, churn, runAllActions, setRulingParty} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {BoardName} from '../../../src/common/boards/BoardName';
import {SpaceName} from '../../../src/common/boards/SpaceName';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';

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

      setRulingParty(game, run.party);
      player.production.override({energy: run.energyProduction});
      expect(card.canPlay(player)).eq(run.expected);
    });
  }

  it('play', () => {
    const card = new FrontierTown();
    const [/* game */, player] = testGame(2, {turmoilExtension: true});

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
    const [game, player] = testGame(2, {turmoilExtension: true});

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

  for (const run of [
    {party: PartyName.GREENS, availableOceans: 3, adjust: 17, expected: false},
    {party: PartyName.GREENS, availableOceans: 3, adjust: 18, expected: true},
    {party: PartyName.REDS, availableOceans: 3, adjust: 26, expected: false},
    {party: PartyName.REDS, availableOceans: 3, adjust: 27, expected: true},

    // This isn't how these work. Huh.
    // {party: PartyName.GREENS, availableOceans: 2, adjust: 11, expected: false},
    // {party: PartyName.GREENS, availableOceans: 2, adjust: 12, expected: true},
    // {party: PartyName.REDS, availableOceans: 2, adjust: 17, expected: false},
    // {party: PartyName.REDS, availableOceans: 2, adjust: 18, expected: true},
  ]) {
    it('Manages triple placement costs ' + JSON.stringify(run), () => {
      const card = new FrontierTown();
      const [game, player, player2] = testGame(2, {turmoilExtension: true, boardName: BoardName.HELLAS});

      const turmoil = Turmoil.getTurmoil(game);
      turmoil.sendDelegateToParty(player, PartyName.MARS, game, true);
      turmoil.sendDelegateToParty(player, PartyName.MARS, game, true);
      setRulingParty(game, run.party);
      player.production.override({energy: 1});

      const hellasOceanSpace = player.game.board.getSpaceOrThrow(SpaceName.HELLAS_OCEAN_TILE);
      // Every other space is reserved for the opponent.
      for (const space of player.game.board.spaces) {
        if (space.spaceType === SpaceType.LAND && space !== hellasOceanSpace) {
          space.player = player2;
        }
      }

      player.megaCredits = card.cost + run.adjust;
      while (game.board.getOceanSpaces().length > run.availableOceans) {
        addOcean(player2);
      }

      expect(player.canPlay(card)).eq(run.expected);

      if (run.expected === true) {
        player.playCard(card);
        runAllActions(game);
        const selectSpace = cast(player.popWaitingFor(), SelectSpace);

        expect(selectSpace.spaces).deep.eq([hellasOceanSpace]);
      }
    });
  }
});
