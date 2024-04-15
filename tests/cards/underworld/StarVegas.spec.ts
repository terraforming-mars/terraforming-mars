import {expect} from 'chai';
import {addCity, cast, runAllActions} from '../../TestingUtils';
import {StarVegas} from '../../../src/server/cards/underworld/StarVegas';
import {testGame} from '../../TestGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {SpaceName} from '../../../src/server/SpaceName';
import {TileType} from '../../../src/common/TileType';
import {CardName} from '../../../src/common/cards/CardName';
import {GanymedeColony} from '../../../src/server/cards/base/GanymedeColony';

describe('StarVegas', function() {
  it('canPlay', () => {
    const card = new StarVegas();
    const [/* game */, player/* , player2 */] = testGame(2);
    expect(card.canPlay(player)).is.false;
    addCity(player);
    expect(card.canPlay(player)).is.false;
    addCity(player);
    expect(card.canPlay(player)).is.false;
    addCity(player);
    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    const card = new StarVegas();
    const [game, player, player2] = testGame(2, {underworldExpansion: true});
    addCity(player);
    addCity(player);
    addCity(player2);
    cast(card.play(player), undefined);

    expect(player.production.megacredits).eq(0);
    expect(player.underworldData.corruption).eq(2);

    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);

    expect(selectSpace.spaces.map((space) => space.id)).to.have.members([
      SpaceName.GANYMEDE_COLONY,
      SpaceName.PHOBOS_SPACE_HAVEN,
      SpaceName.STANFORD_TORUS,
    ]);
    const space = selectSpace.spaces[0];

    expect(space.id).to.eq(SpaceName.GANYMEDE_COLONY);
    expect(space.tile).is.undefined;

    selectSpace.cb(space);

    expect(space.tile?.tileType).eq(TileType.CITY);
    expect(space.tile?.card).eq(CardName.STAR_VEGAS);
    expect(player.production.megacredits).eq(4);
  });

  it('play - available spaces with Venus', () => {
    const card = new StarVegas();
    const [game, player/* , player2 */] = testGame(2, {venusNextExtension: true});

    cast(card.play(player), undefined);

    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);

    expect(selectSpace.spaces.map((space) => space.id)).to.have.members([
      SpaceName.GANYMEDE_COLONY,
      SpaceName.PHOBOS_SPACE_HAVEN,
      SpaceName.STANFORD_TORUS,
      SpaceName.LUNA_METROPOLIS,
      SpaceName.DAWN_CITY,
      SpaceName.STRATOPOLIS,
      SpaceName.MAXWELL_BASE,
    ]);
  });

  it('play - available spaces with Pathfinders', () => {
    const card = new StarVegas();
    const [game, player/* , player2 */] = testGame(2, {pathfindersExpansion: true});

    cast(card.play(player), undefined);

    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);

    expect(selectSpace.spaces.map((space) => space.id)).to.have.members([
      SpaceName.GANYMEDE_COLONY,
      SpaceName.PHOBOS_SPACE_HAVEN,
      SpaceName.STANFORD_TORUS,
      SpaceName.CERES_SPACEPORT,
      SpaceName.DYSON_SCREENS,
      SpaceName.LUNAR_EMBASSY,
      SpaceName.VENERA_BASE,
    ]);
  });

  it('play - simple', () => {
    const card = new StarVegas();
    const [game, player/* , player2 */] = testGame(2);
    addCity(player, SpaceName.GANYMEDE_COLONY);
    cast(card.play(player), undefined);

    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);

    expect(selectSpace.spaces.map((space) => space.id)).to.have.members([
      SpaceName.PHOBOS_SPACE_HAVEN,
      SpaceName.STANFORD_TORUS,
    ]);
  });

  it('play - other card is unplayable when Star Vegas moves in', () => {
    const card = new StarVegas();
    const [game, player/* , player2 */] = testGame(2);
    cast(card.play(player), undefined);

    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);

    expect(selectSpace.spaces.map((space) => space.id)).to.include(SpaceName.GANYMEDE_COLONY);

    const ganymedeColony = new GanymedeColony();
    expect(ganymedeColony.canPlay(player)).is.true;

    const space = selectSpace.spaces[0];

    expect(space.id).to.eq(SpaceName.GANYMEDE_COLONY);
    selectSpace.cb(space);

    expect(ganymedeColony.canPlay(player)).is.false;
  });
});
