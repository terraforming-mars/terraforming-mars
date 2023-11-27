import {expect} from 'chai';
import {Game} from '../../src/server/Game';
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
import {cast, fakeCard, runAllActions} from '../TestingUtils';
import {SelectCard} from '../../src/server/inputs/SelectCard';
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
import {UnderworldExpansion} from '../../src/server/underworld/UnderworldExpansion';
import {SelectResources} from '../../src/server/inputs/SelectResources';
import {SelectResource} from '../../src/server/inputs/SelectResource';

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
  let game: Game;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let fake: IProjectCard;
  let executor: Executor;

  beforeEach(() => {
    [game, player, player2, player3] = testGame(3, {venusNextExtension: true, underworldExpansion: true});

    fake = fakeCard();
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
    expect(player.getTerraformRating()).eq(20);

    executor.execute({tr: 2}, player, fake);

    expect(player.getTerraformRating()).eq(22);

    executor.execute({tr: -1}, player, fake);

    expect(player.getTerraformRating()).eq(21);
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
    player.playedCards = [fakeCard({tags: [Tag.EARTH, Tag.EARTH]})];
    player.megaCredits = saturnSurfing.cost;
    player.playCard(saturnSurfing);
    runAllActions(game);

    expect(saturnSurfing.resourceCount).eq(3);
  });

  // TODO(kberg): Add test where type includes multiple resource types
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

    player.playedCards = [tardigrades, ants, regolithEathers, livestock];

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

    player.playedCards = [tardigrades, ants, regolithEathers, livestock];

    expect(livestock.resourceCount).eq(0);

    // Count microbe tags, add that many resources to livestock. What a crazy idea. :D
    executor.execute({addResourcesToAnyCard: {count: {tag: Tag.MICROBE}, type: CardResource.ANIMAL}}, player, fake);
    runAllActions(game);

    expect(livestock.resourceCount).eq(3);
  });

  it('add resources to any card - countable, zero count', () => {
    const livestock = new Livestock(); // Holds animals
    const birds = new Birds(); // Holds animals

    player.playedCards = [birds, livestock];

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

    const selectResources = cast(player.popWaitingFor(), SelectResources);
    selectResources.options[2].cb(1);
    selectResources.options[3].cb(1);
    selectResources.cb(undefined);

    expect(player.stock.asUnits()).deep.eq(Units.of({titanium: 1, plants: 1}));
  });

  it('standard resource, same', () => {
    executor.execute({standardResource: {count: 3, same: true}}, player, fake);
    runAllActions(game);

    const selectResources = cast(player.popWaitingFor(), SelectResource);
    selectResources.options[5].cb();

    expect(player.stock.asUnits()).deep.eq(Units.of({heat: 3}));
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

  it('spend - heat', () => {
    const behavior = {spend: {heat: 1}};
    expect(executor.canExecute(behavior, player, fake)).is.false;
    player.heat = 1;
    expect(executor.canExecute(behavior, player, fake)).is.true;
    executor.execute(behavior, player, fake);
    expect(player.heat).eq(0);
  });

  it('spend - heat - Stormcraft', () => {
    const stormcraft = new StormCraftIncorporated();
    player.setCorporationForTest(stormcraft);
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

  it('spend - resource on card', () => {
    const behavior = {spend: {resourcesHere: 1}};
    expect(executor.canExecute(behavior, player, fake)).is.false;
    fake.resourceCount = 1;
    expect(executor.canExecute(behavior, player, fake)).is.true;
    executor.execute(behavior, player, fake);
    expect(fake.resourceCount).eq(0);
  });

  it('or, canExecute', () => {
    const behavior: Behavior = {or: {behaviors: [{spend: {steel: 1}, stock: {megacredits: 1}, title: ''}]}};
    expect(executor.canExecute(behavior, player, fake)).is.false;
    player.steel = 1;
    expect(executor.canExecute(behavior, player, fake)).is.true;
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

  it('underworld, identify', () => {
    executor.execute({underworld: {identify: 1}}, player, fake);
    runAllActions(game);
    expect(UnderworldExpansion.identifiedSpaces(game)).has.length(0);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    selectSpace.cb(selectSpace.spaces[0]);
    expect(UnderworldExpansion.identifiedSpaces(game)).has.length(1);
  });

  it('underworld, corruption', () => {
    player.underworldData.corruption = 0;
    executor.execute({underworld: {corruption: 2}}, player, fake);
    expect(player.underworldData.corruption).eq(2);
  });

  it('underworkd spend corruption', () => {
    player.underworldData.corruption = 1;
    expect(executor.canExecute({spend: {corruption: 2}}, player, fake)).is.false;

    player.underworldData.corruption = 2;
    expect(executor.canExecute({spend: {corruption: 2}}, player, fake)).is.true;

    player.underworldData.corruption = 3;
    executor.execute({spend: {corruption: 2}}, player, fake);
    expect(player.underworldData.corruption).eq(1);
  });
});
