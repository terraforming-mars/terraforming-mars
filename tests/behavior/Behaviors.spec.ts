import {expect} from 'chai';
import {Game} from '../../src/server/Game';
import {Player} from '../../src/server/Player';
import {TestPlayer} from '../TestPlayer';
import {getTestPlayer, newTestGame} from '../TestGame';
import {Behaviors} from '../../src/server/behavior/Behaviors';
import {Units} from '../../src/common/Units';
import {Payment} from '../../src/common/inputs/Payment';
import {Resources} from '../../src/common/Resources';
import {CardResource} from '../../src/common/CardResource';
import {Tag} from '../../src/common/cards/Tag';
import {CardType} from '../../src/common/cards/CardType';
import {cast, runAllActions} from '../TestingUtils';
import {SelectCard} from '../../src/server/inputs/SelectCard';

function asUnits(player: Player): Units {
  return {
    megacredits: player.megaCredits,
    steel: player.steel,
    titanium: player.titanium,
    plants: player.plants,
    energy: player.energy,
    heat: player.heat,
  };
}

describe('Behaviors', () => {
  let game: Game;
  let player: TestPlayer;
  // let player2: TestPlayer;

  beforeEach(() => {
    game = newTestGame(2);
    player = getTestPlayer(game, 0);
    // player2 = getTestPlayer(game, 1);
  });

  it('production - simple', () => {
    expect(player.production.asUnits()).deep.eq(Units.EMPTY);
    Behaviors.execute({production: {megacredits: 2}}, player);
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 2}));
  });

  it('production - negative', () => {
    const behavior = {production: {megacredits: 2, steel: -1}};
    expect(player.production.asUnits()).deep.eq(Units.EMPTY);

    expect(Behaviors.canExecute(behavior, player)).is.false;

    player.production.add(Resources.STEEL, 1);

    expect(Behaviors.canExecute(behavior, player)).is.true;

    Behaviors.execute(behavior, player);
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 2, steel: 0}));
  });

  it('production - simple', () => {
    expect(player.production.asUnits()).deep.eq(Units.EMPTY);
    Behaviors.execute({production: {megacredits: 2}}, player);
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 2}));
  });

  it('stock - simple', () => {
    player.steel = 2;
    player.heat = 5;
    Behaviors.execute({stock: {steel: 3, heat: 2}}, player);
    expect(asUnits(player)).deep.eq(Units.of({steel: 5, heat: 7}));
  });

  it('steelValue', () => {
    expect(player.payingAmount(Payment.of({steel: 4}), {steel: true})).eq(8);
    Behaviors.execute({steelValue: 1}, player);
    expect(player.payingAmount(Payment.of({steel: 4}), {steel: true})).eq(12);
    Behaviors.onDiscard({steelValue: 1}, player);
    expect(player.payingAmount(Payment.of({steel: 4}), {steel: true})).eq(8);
  });

  it('titaniumValue', () => {
    expect(player.payingAmount(Payment.of({titanium: 4}), {titanium: true})).eq(12);
    Behaviors.execute({titanumValue: 1}, player);
    expect(player.payingAmount(Payment.of({titanium: 4}), {titanium: true})).eq(16);
    Behaviors.onDiscard({titanumValue: 1}, player);
    expect(player.payingAmount(Payment.of({titanium: 4}), {titanium: true})).eq(12);
  });

  it('greeneryDiscount', () => {
    player.plants = 8;
    expect(game.canPlaceGreenery(player)).is.true;

    player.plants = 7;
    expect(game.canPlaceGreenery(player)).is.false;

    Behaviors.execute({greeneryDiscount: 1}, player);
    expect(game.canPlaceGreenery(player)).is.true;

    player.plants = 6;
    expect(game.canPlaceGreenery(player)).is.false;

    Behaviors.execute({greeneryDiscount: 1}, player);
    expect(game.canPlaceGreenery(player)).is.true;

    Behaviors.onDiscard({greeneryDiscount: 1}, player);
    expect(game.canPlaceGreenery(player)).is.false;

    player.plants = 7;
    expect(game.canPlaceGreenery(player)).is.true;
  });

  it('drawCard - simple', () => {
    expect(player.cardsInHand).has.length(0);
    player.megaCredits = 5;
    Behaviors.execute({drawCard: 3}, player);
    expect(player.cardsInHand).has.length(3);
    expect(player.megaCredits).eq(5);
  });

  it('drawCard, resource type', () => {
    expect(player.cardsInHand).has.length(0);
    Behaviors.execute({drawCard: {count: 3, resource: CardResource.MICROBE}}, player);
    expect(player.cardsInHand).has.length(3);
    expect(player.cardsInHand[0].resourceType).eq(CardResource.MICROBE);
    expect(player.cardsInHand[1].resourceType).eq(CardResource.MICROBE);
    expect(player.cardsInHand[2].resourceType).eq(CardResource.MICROBE);
  });

  it('drawCard, tag', () => {
    expect(player.cardsInHand).has.length(0);
    Behaviors.execute({drawCard: {count: 3, tag: Tag.BUILDING}}, player);
    expect(player.cardsInHand).has.length(3);
    expect(player.cardsInHand[0].tags).contains(Tag.BUILDING);
    expect(player.cardsInHand[1].tags).contains(Tag.BUILDING);
    expect(player.cardsInHand[2].tags).contains(Tag.BUILDING);
  });

  it('drawCard, type and tag', () => {
    expect(player.cardsInHand).has.length(0);
    player.megaCredits = 5;
    Behaviors.execute({drawCard: {count: 3, tag: Tag.SPACE, type: CardType.EVENT}}, player);
    expect(player.cardsInHand).has.length(3);
    expect(player.cardsInHand[0].tags).contains(Tag.SPACE);
    expect(player.cardsInHand[1].tags).contains(Tag.SPACE);
    expect(player.cardsInHand[2].tags).contains(Tag.SPACE);
    expect(player.cardsInHand[0].cardType).eq(CardType.EVENT);
    expect(player.cardsInHand[1].cardType).eq(CardType.EVENT);
    expect(player.cardsInHand[2].cardType).eq(CardType.EVENT);
    expect(player.megaCredits).eq(5);
  });

  it('drawCard, type and tag, keep some', () => {
    expect(player.cardsInHand).has.length(0);
    player.megaCredits = 5;

    Behaviors.execute({drawCard: {count: 3, tag: Tag.SPACE, type: CardType.EVENT, keep: 2}}, player);

    runAllActions(game);

    const selectCard = cast(player.popWaitingFor(), SelectCard);
    expect(selectCard.cards).has.length(3);
    expect(selectCard.config.max).eq(2);
    expect(selectCard.config.min).eq(2);
    const cards = selectCard.cards;
    selectCard.cb([cards[0], cards[1]]);
    expect(player.cardsInHand).has.length(2);
    expect(player.megaCredits).eq(5);
  });

  it('drawCard, pay', () => {
    expect(player.cardsInHand).has.length(0);
    player.megaCredits = 5;
    Behaviors.execute({drawCard: {count: 1, pay: true}}, player);

    runAllActions(game);

    const selectCard = cast(player.popWaitingFor(), SelectCard);
    selectCard.cb([selectCard.cards[0]]);
    runAllActions(game);

    expect(player.cardsInHand).has.length(1);
    expect(player.megaCredits).eq(2);
  });
});

// if (behavior.global !== undefined) {
//   const g = behavior.global;
//   if (g.temperature !== undefined) player.game.increaseTemperature(player, g.temperature);
//   if (g.oxygen !== undefined) player.game.increaseOxygenLevel(player, g.oxygen);
//   if (g.BUILDING !== undefined) player.game.increaseBUILDINGScaleLevel(player, g.BUILDING);
// }

// if (behavior.tr !== undefined) {
//   player.increaseTerraformRatingSteps(behavior.tr);
// }
// if (behavior.addResources !== undefined) {
//   if (card === undefined) {
//     throw new Error('Cannot add resources without supplying a card');
//   }
//   player.game.defer(new SimpleDeferredAction(player, () => {
//     player.addResourceTo(card, behavior.addResources);
//     return undefined;
//   }));
// }

// if (behavior.addResourcesToAnyCard) {
//   const array = Array.isArray(behavior.addResourcesToAnyCard) ? behavior.addResourcesToAnyCard : [behavior.addResourcesToAnyCard];
//   for (const entry of array) {
//     player.game.defer(new AddResourcesToCard(player, entry.type, {count: entry.count}));
//   }
// }
// if (behavior.decreaseAnyProduction !== undefined) {
//   player.game.defer(new DecreaseAnyProduction(player, behavior.decreaseAnyProduction.type, {count: behavior.decreaseAnyProduction.count}));
// }
// if (behavior.removeAnyPlants !== undefined) {
//   player.game.defer(new RemoveAnyPlants(player, behavior.removeAnyPlants));
// }
// if (behavior.colonies !== undefined) {
//   const colonies = behavior.colonies;
//   if (colonies.buildColony !== undefined) {
//     player.game.defer(new BuildColony(player, {allowDuplicate: colonies.buildColony.allowDuplicates}));
//   }
//   if (colonies.addTradeFleet !== undefined) {
//     for (let idx = 0; idx < colonies.addTradeFleet; idx++) {
//       player.colonies.increaseFleetSize();
//     }
//   }
//   if (colonies.tradeDiscount !== undefined) {
//     player.colonies.tradeDiscount += colonies.tradeDiscount;
//   }
//   if (colonies.tradeOffset !== undefined) {
//     player.colonies.tradeOffset += colonies.tradeOffset;
//   }
// }

// if (behavior.ocean !== undefined) {
//   player.game.defer(new PlaceOceanTile(player));
// }
// if (behavior.city !== undefined) {
//   if (behavior.city.space !== undefined) {
//     player.game.addCityTile(player, behavior.city.space, behavior.city.type);
//   } else {
//     player.game.defer(new PlaceCityTile(player));
//   }
// }
// if (behavior.greenery !== undefined) {
//   player.game.defer(new PlaceGreeneryTile(player));
// }

// // TODO(kberg): Add canPlay for these behaviors.
// if (behavior.moon !== undefined) {
//   const moon = behavior.moon;
//   if (moon.colonyTile !== undefined) {
//     if (moon.colonyTile.space === undefined) {
//       player.game.defer(new PlaceMoonColonyTile(player));
//     } else {
//       MoonExpansion.addColonyTile(player, moon.colonyTile.space, card?.name);
//       MoonExpansion.raiseColonyRate(player);
//     }
//   }
//   if (moon.mineTile !== undefined) {
//     if (moon.mineTile.space === undefined) {
//       player.game.defer(new PlaceMoonMineTile(player));
//     } else {
//       MoonExpansion.addMineTile(player, moon.mineTile.space, card?.name);
//       MoonExpansion.raiseMiningRate(player);
//     }
//   }
//   if (moon.roadTile !== undefined) {
//     if (moon.roadTile.space === undefined) {
//       player.game.defer(new PlaceMoonRoadTile(player));
//     } else {
//       MoonExpansion.addRoadTile(player, moon.roadTile.space, card?.name);
//       MoonExpansion.raiseLogisticRate(player);
//     }
//   }
//   if (moon.tile !== undefined) {
//     if (moon.tile.space !== undefined) {
//       MoonExpansion.addTile(player, moon.tile.space, {tileType: moon.tile.type, card: card?.name});
//     } else {
//       player.game.defer(new PlaceSpecialMoonTile(
//         player, {tileType: moon.tile.type, card: card?.name},
//         moon.tile.title));
//     }
//   }
//   if (moon.colonyRate !== undefined) MoonExpansion.raiseColonyRate(player, moon.colonyRate);
//   if (moon.miningRate !== undefined) MoonExpansion.raiseMiningRate(player, moon.miningRate);
//   if (moon.logisticsRate !== undefined) MoonExpansion.raiseLogisticRate(player, moon.logisticsRate);
// }
