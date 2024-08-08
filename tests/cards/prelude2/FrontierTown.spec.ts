import {expect} from 'chai';
import {FrontierTown} from '../../../src/server/cards/prelude2/FrontierTown';
import {testGame} from '../../TestGame';
import {cast, churn} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {PartyName} from '../../../src/common/turmoil/PartyName';

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
});
