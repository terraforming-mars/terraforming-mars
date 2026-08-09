import {expect} from 'chai';
import {IGame} from '../../src/server/IGame';
import {IPlayer} from '../../src/server/IPlayer';
import {TestPlayer} from '../TestPlayer';
import {testGame} from '../TestGame';
import {Executor} from '../../src/server/behavior/Executor';
import {Units} from '../../src/common/Units';
import {Payment} from '../../src/common/inputs/Payment';
import {Resource} from '../../src/common/Resource';
import {CardResource} from '../../src/common/CardResource';
import {Tag} from '../../src/common/cards/Tag';
import {CardType} from '../../src/common/cards/CardType';
import {fakeCard, formatMessage, runAllActions, setOxygenLevel, setRulingParty, setVenusScaleLevel} from '../TestingUtils';
import {SelectCard} from '../../src/server/inputs/SelectCard';
import {SelectOption} from '../../src/server/inputs/SelectOption';
import {SelectPlayer} from '../../src/server/inputs/SelectPlayer';
import {Tardigrades} from '../../src/server/cards/base/Tardigrades';
import {Ants} from '../../src/server/cards/base/Ants';
import {Birds} from '../../src/server/cards/base/Birds';
import {RegolithEaters} from '../../src/server/cards/base/RegolithEaters';
import {Livestock} from '../../src/server/cards/base/Livestock';
import {IProjectCard} from '../../src/server/cards/IProjectCard';
import {NitriteReducingBacteria} from '../../src/server/cards/base/NitriteReducingBacteria';
import {AerialMappers} from '../../src/server/cards/venusNext/AerialMappers';
import {Dirigibles} from '../../src/server/cards/venusNext/Dirigibles';
import {SaturnSurfing} from '../../src/server/cards/promo/SaturnSurfing';
import {Behavior} from '../../src/server/behavior/Behavior';
import {OrOptions} from '../../src/server/inputs/OrOptions';
import {StormCraftIncorporated} from '../../src/server/cards/colonies/StormCraftIncorporated';
import {AndOptions} from '../../src/server/inputs/AndOptions';
import {SelectSpace} from '../../src/server/inputs/SelectSpace';
import {SelectResources} from '../../src/server/inputs/SelectResources';
import {SelectResource} from '../../src/server/inputs/SelectResource';
import {MicroMills} from '../../src/server/cards/base/MicroMills';
import {HeatTrappers} from '../../src/server/cards/base/HeatTrappers';
import {PartyName} from '../../src/common/turmoil/PartyName';
import {Helion} from '../../src/server/cards/corporation/Helion';
import {SelectPayment} from '../../src/server/inputs/SelectPayment';
import {CardName} from '../../src/common/cards/CardName';
import {cast} from '@/common/utils/utils';
import {AsteroidMining} from '../../src/server/turmoil/globalEvents/AsteroidMining';
import {MAX_OXYGEN_LEVEL, MAX_VENUS_SCALE} from '../../src/common/constants';
import {TileType} from '../../src/common/TileType';

function asUnits(player: IPlayer): Units {
  return {
    megacredits: player.megaCredits,
    steel: player.steel,
    titanium: player.titanium,
    plants: player.plants,
    energy: player.energy,
    heat: player.heat,
  };
}

describe('Executor', () => {
  let game: IGame;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let fake: IProjectCard;
  let executor: Executor;

  beforeEach(() => {
    [game, player, player2, player3] = testGame(3, {turmoilExtension: true, venusNextExtension: true, underworldExpansion: true});

    fake = fakeCard({name: 'Fake Card' as CardName});
    executor = new Executor();
  });

  it('production - simple', () => {
    expect(player.production.asUnits()).deep.eq(Units.EMPTY);
    executor.execute({production: {megacredits: 2}}, player, fake);
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 2}));
  });

  it('production - negative', () => {
    const behavior = {production: {megacredits: 2, steel: -1}};
    expect(player.production.asUnits()).deep.eq(Units.EMPTY);

    expect(executor.canExecute(behavior, player, fake)).is.false;

    player.production.add(Resource.STEEL, 1);

    expect(executor.canExecute(behavior, player, fake)).is.true;

    executor.execute(behavior, player, fake);
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 2, steel: 0}));
  });

  it('production - simple', () => {
    expect(player.production.asUnits()).deep.eq(Units.EMPTY);
    executor.execute({production: {megacredits: 2}}, player, fake);
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 2}));
  });

  it('stock - simple', () => {
    player.steel = 2;
    player.heat = 5;
    executor.execute({stock: {steel: 3, heat: 2}}, player, fake);
    expect(asUnits(player)).deep.eq(Units.of({steel: 5, heat: 7}));
  });

  it('steelValue', () => {
    expect(player.payingAmount(Payment.of({steel: 4}), {steel: true})).eq(8);
    executor.execute({steelValue: 1}, player, fake);
    expect(player.payingAmount(Payment.of({steel: 4}), {steel: true})).eq(12);
    executor.onDiscard({steelValue: 1}, player, fake);
    expect(player.payingAmount(Payment.of({steel: 4}), {steel: true})).eq(8);
  });

  it('titaniumValue', () => {
    expect(player.payingAmount(Payment.of({titanium: 4}), {titanium: true})).eq(12);
    executor.execute({titanumValue: 1}, player, fake);
    expect(player.payingAmount(Payment.of({titanium: 4}), {titanium: true})).eq(16);
    executor.onDiscard({titanumValue: 1}, player, fake);
    expect(player.payingAmount(Payment.of({titanium: 4}), {titanium: true})).eq(12);
  });

  it('greeneryDiscount', () => {
    player.plants = 8;
    expect(game.canPlaceGreenery(player)).is.true;

    player.plants = 7;
    expect(game.canPlaceGreenery(player)).is.false;

    executor.execute({greeneryDiscount: 1}, player, fake);
    expect(game.canPlaceGreenery(player)).is.true;

    player.plants = 6;
    expect(game.canPlaceGreenery(player)).is.false;

    executor.execute({greeneryDiscount: 1}, player, fake);
    expect(game.canPlaceGreenery(player)).is.true;

    executor.onDiscard({greeneryDiscount: 1}, player, fake);
    expect(game.canPlaceGreenery(player)).is.false;

    player.plants = 7;
    expect(game.canPlaceGreenery(player)).is.true;
  });

  it('drawCard - simple', () => {
    expect(player.cardsInHand).has.length(0);
    player.megaCredits = 5;
    executor.execute({drawCard: 3}, player, fake);
    expect(player.cardsInHand).has.length(3);
    expect(player.megaCredits).eq(5);
  });

  it('drawCard, resource type', () => {
    expect(player.cardsInHand).has.length(0);
    executor.execute({drawCard: {count: 3, resource: CardResource.MICROBE}}, player, fake);
    expect(player.cardsInHand).has.length(3);
    expect(player.cardsInHand[0].resourceType).eq(CardResource.MICROBE);
    expect(player.cardsInHand[1].resourceType).eq(CardResource.MICROBE);
    expect(player.cardsInHand[2].resourceType).eq(CardResource.MICROBE);
  });

  it('drawCard, tag', () => {
    expect(player.cardsInHand).has.length(0);
    executor.execute({drawCard: {count: 3, tag: Tag.BUILDING}}, player, fake);
    expect(player.cardsInHand).has.length(3);
    expect(player.cardsInHand[0].tags).contains(Tag.BUILDING);
    expect(player.cardsInHand[1].tags).contains(Tag.BUILDING);
    expect(player.cardsInHand[2].tags).contains(Tag.BUILDING);
  });

  it('drawCard, type and tag', () => {
    expect(player.cardsInHand).has.length(0);
    player.megaCredits = 5;
    executor.execute({drawCard: {count: 3, tag: Tag.SPACE, type: CardType.EVENT}}, player, fake);
    expect(player.cardsInHand).has.length(3);
    expect(player.cardsInHand[0].tags).contains(Tag.SPACE);
    expect(player.cardsInHand[1].tags).contains(Tag.SPACE);
    expect(player.cardsInHand[2].tags).contains(Tag.SPACE);
    expect(player.cardsInHand[0].type).eq(CardType.EVENT);
    expect(player.cardsInHand[1].type).eq(CardType.EVENT);
    expect(player.cardsInHand[2].type).eq(CardType.EVENT);
    expect(player.megaCredits).eq(5);
  });

  it('drawCard, type and tag, keep some', () => {
    expect(player.cardsInHand).has.length(0);
    player.megaCredits = 5;

    executor.execute({drawCard: {count: 3, tag: Tag.SPACE, type: CardType.EVENT, keep: 2}}, player, fake);

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
    executor.execute({drawCard: {count: 1, pay: true}}, player, fake);

    runAllActions(game);

    const selectCard = cast(player.popWaitingFor(), SelectCard);
    selectCard.cb([selectCard.cards[0]]);
    runAllActions(game);

    expect(player.cardsInHand).has.length(1);
    expect(player.megaCredits).eq(2);
  });

  it('drawCard - countable', () => {
    expect(player.cardsInHand).has.length(0);
    player.tagsForTest = {animal: 2, wild: 1};
    executor.execute({drawCard: {count: {tag: Tag.ANIMAL}}}, player, fake);
    expect(player.cardsInHand).has.length(3);
  });

  it('global parameters', () => {
    function levels(): [number, number, number] {
      return [game.getTemperature(), game.getOxygenLevel(), game.getVenusScaleLevel()];
    }

    expect(levels()).deep.eq([-30, 0, 0]);

    executor.execute({global: {temperature: 2}}, player, fake);
    expect(levels()).deep.eq([-26, 0, 0]);

    executor.execute({global: {oxygen: 1}}, player, fake);
    expect(levels()).deep.eq([-26, 1, 0]);

    executor.execute({global: {venus: 1}}, player, fake);
    expect(levels()).deep.eq([-26, 1, 2]);

    executor.execute({global: {temperature: 1, oxygen: 2, venus: 3}}, player, fake);
    expect(levels()).deep.eq([-24, 3, 8]);
  });

  it('tr', () => {
    expect(player.terraformRating).eq(20);

    executor.execute({tr: 2}, player, fake);

    expect(player.terraformRating).eq(22);

    executor.execute({tr: -1}, player, fake);

    expect(player.terraformRating).eq(21);
  });

  it('ocean - first player places, acting player is credited (Icy Impactors)', () => {
    const behavior: Behavior = {ocean: {firstPlayerPlaces: true}};
    expect(game.first).eq(player);
    expect(player2.terraformRating).eq(20);

    executor.execute(behavior, player2, fake);
    runAllActions(game);

    // The acting player isn't the one placing the tile.
    expect(player2.popWaitingFor()).is.undefined;

    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    selectSpace.cb(selectSpace.spaces[0]);

    expect(selectSpace.spaces[0].tile?.tileType).eq(TileType.OCEAN);
    expect(player2.terraformRating).eq(21);
    expect(player.terraformRating).eq(20);
  });

  it('add resources to specific card', () => {
    const tardigrades = new Tardigrades();
    tardigrades.resourceCount = 2;
    executor.execute({addResources: 3}, player, tardigrades);
    runAllActions(game);

    expect(tardigrades.resourceCount).eq(5);
  });

  it('add resources to specific card - countable', () => {
    const tardigrades = new Tardigrades();
    tardigrades.resourceCount = 2;
    player.tagsForTest = {moon: 7};
    executor.execute({addResources: {tag: Tag.MOON, per: 3}}, player, tardigrades);
    runAllActions(game);

    expect(tardigrades.resourceCount).eq(4);
  });

  // This is a special test that ensure counting the resources works appropriately.
  // Because beforehand, it counted an additional tag.
  it('add resources to specific card - includes self', () => {
    const saturnSurfing = new SaturnSurfing();
    player.playedCards.set(fakeCard({tags: [Tag.EARTH, Tag.EARTH]}));
    player.megaCredits = saturnSurfing.cost;
    player.playCard(saturnSurfing);
    runAllActions(game);

    expect(saturnSurfing.resourceCount).eq(3);
  });

  it('add resources to any card - type undefined (any resource card)', () => {
    const tardigrades = new Tardigrades(); // microbes
    const livestock = new Livestock(); // animals
    player.playedCards.set(tardigrades, livestock);

    executor.execute({addResourcesToAnyCard: {count: 1, type: undefined}}, player, fake);
    runAllActions(game);

    const selectCard = cast(player.popWaitingFor(), SelectCard);
    expect(selectCard.cards).has.members([tardigrades, livestock]);
    selectCard.cb([tardigrades]);

    expect(tardigrades.resourceCount).eq(1);
    expect(livestock.resourceCount).eq(0);
  });

  it('add resources to any card', () => {
    const tardigrades = new Tardigrades(); // Holds microbes
    const ants = new Ants(); // Holds microbes
    const regolithEathers = new RegolithEaters(); // Holds microbes
    const livestock = new Livestock(); // Holds animals

    function resourceCount() {
      return {
        tardigrades: tardigrades.resourceCount,
        ants: ants.resourceCount,
        regolithEathers: regolithEathers.resourceCount,
        livestock: livestock.resourceCount,
      };
    }

    player.playedCards.set(tardigrades, ants, regolithEathers, livestock);

    expect(resourceCount()).deep.eq({
      tardigrades: 0,
      ants: 0,
      regolithEathers: 0,
      livestock: 0,
    });

    // No floater cards.
    executor.execute({addResourcesToAnyCard: {count: 2, type: CardResource.FLOATER}}, player, fake);
    runAllActions(game);

    cast(player.popWaitingFor(), undefined);
    expect(resourceCount()).deep.eq({
      tardigrades: 0,
      ants: 0,
      regolithEathers: 0,
      livestock: 0,
    });

    // One animal card. Auto-populated.
    executor.execute({addResourcesToAnyCard: {count: 2, type: CardResource.ANIMAL}}, player, fake);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);

    expect(resourceCount()).deep.eq({
      tardigrades: 0,
      ants: 0,
      regolithEathers: 0,
      livestock: 2,
    });

    // Three microbe cards. Player is asked to choose.
    executor.execute({addResourcesToAnyCard: {count: 1, type: CardResource.MICROBE}}, player, fake);
    runAllActions(game);
    const selectCard = cast(player.popWaitingFor(), SelectCard);

    expect(selectCard.cards).has.members([tardigrades, ants, regolithEathers]);

    selectCard.cb([ants]);

    expect(resourceCount()).deep.eq({
      tardigrades: 0,
      ants: 1,
      regolithEathers: 0,
      livestock: 2,
    });
  });

  it('add resources to any card - countable', () => {
    const tardigrades = new Tardigrades(); // Holds microbes
    const ants = new Ants(); // Holds microbes
    const regolithEathers = new RegolithEaters(); // Holds microbes
    const livestock = new Livestock(); // Holds animals

    player.playedCards.set(tardigrades, ants, regolithEathers, livestock);

    expect(livestock.resourceCount).eq(0);

    // Count microbe tags, add that many resources to livestock. What a crazy idea. :D
    executor.execute({addResourcesToAnyCard: {count: {tag: Tag.MICROBE}, type: CardResource.ANIMAL}}, player, fake);
    runAllActions(game);

    expect(livestock.resourceCount).eq(3);
  });

  it('add resources to any card - countable, zero count', () => {
    const livestock = new Livestock(); // Holds animals
    const birds = new Birds(); // Holds animals

    player.playedCards.set(birds, livestock);

    expect(livestock.resourceCount).eq(0);

    // There are no microbe tags.
    executor.execute({addResourcesToAnyCard: {count: {tag: Tag.MICROBE}, type: CardResource.ANIMAL}}, player, fake);
    runAllActions(game);

    cast(player.popWaitingFor(), undefined);
    expect(livestock.resourceCount).eq(0);
    expect(birds.resourceCount).eq(0);

    // Second half of the test.

    // But if one card has a microbe tag
    player.playedCards.push(new Ants());
    executor.execute({addResourcesToAnyCard: {count: {tag: Tag.MICROBE}, type: CardResource.ANIMAL}}, player, fake);
    runAllActions(game);

    // There will be one animal to place.
    const selectCard = cast(player.popWaitingFor(), SelectCard);
    selectCard.cb([livestock]);

    expect(birds.resourceCount).eq(0);
    expect(livestock.resourceCount).eq(1);
  });

  it('add resources to any card by tag', () => {
    const aerialMappers = new AerialMappers(); // Venus tag with Floaters
    const dirigibles = new Dirigibles(); // Venus tag with Floaters
    const nitriteReducingBacteria = new NitriteReducingBacteria(); // Microbe tag with microbes
    player.playedCards.push(aerialMappers, dirigibles, nitriteReducingBacteria);

    executor.execute({addResourcesToAnyCard: {count: 1, tag: Tag.VENUS}}, player, fake);
    runAllActions(game);

    const selectCard = cast(player.popWaitingFor(), SelectCard);
    expect(selectCard.cards).does.not.include(nitriteReducingBacteria);
    expect(selectCard.cards).includes(aerialMappers);
    expect(selectCard.cards).includes(dirigibles);
  });

  it('add resources to any card by tag varies with `mustHaveCard`', () => {
    expect(executor.canExecute({addResourcesToAnyCard: {count: 1, type: CardResource.ANIMAL}}, player, fake)).is.true;
    expect(executor.canExecute({addResourcesToAnyCard: {count: 1, type: CardResource.ANIMAL, mustHaveCard: true}}, player, fake)).is.false;
  });

  it('add resources to any card, without excludeThis the acting card is a candidate too', () => {
    const actingCard = new Birds(); // Holds animals
    const livestock = new Livestock(); // Holds animals
    player.playedCards.set(actingCard, livestock);

    executor.execute({addResourcesToAnyCard: {count: 1, type: CardResource.ANIMAL}}, player, actingCard);
    runAllActions(game);

    const selectCard = cast(player.popWaitingFor(), SelectCard);
    expect(selectCard.cards).has.members([actingCard, livestock]);
  });

  it('add resources to any card, excludeThis rules out the acting card', () => {
    const actingCard = new Birds(); // Holds animals
    const livestock = new Livestock(); // Holds animals
    player.playedCards.set(actingCard, livestock);

    executor.execute({addResourcesToAnyCard: {count: 1, type: CardResource.ANIMAL, excludeThis: true}}, player, actingCard);
    runAllActions(game);

    // livestock is the only eligible target once the acting card excludes itself, so it's auto-populated.
    cast(player.popWaitingFor(), undefined);
    expect(livestock.resourceCount).eq(1);
    expect(actingCard.resourceCount).eq(0);
  });

  it('add resources to any card, excludeThis combined with mustHaveCard', () => {
    const actingCard = new Birds(); // Holds animals
    player.playedCards.set(actingCard);

    const behavior: Behavior = {addResourcesToAnyCard: {count: 1, type: CardResource.ANIMAL, excludeThis: true, mustHaveCard: true}};

    // The acting card is the only animal-holding card, but excludeThis rules it out, so there's nothing to target.
    expect(executor.canExecute(behavior, player, actingCard)).is.false;

    const livestock = new Livestock();
    player.playedCards.push(livestock);
    expect(executor.canExecute(behavior, player, actingCard)).is.true;
  });

  it('removeResourcesFromAnyCard - count is a minimum, not just a presence check', () => {
    const target = fakeCard({resourceType: CardResource.ANIMAL});
    player.playedCards.push(target);
    target.resourceCount = 1;

    const behavior: Behavior = {removeResourcesFromAnyCard: {type: CardResource.ANIMAL, count: 2}};
    expect(executor.canExecute(behavior, player, fake)).is.false;

    target.resourceCount = 2;
    expect(executor.canExecute(behavior, player, fake)).is.true;
  });

  it('removeResourcesFromAnyCard - source self is unblockable and chains the rest of the behavior', () => {
    const target = fakeCard({resourceType: CardResource.ANIMAL});
    player.playedCards.push(target);
    target.resourceCount = 2;

    const behavior: Behavior = {
      removeResourcesFromAnyCard: {type: CardResource.ANIMAL, count: 2, source: 'self'},
      stock: {megacredits: 3},
    };
    executor.execute(behavior, player, fake);
    runAllActions(game);

    expect(target.resourceCount).eq(0);
    expect(player.megaCredits).eq(3);
  });

  it('removeResourcesFromAnyCard - source defaults to self', () => {
    const target = fakeCard({resourceType: CardResource.ANIMAL});
    player.playedCards.push(target);
    target.resourceCount = 1;

    const behavior: Behavior = {removeResourcesFromAnyCard: {type: CardResource.ANIMAL}, stock: {megacredits: 3}};
    executor.execute(behavior, player, fake);
    runAllActions(game);

    // No block prompt, unlike the explicit source: 'all' cases below.
    expect(target.resourceCount).eq(0);
    expect(player.megaCredits).eq(3);
  });

  it('removeResourcesFromAnyCard - a blocked attack skips the rest of the behavior', () => {
    const target = fakeCard({resourceType: CardResource.ANIMAL});
    player2.playedCards.push(target);
    target.resourceCount = 1;
    player2.underworldData.corruption = 1;

    const behavior: Behavior = {removeResourcesFromAnyCard: {type: CardResource.ANIMAL, source: 'all'}, stock: {megacredits: 3}};
    executor.execute(behavior, player, fake);
    runAllActions(game);

    const orOptions = cast(player2.popWaitingFor(), OrOptions);
    orOptions.options[0].cb(); // Block with corruption
    runAllActions(game);

    expect(target.resourceCount).eq(1);
    expect(player.megaCredits).eq(0);
  });

  it('removeResourcesFromAnyCard - an unblocked attack still runs the rest of the behavior', () => {
    const target = fakeCard({resourceType: CardResource.ANIMAL});
    player2.playedCards.push(target);
    target.resourceCount = 1;
    player2.underworldData.corruption = 1;

    const behavior: Behavior = {removeResourcesFromAnyCard: {type: CardResource.ANIMAL, source: 'all'}, stock: {megacredits: 3}};
    executor.execute(behavior, player, fake);
    runAllActions(game);

    const orOptions = cast(player2.popWaitingFor(), OrOptions);
    orOptions.options[1].cb(); // Do not block
    runAllActions(game);

    expect(target.resourceCount).eq(0);
    expect(player.megaCredits).eq(3);
  });

  it('decrease any production - cannot execute with zero targets', () => {
    expect(executor.canExecute({decreaseAnyProduction: {count: 2, type: Resource.TITANIUM}}, player, fake)).is.false;
  });

  it('decrease any production - standard', () => {
    const behavior = {decreaseAnyProduction: {count: 2, type: Resource.TITANIUM}};
    player.production.add(Resource.TITANIUM, 3);
    player2.production.add(Resource.TITANIUM, 2);
    player3.production.add(Resource.TITANIUM, 2);
    expect(executor.canExecute(behavior, player, fake)).is.true;

    executor.execute(behavior, player, fake);
    runAllActions(game);
    const selectPlayer = cast(player.popWaitingFor(), SelectPlayer);

    // Omits self.
    expect(selectPlayer.players).deep.eq([player, player2, player3]);

    selectPlayer.cb(player3);

    expect(player3.production.titanium).to.eq(0);
  });

  it('standard resource', () => {
    executor.execute({standardResource: 2}, player, fake);
    runAllActions(game);

    const selectResource = cast(player.popWaitingFor(), SelectResource);
    selectResource.cb('titanium');

    expect(player.stock.asUnits()).deep.eq(Units.of({titanium: 2}));
  });

  it('standard resource, same', () => {
    executor.execute({standardResource: {count: 3}}, player, fake);
    runAllActions(game);

    const selectResource = cast(player.popWaitingFor(), SelectResource);
    selectResource.cb('heat');

    expect(player.stock.asUnits()).deep.eq(Units.of({heat: 3}));
  });

  it('standard resource, different', () => {
    executor.execute({standardResource: {count: 3, same: false}}, player, fake);
    runAllActions(game);

    const selectResources = cast(player.popWaitingFor(), SelectResources);
    selectResources.cb(Units.of({titanium: 2, plants: 1}));

    expect(player.stock.asUnits()).deep.eq(Units.of({titanium: 2, plants: 1}));
  });

  it('spend - steel', () => {
    const behavior = {spend: {steel: 1}};
    expect(executor.canExecute(behavior, player, fake)).is.false;
    player.steel = 1;
    expect(executor.canExecute(behavior, player, fake)).is.true;
    executor.execute(behavior, player, fake);
    expect(player.steel).eq(0);
  });

  it('spend - titanium', () => {
    const behavior = {spend: {titanium: 1}};
    expect(executor.canExecute(behavior, player, fake)).is.false;
    player.titanium = 1;
    expect(executor.canExecute(behavior, player, fake)).is.true;
    executor.execute(behavior, player, fake);
    expect(player.titanium).eq(0);
  });

  it('spend - plants', () => {
    const behavior = {spend: {plants: 1}};
    expect(executor.canExecute(behavior, player, fake)).is.false;
    player.plants = 1;
    expect(executor.canExecute(behavior, player, fake)).is.true;
    executor.execute(behavior, player, fake);
    expect(player.plants).eq(0);
  });

  it('spend - energy', () => {
    const behavior = {spend: {energy: 1}};
    expect(executor.canExecute(behavior, player, fake)).is.false;
    player.energy = 1;
    expect(executor.canExecute(behavior, player, fake)).is.true;
    executor.execute(behavior, player, fake);
    expect(player.energy).eq(0);
  });

  it('spend - energy, raise TR', () => {
    const behavior: Behavior = {spend: {energy: 1}, tr: 1};
    expect(executor.canExecute(behavior, player, fake)).is.false;
    player.energy = 1;
    expect(player.terraformRating).eq(20);
    expect(executor.canExecute(behavior, player, fake)).is.true;
    executor.execute(behavior, player, fake);
    expect(player.energy).eq(0);
    expect(player.terraformRating).eq(21);
  });

  it('spend - energy, raise TR, reds in power', () => {
    const behavior: Behavior = {spend: {energy: 1}, tr: 1};
    setRulingParty(game, PartyName.REDS);
    player.energy = 1;
    player.megaCredits = 2;
    expect(executor.canExecute(behavior, player, fake)).is.false;

    player.energy = 1;
    player.megaCredits = 3;
    expect(executor.canExecute(behavior, player, fake)).is.true;
  });

  it('spend - megacredits', () => {
    const behavior = {spend: {megacredits: 1}};
    expect(executor.canExecute(behavior, player, fake)).is.false;
    player.megaCredits = 1;
    expect(executor.canExecute(behavior, player, fake)).is.true;
    executor.execute(behavior, player, fake);
    expect(player.megaCredits).eq(1);
    runAllActions(game);
    expect(player.megaCredits).eq(0);
  });

  it('spend - megacredits, steel not allowed by default', () => {
    const behavior: Behavior = {spend: {megacredits: 8}};
    player.steel = 4;
    expect(executor.canExecute(behavior, player, fake)).is.false;
  });

  it('spend - megacredits, canUseSteel', () => {
    const behavior: Behavior = {spend: {megacredits: 8, canUseSteel: true}};
    expect(executor.canExecute(behavior, player, fake)).is.false;

    player.steel = 3; // worth 6 M€, not enough alone
    expect(executor.canExecute(behavior, player, fake)).is.false;

    player.megaCredits = 2;
    expect(executor.canExecute(behavior, player, fake)).is.true;

    executor.execute(behavior, player, fake);
    runAllActions(game);
    const selectPayment = cast(player.popWaitingFor(), SelectPayment);
    selectPayment.cb(Payment.of({steel: 3, megacredits: 2}));

    expect(player.steel).eq(0);
    expect(player.megaCredits).eq(0);
  });

  it('spend - megacredits, canUseTitanium', () => {
    const behavior: Behavior = {spend: {megacredits: 6, canUseTitanium: true}};
    expect(executor.canExecute(behavior, player, fake)).is.false;

    player.titanium = 1; // worth 3 M€, not enough alone
    expect(executor.canExecute(behavior, player, fake)).is.false;

    player.megaCredits = 3;
    expect(executor.canExecute(behavior, player, fake)).is.true;

    executor.execute(behavior, player, fake);
    runAllActions(game);
    const selectPayment = cast(player.popWaitingFor(), SelectPayment);
    selectPayment.cb(Payment.of({titanium: 1, megacredits: 3}));

    expect(player.titanium).eq(0);
    expect(player.megaCredits).eq(0);
  });

  it('spend - megacredits, canUseSteel accounts for reds tax', () => {
    const behavior: Behavior = {spend: {megacredits: 8, canUseSteel: true}, ocean: {}};
    setRulingParty(game, PartyName.REDS);
    player.steel = 4;
    player.megaCredits = 0;
    expect(executor.canExecute(behavior, player, fake)).is.false;

    player.megaCredits = 3;
    expect(executor.canExecute(behavior, player, fake)).is.true;
  });

  it('spend - heat', () => {
    const behavior = {spend: {heat: 1}};
    expect(executor.canExecute(behavior, player, fake)).is.false;
    player.heat = 1;
    expect(executor.canExecute(behavior, player, fake)).is.true;
    executor.execute(behavior, player, fake);
    expect(player.heat).eq(0);
  });

  it('spend - heat, raise TR', () => {
    const behavior: Behavior = {spend: {heat: 1}, tr: 1};
    expect(executor.canExecute(behavior, player, fake)).is.false;
    player.heat = 1;
    expect(player.terraformRating).eq(20);
    expect(executor.canExecute(behavior, player, fake)).is.true;
    executor.execute(behavior, player, fake);
    expect(player.heat).eq(0);
    expect(player.terraformRating).eq(21);
  });

  it('spend - heat, raise TR, reds in power', () => {
    const behavior: Behavior = {spend: {heat: 1}, tr: 1};
    setRulingParty(game, PartyName.REDS);
    player.heat = 1;
    player.megaCredits = 2;
    expect(executor.canExecute(behavior, player, fake)).is.false;

    player.heat = 1;
    player.megaCredits = 3;
    expect(executor.canExecute(behavior, player, fake)).is.true;
  });

  it('spend - heat - Stormcraft', () => {
    const stormcraft = new StormCraftIncorporated();
    player.playedCards.push(stormcraft);
    const behavior = {spend: {heat: 3}};
    expect(executor.canExecute(behavior, player, fake)).is.false;
    stormcraft.resourceCount = 1;
    expect(executor.canExecute(behavior, player, fake)).is.false;
    stormcraft.resourceCount = 2;
    expect(executor.canExecute(behavior, player, fake)).is.true;
    executor.execute(behavior, player, fake);
    runAllActions(game);
    const andOptions = cast(player.popWaitingFor(), AndOptions);
    andOptions.options[0].cb(0); // heat
    andOptions.options[1].cb(2); // floaters
    andOptions.cb(undefined);

    expect(stormcraft.resourceCount).eq(0);
  });

  it('spend - heat - Helion, reds are in power', () => {
    const helion = new Helion();
    helion.play(player);
    player.playedCards.push(helion);
    const behavior = {spend: {heat: 3}, tr: 1};
    player.heat = 3;

    expect(player.terraformRating).eq(20);
    expect(executor.canExecute(behavior, player, fake)).is.true;

    setRulingParty(game, PartyName.REDS);

    expect(executor.canExecute(behavior, player, fake)).is.false;

    player.heat = 6;

    expect(executor.canExecute(behavior, player, fake)).is.true;

    executor.execute(behavior, player, fake);
    runAllActions(game);
    expect(player.heat).eq(3);
    const selectPayment = cast(player.popWaitingFor(), SelectPayment);
    selectPayment.cb(Payment.of({heat: 3}));
    expect(player.terraformRating).eq(21);
    expect(player.heat).eq(0);
  });

  it('spend - resource on card', () => {
    const behavior = {spend: {resourcesHere: 1}};
    expect(executor.canExecute(behavior, player, fake)).is.false;
    fake.resourceCount = 1;
    expect(executor.canExecute(behavior, player, fake)).is.true;
    executor.execute(behavior, player, fake);
    expect(fake.resourceCount).eq(0);
  });

  it('spend - resource on card - Reds in power', () => {
    const behavior = {spend: {resourcesHere: 1}, tr: 1};
    expect(executor.canExecute(behavior, player, fake)).is.false;
    fake.resourceCount = 1;
    expect(executor.canExecute(behavior, player, fake)).is.true;

    setRulingParty(game, PartyName.REDS);

    expect(executor.canExecute(behavior, player, fake)).is.false;

    player.megaCredits = 3;

    expect(executor.canExecute(behavior, player, fake)).is.true;

    executor.execute(behavior, player, fake);
    runAllActions(game);

    expect(player.megaCredits).eq(0);
    expect(player.terraformRating).eq(21);
    expect(fake.resourceCount).eq(0);
    expect(fake.resourceCount).eq(0);
  });


  it('spend - cards', () => {
    const behavior = {spend: {cards: 2}};
    player.cardsInHand.push(fake);
    expect(executor.canExecute(behavior, player, fake)).is.false;
    const microMills = new MicroMills();
    player.cardsInHand.push(microMills);
    expect(executor.canExecute(behavior, player, fake)).is.false;
    const heatTrappers = new HeatTrappers();
    player.cardsInHand.push(heatTrappers);
    expect(executor.canExecute(behavior, player, fake)).is.true;
    const birds = new Birds();
    player.cardsInHand.push(birds);

    executor.execute(behavior, player, fake);
    runAllActions(game);
    const selectCard = cast(player.popWaitingFor(), SelectCard);

    expect(selectCard.cards).has.length(3);
    expect(selectCard.config.max).eq(2);
    expect(selectCard.config.min).eq(2);

    selectCard.cb([birds, heatTrappers]);
    runAllActions(game);

    expect(player.cardsInHand).to.have.members([fake, microMills]);
    expect(game.projectDeck.discardPile).to.contain(birds);
    expect(game.projectDeck.discardPile).to.contain(heatTrappers);
  });

  it('or, canExecute', () => {
    const behavior: Behavior = {or: {behaviors: [{spend: {steel: 1}, stock: {megacredits: 1}, title: ''}]}};
    expect(executor.canExecute(behavior, player, fake)).is.false;
    player.steel = 1;
    expect(executor.canExecute(behavior, player, fake)).is.true;
  });

  it('or, canExecute, checks every sub-behavior so warnings are not lost to short-circuiting', () => {
    setOxygenLevel(game, MAX_OXYGEN_LEVEL);
    const behavior: Behavior = {or: {behaviors: [
      {stock: {megacredits: 1}, title: 'MC'},
      {global: {oxygen: 1}, title: 'Oxygen'},
    ]}};

    // The first sub-behavior alone is enough to make this executable, but the second
    // sub-behavior's warning must still be set on the card.
    expect(executor.canExecute(behavior, player, fake)).is.true;
    expect(fake.warnings).deep.eq(new Set(['maxoxygen']));
  });

  it('or, execute', () => {
    const behavior: Behavior = {or: {behaviors: [
      {stock: {megacredits: 3}, title: '3MC'},
      {stock: {megacredits: 1}, title: '1MC'},
    ]}};
    executor.execute(behavior, player, fake);
    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);
    expect(orOptions.options).has.length(2);
    expect(player.megaCredits).eq(0);
    orOptions.options[0].cb();
    expect(player.megaCredits).eq(3);
    orOptions.options[1].cb();
    expect(player.megaCredits).eq(4);
  });

  it('or, execute, not all options are playable', () => {
    const behavior: Behavior = {or: {behaviors: [
      {spend: {steel: 1}, stock: {megacredits: 3}, title: '3MC'},
      {stock: {megacredits: 1}, title: '1MC'},
    ]}};
    executor.execute(behavior, player, fake);
    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);
    expect(orOptions.options).has.length(1);
    expect(player.megaCredits).eq(0);
    orOptions.options[0].cb();
    expect(player.megaCredits).eq(1);
  });

  it('or, execute, autoselect', () => {
    const behavior: Behavior = {or: {
      autoSelect: true,
      behaviors: [
        {spend: {steel: 1}, stock: {megacredits: 3}, title: '3MC'},
        {stock: {megacredits: 1}, title: '1MC'},
      ]}};
    executor.execute(behavior, player, fake);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
    expect(player.megaCredits).eq(1);
  });

  it('or, execute, warnings apply only to the option that earned them', () => {
    setVenusScaleLevel(game, MAX_VENUS_SCALE);
    const behavior: Behavior = {or: {behaviors: [
      {global: {venus: 1}, title: 'Venus'},
      {stock: {megacredits: 1}, title: 'MC'},
    ]}};
    executor.execute(behavior, player, fake);
    runAllActions(game);

    const orOptions = cast(player.popWaitingFor(), OrOptions);
    const [venusOption, mcOption] = orOptions.options.map((option) => cast(option, SelectOption));

    expect(venusOption.warnings).deep.eq(['maxvenus']);
    expect(mcOption.warnings).is.undefined;
    // The warning was scoped to the option, not left dangling on the card.
    expect(fake.warnings.size).eq(0);
  });

  it('or, execute, does not clobber warnings the card already had', () => {
    fake.addWarning('decreaseOwnProduction');
    setVenusScaleLevel(game, MAX_VENUS_SCALE);
    const behavior: Behavior = {or: {behaviors: [
      {global: {venus: 1}, title: 'Venus'},
      {stock: {megacredits: 1}, title: 'MC'},
    ]}};
    executor.execute(behavior, player, fake);
    runAllActions(game);

    expect(fake.warnings).deep.eq(new Set(['decreaseOwnProduction']));
  });

  it('underworld, identify', () => {
    executor.execute({underworld: {identify: 1}}, player, fake);
    runAllActions(game);

    expect(game.board.spaces.filter((space) => space.undergroundResources)).has.length(0);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    selectSpace.cb(selectSpace.spaces[0]);
    expect(game.board.spaces.filter((space) => space.undergroundResources)).has.length(1);
  });

  it('underworld, identify and claim', () => {
    game.underworldData.tokens.push('nothing', 'nothing', 'nothing');
    executor.execute({underworld: {identify: {count: 3, claim: 2}}}, player, fake);
    runAllActions(game);
    expect(game.board.spaces.filter((space) => space.undergroundResources)).has.length(0);

    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    selectSpace.cb(selectSpace.spaces[0]);
    expect(game.board.spaces.filter((space) => space.undergroundResources)).has.length(1);
    runAllActions(game);

    const selectSpace2 = cast(player.popWaitingFor(), SelectSpace);
    selectSpace2.cb(selectSpace2.spaces[0]);
    expect(game.board.spaces.filter((space) => space.undergroundResources)).has.length(2);
    runAllActions(game);

    const selectSpace3 = cast(player.popWaitingFor(), SelectSpace);
    selectSpace3.cb(selectSpace3.spaces[0]);
    expect(game.board.spaces.filter((space) => space.undergroundResources)).has.length(3);
    runAllActions(game);

    const excavateSpace1 = cast(player.popWaitingFor(), SelectSpace);
    expect(excavateSpace1.spaces).deep.eq(game.board.spaces.filter((space) => space.undergroundResources));
    excavateSpace1.cb(excavateSpace1.spaces[0]);
    expect(excavateSpace1.spaces[0].excavator).is.undefined;
    runAllActions(game);

    const excavateSpace2 = cast(player.popWaitingFor(), SelectSpace);
    cast(excavateSpace2.cb(excavateSpace2.spaces[0]), undefined);
    expect(excavateSpace2.spaces[0].excavator).is.undefined;
    runAllActions(game);

    cast(player.popWaitingFor(), undefined);
  });

  it('underworld, corruption', () => {
    player.underworldData.corruption = 0;
    executor.execute({underworld: {corruption: 2}}, player, fake);
    expect(player.underworldData.corruption).eq(2);
  });

  it('underworld spend corruption', () => {
    player.underworldData.corruption = 1;
    expect(executor.canExecute({spend: {corruption: 2}}, player, fake)).is.false;

    player.underworldData.corruption = 2;
    expect(executor.canExecute({spend: {corruption: 2}}, player, fake)).is.true;

    player.underworldData.corruption = 3;
    executor.execute({spend: {corruption: 2}}, player, fake);
    expect(player.underworldData.corruption).eq(1);
  });

  it('lose stock', () => {
    player.stock.override({megacredits: 10, steel: 4});

    executor.execute({lose: {stock: {megacredits: 3, steel: 1}}}, player, fake);

    expect(player.megaCredits).eq(7);
    expect(player.steel).eq(3);
  });

  it('lose production', () => {
    player.production.override({energy: 3, steel: 1});

    executor.execute({lose: {production: {energy: 1, steel: 1}}}, player, fake);

    expect(player.production.energy).eq(2);
    expect(player.production.steel).eq(0);
  });

  it('lose takes as much as it can', () => {
    player.stock.override({megacredits: 2});
    player.production.override({steel: 0});

    // Unlike spend, this neither blocks nor overdraws.
    expect(executor.canExecute({lose: {stock: {megacredits: 8}}}, player, fake)).is.true;
    executor.execute({lose: {stock: {megacredits: 8}}}, player, fake);
    executor.execute({lose: {production: {steel: 1}}}, player, fake);

    expect(player.megaCredits).eq(0);
    expect(player.production.steel).eq(0);
  });

  it('lose production stops megacredit production at -5', () => {
    player.production.override({megacredits: -3});

    executor.execute({lose: {production: {megacredits: 4}}}, player, fake);

    expect(player.production.megacredits).eq(-5);
  });

  it('lose treats a negative count as zero', () => {
    player.stock.override({megacredits: 10});
    player.tagsForTest = {building: 2};

    // 2 building tags less 5 influence is -3, which must not become a gain.
    setRulingParty(game, PartyName.REDS);
    game.turmoil!.addInfluenceBonus(player, 5);

    executor.execute({lose: {stock: {megacredits: {tag: Tag.BUILDING, turmoil: {influence: {subtract: true}}, each: 3}}}}, player, fake);

    expect(player.megaCredits).eq(10);
  });

  it('lose logs what actually changed', () => {
    player.stock.override({megacredits: 2});
    player.production.override({energy: 0});
    game.gameLog.length = 0;

    executor.execute({lose: {stock: {megacredits: 8}}}, player, new AsteroidMining());
    executor.execute({lose: {production: {energy: 1}}}, player, new AsteroidMining());

    // 8 was asked for but only 2 was there, and the energy production line is absent
    // entirely because nothing changed.
    expect(game.gameLog.map(formatMessage)).deep.eq([
      'blue lost 2 M€ because of Asteroid Mining',
    ]);
  });

  it('global events are attributed in the log', () => {
    const globalEvent = new AsteroidMining();

    game.gameLog.length = 0;
    executor.execute({stock: {steel: 2}, production: {megacredits: 1}}, player, globalEvent);

    expect(game.gameLog.map(formatMessage)).deep.eq([
      'blue gained 1 M€ production because of Asteroid Mining',
      'blue gained 2 steel because of Asteroid Mining',
    ]);
  });

  it('cards are not attributed in the log', () => {
    game.gameLog.length = 0;
    executor.execute({stock: {steel: 2}, production: {megacredits: 1}}, player, fake);

    expect(game.gameLog.map(formatMessage)).deep.eq([
      'blue gained 1 M€ production',
      'blue gained 2 steel',
    ]);
  });

  const logRuns = [
    {log: 'Hello', expected: {message: 'Hello', formatted: 'Hello'}},
    {
      log: 'Hello, ${player}',
      expected: {message: 'Hello, ${0}', formatted: 'Hello, blue'},
    },
    {
      log: 'Hello, ${card}',
      expected: {message: 'Hello, ${1}', formatted: 'Hello, Fake Card'},
    },
    {
      log: '${player} took the ${card} action to gain 1 TR',
      expected: {
        message: '${0} took the ${1} action to gain 1 TR',
        formatted: 'blue took the Fake Card action to gain 1 TR',
      },
    },
  ];
  for (const run of logRuns) {
    it('log: ' + run.log, () => {
      executor.execute({log: run.log}, player, fake);
      const logMessage = game.gameLog.pop()!;
      expect(logMessage.message).eq(run.expected.message);
      expect(formatMessage(logMessage)).eq(run.expected.formatted);
    });
  }
});
