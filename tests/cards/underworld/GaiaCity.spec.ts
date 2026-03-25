import {expect} from 'chai';
import {GaiaCity} from '../../../src/server/cards/underworld/GaiaCity';
import {testGame} from '../../TestGame';
import {addCity, cast, churn} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {Space} from '../../../src/server/boards/Space';
import {intersection} from '../../../src/common/utils/utils';

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

    player.production.energy = 1;

    const [space1, space2] = player.game.board.getAvailableSpacesForCity(player);
    space1.excavator = player;
    space2.excavator = player;

    const selectSpace = cast(churn(card.play(player), player), SelectSpace);

    expect(player.production.plants).eq(2);
    expect(player.production.energy).eq(0);

    expect(selectSpace.spaces).to.have.members([space1, space2]);

    const space = selectSpace.spaces[0];
    selectSpace.cb(space);

    expect(space.tile?.tileType).eq(TileType.CITY);
  });

  it('play next to another city', () => {
    const card = new GaiaCity();
    const [/* game */, player, player2] = testGame(2);
    const board = player.game.board;

    player.production.energy = 1;

    const [firstCity] = board.getAvailableSpacesForCity(player);
    addCity(player, firstCity.id);
    const landSpacesNextToCity = intersection(
      board.getAdjacentSpaces(firstCity),
      board.getAvailableSpacesOnLand(player),
    );

    const nextCity = landSpacesNextToCity[0];
    nextCity.excavator = player;

    // This space will not be eligible because someone else excavated it.
    landSpacesNextToCity[1].excavator = player2;

    expect(board.getAvailableSpacesForCity(player)).does.not.include([nextCity]);

    const selectSpace = cast(churn(card.play(player), player), SelectSpace);

    expect(selectSpace.spaces).deep.eq([nextCity]);

    const space = selectSpace.spaces[0];
    selectSpace.cb(space);

    expect(space.tile?.tileType).eq(TileType.CITY);
    expect(space.excavator).is.undefined;
  });
});
