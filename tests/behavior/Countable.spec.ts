import {expect} from 'chai';
import {Counter} from '../../src/server/behavior/Counter';
import {Game} from '../../src/server/Game';
import {TestPlayer} from '../TestPlayer';
import {getTestPlayer, newTestGame} from '../TestGame';
import {Tag} from '../../src/common/cards/Tag';
import {addCity, addGreenery, cast, fakeCard, maxOutOceans} from '../TestingUtils';
import {IProjectCard} from '../../src/server/cards/IProjectCard';
import {Units} from '../../src/common/Units';
import {MoonExpansion} from '../../src/server/moon/MoonExpansion';
import {SpaceName} from '../../src/server/SpaceName';
import {SpaceType} from '../../src/common/boards/SpaceType';
import {OceanCity} from '../../src/server/cards/ares/OceanCity';
import {SelectSpace} from '../../src/server/inputs/SelectSpace';
import {Wetlands} from '../../src/server/cards/pathfinders/Wetlands';

describe('Counter', () => {
  let game: Game;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let fake: IProjectCard;

  beforeEach(() => {
    game = newTestGame(3, {venusNextExtension: true, aresExtension: true, aresHazards: false});
    player = getTestPlayer(game, 0);
    player2 = getTestPlayer(game, 1);
    player3 = getTestPlayer(game, 2);
    player.popSelectInitialCards();
    player2.popSelectInitialCards();
    player3.popSelectInitialCards();
    fake = fakeCard({});
  });

  it('numbers', () => {
    const counter = new Counter(player, fake);
    expect(counter.count(3)).eq(3);
    expect(counter.count(8)).eq(8);
  });

  it('tags, simple', () => {
    player.tagsForTest = {building: 2, space: 3, moon: 7};
    const counter = new Counter(player, fake);
    expect(counter.count({tag: Tag.BUILDING})).eq(2);
    expect(counter.count({tag: Tag.SPACE})).eq(3);

    expect(counter.count({tag: Tag.BUILDING, each: 3})).eq(6);
    expect(counter.count({tag: Tag.MOON, per: 3})).eq(2);
  });

  it('tags, multiple', () => {
    player.tagsForTest = {building: 2, space: 3, moon: 7};
    const counter = new Counter(player, fake);
    expect(counter.count({tag: [Tag.BUILDING, Tag.MOON]})).eq(9);

    // Wild only counts once. It's really a test for tags.count, but it's useful to see here.
    player.tagsForTest = {building: 2, space: 3, moon: 7, wild: 1};
    expect(counter.count({tag: [Tag.BUILDING, Tag.MOON]})).eq(10);
  });

  it('tags, all and others', () => {
    player.tagsForTest = {building: 2, space: 3, moon: 7};
    player2.tagsForTest = {space: 4};
    player3.tagsForTest = {microbe: 8, wild: 2}; // Wild tags will be ignored.

    const counter = new Counter(player, fake);
    expect(counter.count({tag: Tag.BUILDING, all: true})).eq(2);
    expect(counter.count({tag: Tag.SPACE, all: true})).eq(7);
    expect(counter.count({tag: Tag.MICROBE, all: true})).eq(8);
    expect(counter.count({tag: Tag.SPACE, others: true})).eq(4);
  });

  it('tags, including this', () => {
    let counter = new Counter(player, fake);

    fake.tags = [Tag.CITY];
    expect(counter.count({tag: Tag.CITY})).eq(1);
    player.tagsForTest = {city: 1};
    expect(counter.count({tag: Tag.CITY})).eq(2);

    // Unset this so playedCards are counted more closely. It's a weird thing about tagsForTes.
    player.tagsForTest = undefined;
    player.playedCards = [fakeCard({tags: [Tag.CITY, Tag.CITY]})];
    expect(counter.count({tag: Tag.CITY})).eq(3);

    // Adding it to the player's tableau doesn't double-count it.
    player.playedCards.push(fake);
    // New game state needs a new Counter.
    counter = new Counter(player, fake);
    expect(counter.count({tag: Tag.CITY})).eq(3);
  });

  it('count cities', () => {
    const counter = new Counter(player, fake);

    function count() {
      return {
        '': counter.count({cities: {}}),
        'onmars': counter.count({cities: {where: 'onmars'}}),
        'offmars': counter.count({cities: {where: 'offmars'}}),
        'everywhere': counter.count({cities: {where: 'everywhere'}}),
      };
    }
    expect(count()).deep.eq({'': 0, 'onmars': 0, 'offmars': 0, 'everywhere': 0});

    game.addCityTile(player, SpaceName.GANYMEDE_COLONY, SpaceType.COLONY);

    expect(count()).deep.eq({'': 1, 'onmars': 0, 'offmars': 1, 'everywhere': 1});

    addCity(player);

    expect(count()).deep.eq({'': 2, 'onmars': 1, 'offmars': 1, 'everywhere': 2});

    const oceanCity = new OceanCity();
    const oceanSpace = game.board.getAvailableSpacesForOcean(player)[0];
    game.addOceanTile(player, oceanSpace.id, SpaceType.OCEAN);

    expect(count()).deep.eq({'': 2, 'onmars': 1, 'offmars': 1, 'everywhere': 2});

    const selectSpace = cast(oceanCity.play(player), SelectSpace);
    selectSpace.cb(oceanSpace);

    expect(count()).deep.eq({'': 3, 'onmars': 2, 'offmars': 1, 'everywhere': 3});

    // Even if added by another player
    addCity(player2);

    expect(count()).deep.eq({'': 4, 'onmars': 3, 'offmars': 1, 'everywhere': 4});
  });

  it('count cities that you own', () => {
    const count = (player: TestPlayer) => new Counter(player, fake).count({cities: {}, all: false});

    game.addCityTile(player, SpaceName.GANYMEDE_COLONY, SpaceType.COLONY);

    expect(count(player)).eq(1);
    expect(count(player2)).eq(0);

    const landSpace = game.board.getAvailableSpacesForCity(player)[0];
    game.addCityTile(player, landSpace.id, SpaceType.LAND);

    expect(count(player)).eq(2);
    expect(count(player2)).eq(0);

    const landSpace2 = game.board.getAvailableSpacesForCity(player2)[0];
    game.addCityTile(player2, landSpace2.id, SpaceType.LAND);

    expect(count(player)).eq(2);
    expect(count(player2)).eq(1);
  });

  it('count greeneries', () => {
    const counter = new Counter(player, fake);
    expect(counter.count({greeneries: {}})).eq(0);

    addGreenery(player);

    expect(counter.count({greeneries: {}})).eq(1);

    addGreenery(player);

    expect(counter.count({greeneries: {}})).eq(2);

    // Even if played by another player
    addGreenery(player2);

    expect(counter.count({greeneries: {}})).eq(3);

    maxOutOceans(player);
    const wetlands = new Wetlands();
    player.plants = 4;
    const selectSpace = cast(wetlands.play(player), SelectSpace);
    selectSpace.cb(selectSpace.availableSpaces[0]);
    expect(counter.count({greeneries: {}})).eq(4);
  });

  it('count greeneries that you ownown', () => {
    const count = (player: TestPlayer) => new Counter(player, fake).count({greeneries: {}, all: false});

    addGreenery(player);

    expect(count(player)).eq(1);
    expect(count(player2)).eq(0);

    addGreenery(player);

    expect(count(player)).eq(2);
    expect(count(player2)).eq(0);

    addGreenery(player2);

    expect(count(player)).eq(2);
    expect(count(player2)).eq(1);
  });

  it('count oceans', () => {
    const counter = new Counter(player, fake);
    expect(counter.count({oceans: {}})).eq(0);

    maxOutOceans(player, 1);

    expect(counter.count({oceans: {}})).eq(1);

    maxOutOceans(player, 2);

    expect(counter.count({oceans: {}})).eq(2);

    maxOutOceans(player, 6);

    expect(counter.count({oceans: {}})).eq(6);

    maxOutOceans(player);
    const wetlands = new Wetlands();
    player.plants = 4;
    const selectSpace = cast(wetlands.play(player), SelectSpace);
    selectSpace.cb(selectSpace.availableSpaces[0]);
    expect(counter.count({oceans: {}})).eq(10);
  });

  it('count units', () => {
    player.tagsForTest = {building: 2, space: 3};
    const counter = new Counter(player, fake);
    const units: Units = counter.countUnits({
      megacredits: {tag: Tag.SPACE},
      energy: -1,
      heat: {tag: Tag.BUILDING, each: 2},
    });

    expect(units).deep.eq(Units.of({megacredits: 3, energy: -1, heat: 4}));
  });
});


describe('Counter for Moon', () => {
  let game: Game;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let fake: IProjectCard;

  beforeEach(() => {
    game = newTestGame(3, {moonExpansion: true});
    player = getTestPlayer(game, 0);
    player2 = getTestPlayer(game, 1);
    player3 = getTestPlayer(game, 2);
    player.popSelectInitialCards();
    player2.popSelectInitialCards();
    player3.popSelectInitialCards();
    fake = fakeCard({});
  });

  it('colony rate', () => {
    const counter = new Counter(player, fake);
    const moonData = MoonExpansion.moonData(game);
    moonData.colonyRate = 3;

    expect(counter.count({moon: {habitatRate: {}}})).eq(3);
    expect(counter.count({moon: {habitatRate: {}}, per: 2})).eq(1);
    expect(counter.count({moon: {habitatRate: {}}, each: 2})).eq(6);
  });

  it('mining rate', () => {
    const counter = new Counter(player, fake);
    const moonData = MoonExpansion.moonData(game);
    moonData.miningRate = 1;

    expect(counter.count({moon: {miningRate: {}}})).eq(1);
    expect(counter.count({moon: {miningRate: {}}, per: 2})).eq(0);
    expect(counter.count({moon: {miningRate: {}}, each: 2})).eq(2);
  });

  it('logistic rate', () => {
    const counter = new Counter(player, fake);
    const moonData = MoonExpansion.moonData(game);
    moonData.logisticRate = 7;

    expect(counter.count({moon: {logisticRate: {}}})).eq(7);
    expect(counter.count({moon: {logisticRate: {}}, per: 2})).eq(3);
    expect(counter.count({moon: {logisticRate: {}}, each: 2})).eq(14);
  });

  it('colony tiles', () => {
    const counter = new Counter(player, fake);

    expect(counter.count({moon: {habitat: {}}})).eq(0);
    MoonExpansion.addHabitatTile(player, 'm02');
    expect(counter.count({moon: {habitat: {}}})).eq(1);
    MoonExpansion.addHabitatTile(player, 'm03');
    expect(counter.count({moon: {habitat: {}}})).eq(2);
    MoonExpansion.addHabitatTile(player, 'm04');
    expect(counter.count({moon: {habitat: {}}})).eq(3);
    MoonExpansion.addHabitatTile(player, 'm05');
    expect(counter.count({moon: {habitat: {}}})).eq(4);
    MoonExpansion.addHabitatTile(player, 'm06');
    expect(counter.count({moon: {habitat: {}}})).eq(5);
  });

  it('mine tiles', () => {
    const counter = new Counter(player, fake);

    expect(counter.count({moon: {mine: {}}})).eq(0);
    MoonExpansion.addMineTile(player, 'm02');
    expect(counter.count({moon: {mine: {}}})).eq(1);
    MoonExpansion.addMineTile(player, 'm03');
    expect(counter.count({moon: {mine: {}}})).eq(2);
    MoonExpansion.addMineTile(player, 'm04');
    expect(counter.count({moon: {mine: {}}})).eq(3);
    MoonExpansion.addMineTile(player, 'm05');
    expect(counter.count({moon: {mine: {}}})).eq(4);
    MoonExpansion.addMineTile(player, 'm06');
    expect(counter.count({moon: {mine: {}}})).eq(5);
  });

  it('road tiles', () => {
    const counter = new Counter(player, fake);

    expect(counter.count({moon: {road: {}}})).eq(0);
    MoonExpansion.addRoadTile(player, 'm02');
    expect(counter.count({moon: {road: {}}})).eq(1);
    MoonExpansion.addRoadTile(player, 'm03');
    expect(counter.count({moon: {road: {}}})).eq(2);
    MoonExpansion.addRoadTile(player, 'm04');
    expect(counter.count({moon: {road: {}}})).eq(3);
    MoonExpansion.addRoadTile(player, 'm05');
    expect(counter.count({moon: {road: {}}})).eq(4);
    MoonExpansion.addRoadTile(player, 'm06');
    expect(counter.count({moon: {road: {}}})).eq(5);
  });
});
