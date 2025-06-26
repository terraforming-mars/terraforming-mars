import {expect} from 'chai';
import {GaiaCity} from '../../../src/server/cards/underworld/GaiaCity';
import {testGame} from '../../TestGame';
import {cast, churn, setRulingParty} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {Space} from '../../../src/server/boards/Space';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {BoardName} from '../../../src/common/boards/BoardName';
import {SpaceName} from '../../../src/common/boards/SpaceName';
import {HELLAS_BONUS_OCEAN_COST} from '../../../src/common/constants';
import {PartyName} from '../../../src/common/turmoil/PartyName';

describe('GaiaCity', () => {
  const canPlayRuns = [
    {energyProduction: 0, excavationMarker: 'none', expected: false},
    {energyProduction: 0, excavationMarker: 'blank', expected: false},
    {energyProduction: 1, excavationMarker: 'blank', expected: true},
    {energyProduction: 1, excavationMarker: 'ocean', expected: false},
    {energyProduction: 1, excavationMarker: 'greenery', expected: false},
  ] as const;
  for (const run of canPlayRuns) {
    it('canPlay ' + JSON.stringify(run), () => {
      const card = new GaiaCity();
      const [/* game */, player/* , player2 */] = testGame(2, {underworldExpansion: true});
      player.production.override({energy: run.energyProduction});

      let space: Space;
      switch (run.excavationMarker) {
      case 'none':
        break;

      case 'blank':
        space = player.game.board.getAvailableSpacesForCity(player)[0];
        space.excavator = player;
        break;

      case 'ocean':
        space = player.game.board.getAvailableSpacesForCity(player)[0];
        space.excavator = player;
        space.spaceType = SpaceType.OCEAN;
        break;

      case 'greenery':
        space = player.game.board.getAvailableSpacesForCity(player)[0];
        space.excavator = player;
        space.tile = {tileType: TileType.GREENERY};
        break;
      }
      expect(card.canPlay(player)).eq(run.expected);
    });
  }

  it('play', () => {
    const card = new GaiaCity();
    const [/* game */, player] = testGame(2);

    player.production.override({energy: 1});

    const [space1, space2] = player.game.board.getAvailableSpacesForCity(player);
    space1.excavator = player;
    space2.excavator = player;

    const selectSpace = cast(churn(card.play(player), player), SelectSpace);

    expect(player.production.megacredits).eq(2);
    expect(player.production.energy).eq(0);

    expect(selectSpace.spaces).to.have.members([space1, space2]);

    space1.bonus = [SpaceBonus.PLANT];
    const space = selectSpace.spaces[0];
    selectSpace.cb(space);

    expect(space.tile?.tileType).eq(TileType.CITY);
    expect(player.plants).eq(2);
  });

  it('Manages double placement costs', () => {
    const card = new GaiaCity();
    const [/* game */, player] = testGame(2, {underworldExpansion: true, boardName: BoardName.HELLAS});

    player.production.override({energy: 1});

    const hellasOceanSpace = player.game.board.getSpaceOrThrow(SpaceName.HELLAS_OCEAN_TILE);
    hellasOceanSpace.excavator = player;

    player.megaCredits = card.cost + HELLAS_BONUS_OCEAN_COST + HELLAS_BONUS_OCEAN_COST - 1;
    expect(card.canPlay(player)).is.false;

    player.megaCredits++;
    expect(card.canPlay(player)).is.true;
  });

  it('Manages double placement and Reds costs', () => {
    const card = new GaiaCity();
    const [game, player] = testGame(2, {underworldExpansion: true, turmoilExtension: true, boardName: BoardName.HELLAS});
    setRulingParty(game, PartyName.REDS);

    player.production.override({energy: 1});

    const hellasOceanSpace = player.game.board.getSpaceOrThrow(SpaceName.HELLAS_OCEAN_TILE);
    hellasOceanSpace.excavator = player;

    player.megaCredits = card.cost + HELLAS_BONUS_OCEAN_COST + HELLAS_BONUS_OCEAN_COST + 6 - 1;
    expect(card.canPlay(player)).is.false;

    player.megaCredits++;
    expect(card.canPlay(player)).is.true;
  });
});
