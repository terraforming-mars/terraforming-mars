import {expect} from 'chai';
import {Game} from '../../src/server/Game';
import {Player} from '../../src/server/Player';
import {TestPlayer} from '../TestPlayer';
import {getTestPlayer, newTestGame} from '../TestGame';
import {Executor} from '../../src/server/behavior/Executor';
import {Units} from '../../src/common/Units';
import {Payment} from '../../src/common/inputs/Payment';
import {Resources} from '../../src/common/Resources';
import {CardResource} from '../../src/common/CardResource';
import {Tag} from '../../src/common/cards/Tag';
import {CardType} from '../../src/common/cards/CardType';
import {cast, fakeCard, runAllActions} from '../TestingUtils';
import {SelectCard} from '../../src/server/inputs/SelectCard';
import {SelectPlayer} from '../../src/server/inputs/SelectPlayer';
import {Tardigrades} from '../../src/server/cards/base/Tardigrades';
import {Ants} from '../../src/server/cards/base/Ants';
import {RegolithEaters} from '../../src/server/cards/base/RegolithEaters';
import {Livestock} from '../../src/server/cards/base/Livestock';
import {IProjectCard} from '../../src/server/cards/IProjectCard';
import {NitriteReducingBacteria} from '../../src/server/cards/base/NitriteReducingBacteria';
import {AerialMappers} from '../../src/server/cards/venusNext/AerialMappers';
import {Dirigibles} from '../../src/server/cards/venusNext/Dirigibles';
import {SaturnSurfing} from '../../src/server/cards/promo/SaturnSurfing';

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
  let player2: TestPlayer;
  let player3: TestPlayer;
  let fake: IProjectCard;
  let executor: Executor;

  beforeEach(() => {
    game = newTestGame(3, {venusNextExtension: true});
    player = getTestPlayer(game, 0);
    player2 = getTestPlayer(game, 1);
    player3 = getTestPlayer(game, 2);
    player.popSelectInitialCards();
    player2.popSelectInitialCards();
    player3.popSelectInitialCards();

    fake = fakeCard({});
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

    player.production.add(Resources.STEEL, 1);

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
    expect(player.cardsInHand[0].cardType).eq(CardType.EVENT);
    expect(player.cardsInHand[1].cardType).eq(CardType.EVENT);
    expect(player.cardsInHand[2].cardType).eq(CardType.EVENT);
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

    expect(player.popWaitingFor()).is.undefined;
    expect(resourceCount()).deep.eq({
      tardigrades: 0,
      ants: 0,
      regolithEathers: 0,
      livestock: 0,
    });

    // One animal card. Auto-populated.
    executor.execute({addResourcesToAnyCard: {count: 2, type: CardResource.ANIMAL}}, player, fake);
    runAllActions(game);
    expect(player.popWaitingFor()).is.undefined;

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

  it('decrease any production - cannot execute with zero targets', () => {
    expect(executor.canExecute({decreaseAnyProduction: {count: 2, type: Resources.TITANIUM}}, player, fake)).is.false;
  });

  it('decrease any production - standard', () => {
    const behavior = {decreaseAnyProduction: {count: 2, type: Resources.TITANIUM}};
    player.production.add(Resources.TITANIUM, 3);
    player2.production.add(Resources.TITANIUM, 2);
    player3.production.add(Resources.TITANIUM, 2);
    expect(executor.canExecute(behavior, player, fake)).is.true;

    executor.execute(behavior, player, fake);
    runAllActions(game);
    const selectPlayer = cast(player.popWaitingFor(), SelectPlayer);

    // Omits self.
    expect(selectPlayer.players).deep.eq([player, player2, player3]);

    selectPlayer.cb(player3);

    expect(player3.production.titanium).to.eq(0);
  });
});
