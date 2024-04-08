import {expect} from 'chai';
import {TestPlayer} from '../TestPlayer';
import {testGame} from '../TestGame';
import {UnderworldExpansion} from '../../src/server/underworld/UnderworldExpansion';
import {Game} from '../../src/server/Game';
import {UnderworldData} from '../../src/server/underworld/UnderworldData';
import {cast, fakeCard, forceGenerationEnd, formatMessage, runAllActions} from '../TestingUtils';
import {Units} from '../../src/common/Units';
import {Cryptocurrency} from '../../src/server/cards/pathfinders/Cryptocurrency';
import {MartianCulture} from '../../src/server/cards/pathfinders/MartianCulture';
import {GHGProducingBacteria} from '../../src/server/cards/base/GHGProducingBacteria';
import {RegolithEaters} from '../../src/server/cards/base/RegolithEaters';
import {SelectCard} from '../../src/server/inputs/SelectCard';
import {TileType} from '../../src/common/TileType';
import {IProjectCard} from '../../src/server/cards/IProjectCard';
import {Phase} from '../../src/common/Phase';
import {LawSuit} from '../../src/server/cards/promo/LawSuit';
import {PlayerInput} from '../../src/server/PlayerInput';
import {OrOptions} from '../../src/server/inputs/OrOptions';
import {PrivateMilitaryContractor} from '../../src/server/cards/underworld/PrivateMilitaryContractor';

describe('UnderworldExpansion', function() {
  let player1: TestPlayer;
  let player2: TestPlayer;
  let game: Game;
  let underworldData: UnderworldData;
  let dataCard1: IProjectCard;
  let dataCard2: IProjectCard;
  let microbeCard1: IProjectCard;
  let microbeCard2: IProjectCard;

  beforeEach(() => {
    [game, player1, player2] = testGame(2, {underworldExpansion: true});
    underworldData = game.underworldData;
    dataCard1 = new Cryptocurrency();
    dataCard2 = new MartianCulture();
    microbeCard1 = new GHGProducingBacteria();
    microbeCard2 = new RegolithEaters();
    player1.playedCards = [dataCard1, dataCard2, microbeCard1, microbeCard2];
    game.phase = Phase.ACTION;
  });

  it('sanity', () => {
    expect(underworldData).is.not.undefined;
  });

  it('Game without expansions has no tokens', () => {
    const [game, player] = testGame(1);
    expect(game.underworldData.tokens).is.empty;
    expect(player.underworldData).is.not.undefined;
  });

  it('sanity', () => {
    expect(underworldData.tokens).has.length(89);
  });

  it('identify', () => {
    const space = game.board.getAvailableSpacesOnLand(player1)[0];

    expect(space.undergroundResources).is.undefined;
    expect(underworldData.tokens).has.length(89);

    UnderworldExpansion.identify(game, space, player1);

    expect(space.undergroundResources).is.not.undefined;
    expect(underworldData.tokens).has.length(88);
    expect(space.excavator).is.undefined;
  });

  it('identify calls card callbacks', () => {
    const responses: Array<string> = [];
    const space = game.board.getAvailableSpacesOnLand(player1)[0];
    const fake = fakeCard({
      onIdentification(identifyingPlayer, cardOwner, space) {
        responses.push(`${identifyingPlayer?.id} - ${cardOwner.id} - ${space.id}`);
      },
    });
    player1.playedCards.push(fake);
    player2.playedCards.push(fake);

    UnderworldExpansion.identify(game, space, player1);

    expect(responses).deep.eq([
      'p-player1-id - p-player1-id - 03',
      'p-player1-id - p-player2-id - 03',
    ]);
  });

  it('serializing and deserializing board spaces', () => {
    const spaces = game.board.getAvailableSpacesOnLand(player1);
    spaces[0].undergroundResources = 'data3';
    spaces[1].undergroundResources = 'corruption2';
    spaces[2].undergroundResources = 'ocean';
    spaces[0].excavator = player1;
    spaces[1].excavator = player2;

    const spaceIds = spaces.map((s) => s.id);
    const serialized = game.serialize();
    const serializedSpaces = serialized.board.spaces.filter((space) => spaceIds.includes(space.id));

    expect(serializedSpaces[0].undergroundResources).eq('data3');
    expect(serializedSpaces[1].undergroundResources).eq('corruption2');
    expect(serializedSpaces[2].undergroundResources).eq('ocean');
    expect(serializedSpaces[3]).does.not.haveOwnPropertyDescriptor('undergroundResources');
    expect(serializedSpaces[0].excavator).eq('p-player1-id');
    expect(serializedSpaces[1].excavator).eq('p-player2-id');
    expect(serializedSpaces[2]).does.not.haveOwnPropertyDescriptor('excavator');
    expect(serializedSpaces[3]).does.not.haveOwnPropertyDescriptor('excavator');

    const game2 = Game.deserialize(serialized);
    const deserializedSpaces = game2.board.spaces.filter((space) => spaceIds.includes(space.id));
    expect(deserializedSpaces[0].undergroundResources).eq('data3');
    expect(deserializedSpaces[1].undergroundResources).eq('corruption2');
    expect(deserializedSpaces[2].undergroundResources).eq('ocean');
    expect(deserializedSpaces[3]).does.not.haveOwnPropertyDescriptor('undergroundResources');
    expect(deserializedSpaces[0].excavator?.id).eq('p-player1-id');
    expect(deserializedSpaces[1].excavator?.id).eq('p-player2-id');
    expect(deserializedSpaces[2]).does.not.haveOwnPropertyDescriptor('excavator');
    expect(deserializedSpaces[3]).does.not.haveOwnPropertyDescriptor('excavator');
  });

  it('identifiable, identified', () => {
    const space = game.board.getAvailableSpacesOnLand(player1)[0];

    expect(UnderworldExpansion.identifiableSpaces(player1)).includes(space);
    expect(UnderworldExpansion.identifiedSpaces(game)).does.not.include(space);

    UnderworldExpansion.identify(game, space, player1);

    expect(UnderworldExpansion.identifiableSpaces(player1)).does.not.include(space);
    expect(UnderworldExpansion.identifiedSpaces(game)).includes(space);
  });

  it('gainCorruption', () => {
    expect(player1.underworldData.corruption).eq(0);
    UnderworldExpansion.gainCorruption(player1, 2);
    expect(player1.underworldData.corruption).eq(2);
  });

  it('loseCorruption', () => {
    player1.underworldData.corruption = 3;
    UnderworldExpansion.loseCorruption(player1, 2);
    expect(player1.underworldData.corruption).eq(1);
  });

  it('grant bonus - card1', () => {
    expect(player1.cardsInHand).has.length(0);
    UnderworldExpansion.grant(player1, 'card1');
    expect(player1.cardsInHand).has.length(1);
  });

  it('grant bonus - card2', () => {
    expect(player1.cardsInHand).has.length(0);
    UnderworldExpansion.grant(player1, 'card2');
    expect(player1.cardsInHand).has.length(2);
  });

  it('grant bonus - corruption1', () => {
    expect(player1.underworldData.corruption).eq(0);
    UnderworldExpansion.grant(player1, 'corruption1');
    expect(player1.underworldData.corruption).eq(1);
  });

  it('grant bonus - corruption2', () => {
    expect(player1.underworldData.corruption).eq(0);
    UnderworldExpansion.grant(player1, 'corruption2');
    expect(player1.underworldData.corruption).eq(2);
  });

  it('grant bonus - data1', () => {
    expect(player1.getCardsWithResources()).is.empty;

    UnderworldExpansion.grant(player1, 'data1');
    runAllActions(game);
    const selectCard = cast(player1.popWaitingFor(), SelectCard);
    selectCard.cb([dataCard2]);

    expect(player1.getCardsWithResources()).deep.eq([dataCard2]);
    expect(dataCard2.resourceCount).eq(1);
  });

  it('grant bonus - data2', () => {
    expect(player1.getCardsWithResources()).is.empty;

    UnderworldExpansion.grant(player1, 'data2');
    runAllActions(game);
    const selectCard = cast(player1.popWaitingFor(), SelectCard);
    selectCard.cb([dataCard2]);

    expect(player1.getCardsWithResources()).deep.eq([dataCard2]);
    expect(dataCard2.resourceCount).eq(2);
  });

  it('grant bonus - data3', () => {
    expect(player1.getCardsWithResources()).is.empty;

    UnderworldExpansion.grant(player1, 'data3');
    runAllActions(game);
    const selectCard = cast(player1.popWaitingFor(), SelectCard);
    selectCard.cb([dataCard2]);

    expect(player1.getCardsWithResources()).deep.eq([dataCard2]);
    expect(dataCard2.resourceCount).eq(3);
  });

  it('grant bonus - steel2', () => {
    expect(player1.stock.asUnits()).deep.eq(Units.of({}));
    UnderworldExpansion.grant(player1, 'steel2');
    expect(player1.stock.asUnits()).deep.eq(Units.of({steel: 2}));
  });

  it('grant bonus - steel1production', () => {
    expect(player1.stock.asUnits()).deep.eq(Units.of({}));
    UnderworldExpansion.grant(player1, 'steel1production');
    expect(player1.production.asUnits()).deep.eq(Units.of({steel: 1}));
  });

  it('grant bonus - titanium2', () => {
    expect(player1.stock.asUnits()).deep.eq(Units.of({}));
    UnderworldExpansion.grant(player1, 'titanium2');
    expect(player1.stock.asUnits()).deep.eq(Units.of({titanium: 2}));
  });

  it('grant bonus - titanium1production', () => {
    expect(player1.production.titanium).eq(0);
    UnderworldExpansion.grant(player1, 'titanium1production');
    expect(player1.production.asUnits()).deep.eq(Units.of({titanium: 1}));
  });

  it('grant bonus - plant1', () => {
    expect(player1.stock.asUnits()).deep.eq(Units.of({}));
    UnderworldExpansion.grant(player1, 'plant1');
    expect(player1.stock.asUnits()).deep.eq(Units.of({plants: 1}));
  });

  it('grant bonus - plant2', () => {
    expect(player1.stock.asUnits()).deep.eq(Units.of({}));
    UnderworldExpansion.grant(player1, 'plant2');
    expect(player1.stock.asUnits()).deep.eq(Units.of({plants: 2}));
  });

  it('grant bonus - plant3', () => {
    expect(player1.stock.asUnits()).deep.eq(Units.of({}));
    UnderworldExpansion.grant(player1, 'plant3');
    expect(player1.stock.asUnits()).deep.eq(Units.of({plants: 3}));
  });

  it('grant bonus - plant1production', () => {
    expect(player1.production.plants).eq(0);
    UnderworldExpansion.grant(player1, 'plant1production');
    expect(player1.production.asUnits()).deep.eq(Units.of({plants: 1}));
  });

  it('grant bonus - titaniumandplant', () => {
    expect(player1.stock.asUnits()).deep.eq(Units.of({}));
    UnderworldExpansion.grant(player1, 'titaniumandplant');
    expect(player1.stock.asUnits()).deep.eq(Units.of({titanium: 1, plants: 1}));
  });

  it('grant bonus - energy1production', () => {
    expect(player1.production.energy).eq(0);
    UnderworldExpansion.grant(player1, 'energy1production');
    expect(player1.production.asUnits()).deep.eq(Units.of({energy: 1}));
  });

  it('grant bonus - heat2production', () => {
    expect(player1.production.asUnits()).deep.eq(Units.of({}));
    UnderworldExpansion.grant(player1, 'heat2production');
    expect(player1.production.asUnits()).deep.eq(Units.of({heat: 2}));
  });

  it('grant bonus - microbe1', () => {
    expect(player1.getCardsWithResources()).is.empty;

    UnderworldExpansion.grant(player1, 'microbe1');
    runAllActions(game);
    const selectCard = cast(player1.popWaitingFor(), SelectCard);
    selectCard.cb([microbeCard1]);

    expect(player1.getCardsWithResources()).deep.eq([microbeCard1]);
    expect(microbeCard1.resourceCount).eq(1);
  });

  it('grant bonus - microbe2', () => {
    expect(player1.getCardsWithResources()).is.empty;

    UnderworldExpansion.grant(player1, 'microbe2');
    runAllActions(game);
    const selectCard = cast(player1.popWaitingFor(), SelectCard);
    selectCard.cb([microbeCard1]);

    expect(player1.getCardsWithResources()).deep.eq([microbeCard1]);
    expect(microbeCard1.resourceCount).eq(2);
  });

  it('grant bonus - tr', () => {
    expect(player1.getTerraformRating()).eq(20);
    UnderworldExpansion.grant(player1, 'tr');
    expect(player1.getTerraformRating()).eq(21);
  });

  // it('grant bonus - ocean', () => {
  //   UnderworldExpansion.grant(player1, 'ocean');
  // });

  // it('grant bonus - ocean -- cannot afford', () => {
  //   UnderworldExpansion.grant(player1, 'ocean');
  // });

  // it('grant bonus - ocean -- cannot afford, Reds', () => {
  //   UnderworldExpansion.grant(player1, 'ocean');
  // });

  it('grant bonus - data1pertemp', () => {
    expect(player1.underworldData.temperatureBonus).is.undefined;
    UnderworldExpansion.grant(player1, 'data1pertemp');
    expect(player1.underworldData.temperatureBonus).eq('data1pertemp');
  });

  it('grant bonus - microbe1pertemp', () => {
    expect(player1.underworldData.temperatureBonus).is.undefined;
    UnderworldExpansion.grant(player1, 'microbe1pertemp');
    expect(player1.underworldData.temperatureBonus).eq('microbe1pertemp');
  });

  it('grant bonus - plant2pertemp', () => {
    expect(player1.underworldData.temperatureBonus).is.undefined;
    UnderworldExpansion.grant(player1, 'plant2pertemp');
    expect(player1.underworldData.temperatureBonus).eq('plant2pertemp');
  });

  it('grant bonus - steel2pertemp', () => {
    expect(player1.underworldData.temperatureBonus).is.undefined;
    UnderworldExpansion.grant(player1, 'steel2pertemp');
    expect(player1.underworldData.temperatureBonus).eq('steel2pertemp');
  });

  it('grant bonus - titanium1pertemp', () => {
    expect(player1.underworldData.temperatureBonus).is.undefined;
    UnderworldExpansion.grant(player1, 'titanium1pertemp');
    expect(player1.underworldData.temperatureBonus).eq('titanium1pertemp');
  });

  it('excavatableSpaces', () => {
    const space = game.board.getAvailableSpacesOnLand(player1)[0];
    const adjacentSpaces = game.board.getAdjacentSpaces(space);
    expect(UnderworldExpansion.excavatableSpaces(player1)).includes(space);
    expect(adjacentSpaces).has.length(3);

    space.undergroundResources = 'nothing';

    expect(UnderworldExpansion.excavatableSpaces(player1)).includes(space);

    space.excavator = player1;
    expect(UnderworldExpansion.excavatableSpaces(player1)).does.not.include(space);
    // The only excavatable space now is the one next to the excavation space.
    expect(UnderworldExpansion.excavatableSpaces(player1)).has.members(adjacentSpaces);

    // Reset for tile tests.
    space.excavator = undefined;
    space.tile = {tileType: TileType.GREENERY};
    space.player = player1;
    expect(UnderworldExpansion.excavatableSpaces(player1)).has.members([space]);
    expect(UnderworldExpansion.excavatableSpaces(player2)).includes(space);
    space.tile = {tileType: TileType.CITY};
    expect(UnderworldExpansion.excavatableSpaces(player2)).does.not.include(space);
  });

  it('excavatableSpaces - cannot afford ocean bonus', () => {
    const space = UnderworldExpansion.identifiableSpaces(player1)[0];
    space.undergroundResources = 'ocean';
    player1.megaCredits = 3;

    expect(UnderworldExpansion.excavatableSpaces(player1)).does.not.contain(space);

    player1.megaCredits = 4;

    expect(UnderworldExpansion.excavatableSpaces(player1)).contains(space);
  });

  // TODO(kberg): Test excavatablespaces override

  it('excavate', () => {
    player1.plants = 0;
    const space = game.board.getAvailableSpacesOnLand(player1)[0];
    const adjacentSpaces = game.board.getAdjacentSpaces(space);
    space.undergroundResources = 'plant2';

    const identifiedSpacesBefore = UnderworldExpansion.identifiedSpaces(game);
    expect(adjacentSpaces.map((space) => identifiedSpacesBefore.includes(space))).deep.eq([false, false, false]);

    UnderworldExpansion.excavate(player1, space);

    expect(player1.plants).eq(2);
    expect(space.excavator?.id).eq(player1.id);
    const identifiedSpacesAfter = UnderworldExpansion.identifiedSpaces(game);
    expect(adjacentSpaces.map((space) => identifiedSpacesAfter.includes(space))).deep.eq([true, true, true]);
  });

  it('onExcavation callback', () => {
    const responses: Array<string> = [];
    const space = game.board.getAvailableSpacesOnLand(player1)[0];
    space.undergroundResources = 'nothing';

    player1.playedCards.push(fakeCard({
      onExcavation(player, space) {
        responses.push(`from player1: ${player.id} - ${space.id}`);
      },
    }));
    player2.playedCards.push(fakeCard({
      onExcavation(player, space) {
        responses.push(`from player2: ${player.id} - ${space.id}`);
      },
    }));

    UnderworldExpansion.excavate(player1, space);

    expect(responses).deep.eq([
      'from player1: p-player1-id - 03',
    ]);
  });

  it('on temperature change - data1pertemp', () => {
    player1.underworldData.temperatureBonus = 'data1pertemp';

    expect(player1.getCardsWithResources()).is.empty;

    game.increaseTemperature(player2, 2);
    runAllActions(game);
    const selectCard1 = cast(player1.popWaitingFor(), SelectCard);
    selectCard1.cb([dataCard1]);

    expect(player1.getCardsWithResources()).deep.eq([dataCard1]);
    expect(dataCard1.resourceCount).eq(1);

    runAllActions(game);

    const selectCard2 = cast(player1.popWaitingFor(), SelectCard);
    selectCard2.cb([dataCard2]);
    expect(player1.getCardsWithResources()).deep.eq([dataCard1, dataCard2]);
    expect(dataCard2.resourceCount).eq(1);

    runAllActions(game);
    expect(player1.popWaitingFor()).is.undefined;
  });

  it('on temperature change - microbe1pertemp', () => {
    player1.underworldData.temperatureBonus = 'microbe1pertemp';

    expect(player1.getCardsWithResources()).is.empty;

    game.increaseTemperature(player2, 2);
    runAllActions(game);
    const selectCard1 = cast(player1.popWaitingFor(), SelectCard);
    selectCard1.cb([microbeCard1]);

    expect(player1.getCardsWithResources()).deep.eq([microbeCard1]);
    expect(microbeCard1.resourceCount).eq(1);

    runAllActions(game);

    const selectCard2 = cast(player1.popWaitingFor(), SelectCard);
    selectCard2.cb([microbeCard2]);
    expect(player1.getCardsWithResources()).deep.eq([microbeCard1, microbeCard2]);
    expect(microbeCard2.resourceCount).eq(1);

    runAllActions(game);
    expect(player1.popWaitingFor()).is.undefined;
  });

  it('on temperature change - plant2pertemp', () => {
    player1.underworldData.temperatureBonus = 'plant2pertemp';
    game.increaseTemperature(player2, 2);
    expect(player1.stock.plants).eq(4);
  });

  it('on temperature change - steel2pertemp', () => {
    player1.underworldData.temperatureBonus = 'steel2pertemp';
    game.increaseTemperature(player2, 2);
    expect(player1.stock.steel).eq(4);
  });

  it('on temperature change - titanium1pertemp', () => {
    player1.underworldData.temperatureBonus = 'titanium1pertemp';
    game.increaseTemperature(player2, 2);
    expect(player1.stock.titanium).eq(2);
  });

  it('temperature bonus does not apply to Solar Phase', () => {
    player1.underworldData.temperatureBonus = 'titanium1pertemp';
    game.phase = Phase.SOLAR;
    game.increaseTemperature(player2, 2);
    expect(player1.stock.titanium).eq(0);
  });

  it('temperature bonus does not apply next generation', () => {
    player1.underworldData.temperatureBonus = 'steel2pertemp';
    game.increaseTemperature(player2, 2);
    expect(player1.stock.steel).eq(4);
    player1.stock.steel = 0;

    forceGenerationEnd(game);

    expect(player1.underworldData.temperatureBonus).is.undefined;
    game.increaseTemperature(player2, 1);
    expect(player1.stock.steel).eq(0);
  });

  it('corruption eliminates negative victory points', () => {
    expect(player1.getVictoryPoints().total).eq(20);

    player1.playedCards.push(new LawSuit());

    expect(player1.getVictoryPoints().total).eq(19);

    player1.underworldData.corruption = 1;

    expect(player1.getVictoryPoints().total).eq(20);

    player1.underworldData.corruption = 2;

    expect(player1.getVictoryPoints().total).eq(20);
  });

  class MaybeBlockAttackTester {
    // The target of the attack. If you want a different target, change this before calling run.
    public target = player1;
    // The perpetrator of the attack. If you want a different perpetrator, change this before calling run.
    public perpetrator = player2;

    // Will be true if the callback is invoked.
    public called: boolean = false;
    // True if the caller did not block.
    public proceed: boolean = false;
    // And player input the target must immediately resolve.
    public playerInput: PlayerInput | undefined = undefined;

    public run() {
      this.playerInput = UnderworldExpansion.maybeBlockAttack(this.target, this.perpetrator, (proceed) => {
        this.proceed = proceed;
        this.called = true;
        return undefined;
      });
    }
  }

  it('maybeBlockAttack - disabled', () => {
    [game, player1, player2] = testGame(2, {underworldExpansion: false});
    const tester = new MaybeBlockAttackTester();

    tester.run();

    expect(tester.called).is.true;
    expect(tester.proceed).is.true;
    expect(tester.playerInput).is.undefined;
  });

  it('maybeBlockAttack - cannot afford', () => {
    player1.underworldData.corruption = 0;
    const tester = new MaybeBlockAttackTester();

    tester.run();

    expect(tester.called).is.true;
    expect(tester.proceed).is.true;
    expect(tester.playerInput).is.undefined;
  });

  it('maybeBlockAttack - do not block', () => {
    player1.underworldData.corruption = 1;
    const tester = new MaybeBlockAttackTester();

    tester.run();

    expect(tester.called).is.false;

    const orOptions = cast(tester.playerInput, OrOptions);
    orOptions.options[1].cb();

    expect(tester.called).is.true;
    expect(tester.proceed).is.true;
    expect(player1.underworldData.corruption).eq(1);
  });

  it('maybeBlockAttack - block', () => {
    player1.underworldData.corruption = 1;
    const tester = new MaybeBlockAttackTester();

    tester.run();

    expect(tester.called).is.false;

    const orOptions = cast(tester.playerInput, OrOptions);
    orOptions.options[0].cb();

    expect(tester.called).is.true;
    expect(tester.proceed).is.false;
    expect(player1.underworldData.corruption).eq(0);
  });

  it('maybeBlockAttack - block self', () => {
    player1.underworldData.corruption = 1;
    const tester = new MaybeBlockAttackTester();
    tester.perpetrator = player1;
    tester.target = player1;

    tester.run();

    expect(tester.called).is.false;

    const orOptions = cast(tester.playerInput, OrOptions);
    orOptions.options[0].cb();

    expect(tester.called).is.true;
    expect(tester.proceed).is.false;
    expect(player1.underworldData.corruption).eq(0);
  });

  it('maybeBlockAttack - privateMilitaryContractor - no resources', () => {
    const privateMilitaryContractor = new PrivateMilitaryContractor();
    player1.playedCards.push(privateMilitaryContractor);
    const tester = new MaybeBlockAttackTester();
    privateMilitaryContractor.resourceCount = 0;

    tester.run();

    expect(tester.called).is.true;
    expect(tester.proceed).is.true;
  });

  it('maybeBlockAttack - privateMilitaryContractor - resources', () => {
    const privateMilitaryContractor = new PrivateMilitaryContractor();
    player1.playedCards.push(privateMilitaryContractor);
    const tester = new MaybeBlockAttackTester();
    privateMilitaryContractor.resourceCount = 2;

    tester.run();

    expect(tester.called).is.false;

    const orOptions = cast(tester.playerInput, OrOptions);

    expect(orOptions.options.length).eq(2);
    orOptions.options[0].cb();

    expect(tester.called).is.true;
    expect(tester.proceed).is.false;
    expect(player1.underworldData.corruption).eq(0);
    expect(privateMilitaryContractor.resourceCount).eq(1);
  });

  it('maybeBlockAttack - privateMilitaryContractor - resources and corruption', () => {
    const privateMilitaryContractor = new PrivateMilitaryContractor();
    player1.playedCards.push(privateMilitaryContractor);
    const tester = new MaybeBlockAttackTester();
    privateMilitaryContractor.resourceCount = 2;
    player1.underworldData.corruption = 2;

    tester.run();

    expect(tester.called).is.false;

    const orOptions = cast(tester.playerInput, OrOptions);

    expect(orOptions.options.length).eq(3);
    expect(formatMessage(orOptions.options[0].title)).matches(/Private Military Contractor/);
    orOptions.options[0].cb();

    expect(tester.called).is.true;
    expect(tester.proceed).is.false;
    expect(player1.underworldData.corruption).eq(2);
    expect(privateMilitaryContractor.resourceCount).eq(1);
  });

  it('removeAllUnclaimedTokens', () => {
    const board = game.board;
    const space = board.getSpaceOrThrow('30');
    const space2 = board.getSpaceOrThrow('31');
    const space3 = board.getSpaceOrThrow('32');

    space.undergroundResources = 'card1';

    space2.excavator = player1;
    space2.undergroundResources = 'card2';

    space3.undergroundResources = 'corruption1',
    game.underworldData.tokens = [];

    expect(UnderworldExpansion.identifiedSpaces(game)).to.have.members([space, space2, space3]);

    UnderworldExpansion.removeAllUnclaimedTokens(game);

    expect(UnderworldExpansion.identifiedSpaces(game)).to.have.members([space2]);
    expect(space2.excavator).eq(player1);
    expect(space2.undergroundResources).eq('card2');
    expect(game.underworldData.tokens).to.have.members(['card1', 'corruption1']);
  });

  it('removeUnclaimedToken', () => {
    const board = game.board;
    const space = board.getSpaceOrThrow('30');
    const space2 = board.getSpaceOrThrow('31');
    const space3 = board.getSpaceOrThrow('32');

    space.undergroundResources = 'card1';

    space2.excavator = player1;
    space2.undergroundResources = 'card2';

    space3.undergroundResources = 'corruption1',
    game.underworldData.tokens = [];

    expect(UnderworldExpansion.identifiedSpaces(game)).to.have.members([space, space2, space3]);

    UnderworldExpansion.removeUnclaimedToken(game, space);

    expect(UnderworldExpansion.identifiedSpaces(game)).to.have.members([space2, space3]);
    expect(space2.excavator).eq(player1);
    expect(space2.undergroundResources).eq('card2');
    expect(game.underworldData.tokens).to.have.members(['card1']);
  });
});
