import {expect} from 'chai';
import {testGame} from '../TestGame';
import {PathfindersExpansion} from '../../src/server/pathfinders/PathfindersExpansion';
import {Tag} from '../../src/common/cards/Tag';
import {cast, fakeCard, runAllActions} from '../TestingUtils';
import {CardResource} from '../../src/common/CardResource';
import {CardName} from '../../src/common/cards/CardName';
import {SelectParty} from '../../src/server/inputs/SelectParty';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {assertPlaceCity, assertPlaceGreenery, assertPlaceMoonMine, assertPlaceMoonRoad, assertPlaceOcean} from '../assertions';
import {SelectResource} from '../../src/server/inputs/SelectResource';

describe('PathfindersExpansion', () => {
  it('Earth track', () => {
    const [game, player1, player2] = testGame(2, {pathfindersExpansion: true});
    const pathfindersData = game.pathfindersData!;
    PathfindersExpansion.raiseTrack(Tag.EARTH, player1, 3);
    runAllActions(game);

    expect(pathfindersData.earth).eq(3);
    expect(player1.plants).eq(2);
    expect(player2.plants).eq(1);

    expect(player1.megaCredits).eq(0);
    expect(player2.megaCredits).eq(0);

    PathfindersExpansion.raiseTrack(Tag.EARTH, player1, 3);
    runAllActions(game);

    expect(pathfindersData.earth).eq(6);
    expect(player1.megaCredits).eq(3);
    expect(player2.megaCredits).eq(3);
  });

  it('Venus track', () => {
    const [game, player1, player2] = testGame(2, {
      pathfindersExpansion: true,
      venusNextExtension: true,
    });
    const pathfindersData = game.pathfindersData!;

    const floaterCard = fakeCard({resourceType: CardResource.FLOATER});
    const floaterCard2 = fakeCard({resourceType: CardResource.FLOATER});
    player1.playedCards.push(floaterCard);
    player2.playedCards.push(floaterCard2);

    PathfindersExpansion.raiseTrack(Tag.VENUS, player1, 3);
    runAllActions(game);

    expect(pathfindersData.venus).eq(3);
    expect(player1.heat).eq(2);
    expect(player2.heat).eq(1);
    expect(floaterCard.resourceCount).eq(1);
    expect(floaterCard2.resourceCount).eq(0);
  });

  it('Most tags', () => {
    const [game, player1, player2] = testGame(2, {
      pathfindersExpansion: true,
      venusNextExtension: true,
    });
    const pathfindersData = game.pathfindersData!;

    // venus 17 has 2VP for the player with the most tags, and 1 TR for the rising player.
    pathfindersData.venus = 16;

    player1.tagsForTest = {venus: 4};
    player2.tagsForTest = {venus: 3};

    expect(player1.terraformRating).eq(20);
    expect(player2.terraformRating).eq(20);

    PathfindersExpansion.raiseTrack(Tag.VENUS, player2, 1);

    // Player 2 gets the terraformiing bump
    expect(player1.terraformRating).eq(20);
    expect(player2.terraformRating).eq(21);

    // Player 1 gets the 2VP.
    expect(player1.getVictoryPoints().total).eq(22);
    expect(player2.getVictoryPoints().total).eq(21);
  });

  it('tags played after maximum have no effect', () => {
    const [game, player] = testGame(2, {pathfindersExpansion: true});
    const pathfindersData = game.pathfindersData!;

    pathfindersData.jovian = 13;
    PathfindersExpansion.raiseTrack(Tag.JOVIAN, player, 3);
    expect(pathfindersData.jovian).eq(14);
  });

  it('played card', () => {
    const [game, player] = testGame(1, {pathfindersExpansion: true});
    const pathfindersData = game.pathfindersData!;

    expect(pathfindersData.earth).eq(0);
    player.playCard(fakeCard({name: 'A' as CardName, tags: [Tag.EARTH]}));
    expect(pathfindersData.earth).eq(1);
  });


  it('grant - 1vp', () => {
    const [game, player] = testGame(1, {pathfindersExpansion: true});

    PathfindersExpansion.grant('1vp', player, Tag.EARTH);
    runAllActions(game);

    expect(player.getVictoryPoints().planetaryTracks).eq(1);
  });

  it('grant - 2vp', () => {
    const [game, player] = testGame(1, {pathfindersExpansion: true});

    PathfindersExpansion.grant('2vp', player, Tag.EARTH);
    runAllActions(game);

    expect(player.getVictoryPoints().planetaryTracks).eq(2);
  });

  it('grant - 3mc', () => {
    const [game, player] = testGame(1, {pathfindersExpansion: true});

    PathfindersExpansion.grant('3mc', player, Tag.EARTH);
    runAllActions(game);

    expect(player.megaCredits).eq(3);
  });

  it('grant - 6mc', () => {
    const [game, player] = testGame(1, {pathfindersExpansion: true});

    PathfindersExpansion.grant('6mc', player, Tag.EARTH);
    runAllActions(game);

    expect(player.megaCredits).eq(6);
  });

  it('grant - any_resource', () => {
    const [game, player] = testGame(1, {pathfindersExpansion: true});

    const floaterCard = fakeCard({resourceType: CardResource.FLOATER});
    player.playedCards.push(floaterCard);

    PathfindersExpansion.grant('any_resource', player, Tag.EARTH);
    runAllActions(game);

    const selectResource = cast(player.popWaitingFor(), SelectResource);
    selectResource.cb('titanium');
    expect(player.titanium).eq(1);
  });

  it('grant - card', () => {
    const [game, player] = testGame(1, {pathfindersExpansion: true});

    PathfindersExpansion.grant('card', player, Tag.EARTH);
    runAllActions(game);

    expect(player.cardsInHand).has.length(1);
  });

  it('grant delegate reward', () => {
    const [game, player] = testGame(1, {
      pathfindersExpansion: true,
      turmoilExtension: true,
    });

    PathfindersExpansion.grant('delegate', player, Tag.EARTH);
    runAllActions(game);
    cast(player.popWaitingFor(), SelectParty);
  });

  it('grant delegate reward - no grant when player has no available delegates', () => {
    const [game, player] = testGame(1, {
      pathfindersExpansion: true,
      turmoilExtension: true,
    });

    const turmoil = Turmoil.getTurmoil(game);
    turmoil.delegateReserve.clear();
    PathfindersExpansion.grant('delegate', player, Tag.EARTH);
    runAllActions(game);
    cast(player.getWaitingFor(), undefined);
  });

  it('grant - city', () => {
    const [game, player] = testGame(1, {pathfindersExpansion: true});

    PathfindersExpansion.grant('city', player, Tag.EARTH);
    runAllActions(game);

    assertPlaceCity(player, player.popWaitingFor());
  });

  it('grant - energy', () => {
    const [game, player] = testGame(1, {pathfindersExpansion: true});

    PathfindersExpansion.grant('energy', player, Tag.EARTH);
    runAllActions(game);

    expect(player.stock.energy).eq(1);
  });

  it('grant - energy_production', () => {
    const [game, player] = testGame(1, {pathfindersExpansion: true});

    PathfindersExpansion.grant('energy_production', player, Tag.EARTH);
    runAllActions(game);

    expect(player.production.energy).eq(1);
  });

  it('grant - floater', () => {
    const [game, player] = testGame(1, {pathfindersExpansion: true});

    const floaterCard = fakeCard({resourceType: CardResource.FLOATER});
    player.playedCards.push(floaterCard);

    PathfindersExpansion.grant('floater', player, Tag.EARTH);
    runAllActions(game);

    expect(floaterCard.resourceCount).eq(1);
  });

  it('grant - greenery', () => {
    const [game, player] = testGame(1, {pathfindersExpansion: true});

    PathfindersExpansion.grant('greenery', player, Tag.EARTH);
    runAllActions(game);

    assertPlaceGreenery(player, player.popWaitingFor());
  });

  it('grant - heat', () => {
    const [game, player] = testGame(1, {pathfindersExpansion: true});

    PathfindersExpansion.grant('heat', player, Tag.EARTH);
    runAllActions(game);

    expect(player.stock.heat).eq(1);
  });

  it('grant - heat_production', () => {
    const [game, player] = testGame(1, {pathfindersExpansion: true});

    PathfindersExpansion.grant('heat_production', player, Tag.EARTH);
    runAllActions(game);

    expect(player.production.heat).eq(1);
  });

  it('grant - moon_road', () => {
    const [game, player] = testGame(1, {
      pathfindersExpansion: true,
      moonExpansion: true,
    });

    PathfindersExpansion.grant('moon_road', player, Tag.EARTH);
    runAllActions(game);

    assertPlaceMoonRoad(player, player.popWaitingFor());
  });

  it('grant - moon_mine', () => {
    const [game, player] = testGame(1, {
      pathfindersExpansion: true,
      moonExpansion: true,
    });

    PathfindersExpansion.grant('moon_mine', player, Tag.EARTH);
    runAllActions(game);

    assertPlaceMoonMine(player, player.popWaitingFor());
  });

  it('grant - ocean', () => {
    const [game, player] = testGame(1, {pathfindersExpansion: true});

    PathfindersExpansion.grant('ocean', player, Tag.EARTH);
    runAllActions(game);

    assertPlaceOcean(player, player.popWaitingFor());
  });

  it('grant - plant', () => {
    const [game, player] = testGame(1, {pathfindersExpansion: true});

    PathfindersExpansion.grant('plant', player, Tag.EARTH);
    runAllActions(game);

    expect(player.stock.plants).eq(1);
  });

  it('grant - plant_production', () => {
    const [game, player] = testGame(1, {pathfindersExpansion: true});

    PathfindersExpansion.grant('plant_production', player, Tag.EARTH);
    runAllActions(game);

    expect(player.production.plants).eq(1);
  });

  it('grant - resource', () => {
    const [game, player] = testGame(1, {pathfindersExpansion: true});

    PathfindersExpansion.grant('resource', player, Tag.EARTH);
    runAllActions(game);

    const selectResource = cast(player.popWaitingFor(), SelectResource);
    selectResource.cb('plants');
    expect(player.plants).eq(1);
  });

  it('grant - steel', () => {
    const [game, player] = testGame(1, {pathfindersExpansion: true});

    PathfindersExpansion.grant('steel', player, Tag.EARTH);
    runAllActions(game);

    expect(player.stock.steel).eq(1);
  });

  it('grant - steel_production', () => {
    const [game, player] = testGame(1, {pathfindersExpansion: true});

    PathfindersExpansion.grant('steel_production', player, Tag.EARTH);
    runAllActions(game);

    expect(player.production.steel).eq(1);
  });

  it('grant - titanium', () => {
    const [game, player] = testGame(1, {pathfindersExpansion: true});

    PathfindersExpansion.grant('titanium', player, Tag.EARTH);
    runAllActions(game);

    expect(player.stock.titanium).eq(1);
  });

  it('grant - titanium_production', () => {
    const [game, player] = testGame(1, {pathfindersExpansion: true});

    PathfindersExpansion.grant('titanium_production', player, Tag.EARTH);
    runAllActions(game);

    expect(player.production.titanium).eq(1);
  });

  it('grant - tr', () => {
    const [game, player] = testGame(1, {pathfindersExpansion: true});

    PathfindersExpansion.grant('tr', player, Tag.EARTH);
    runAllActions(game);

    expect(player.getTerraformRating()).eq(15);
  });

  it('grant - venus_scale', () => {
    const [game, player] = testGame(1, {
      pathfindersExpansion: true,
      venusNextExtension: true,
    });

    PathfindersExpansion.grant('venus_scale', player, Tag.EARTH);
    runAllActions(game);

    expect(game.getVenusScaleLevel()).eq(2);
    expect(player.getTerraformRating()).eq(15);
  });
});
