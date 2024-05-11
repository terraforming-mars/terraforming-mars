import {expect} from 'chai';
import {SolBank} from '../../../src/server/cards/pathfinders/SolBank';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {cast, finishGeneration, runAllActions, setOxygenLevel} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {MicroMills} from '../../../src/server/cards/base/MicroMills';
import {SelectProjectCardToPlay} from '../../../src/server/inputs/SelectProjectCardToPlay';
import {Payment} from '../../../src/common/inputs/Payment';
import {IndenturedWorkers} from '../../../src/server/cards/base/IndenturedWorkers';
import {CardName} from '../../../src/common/cards/CardName';
import {BiomassCombustors} from '../../../src/server/cards/base/BiomassCombustors';
import {AerobrakedAmmoniaAsteroid} from '../../../src/server/cards/base/AerobrakedAmmoniaAsteroid';
import {SpaceElevator} from '../../../src/server/cards/base/SpaceElevator';
import {ColonyName} from '../../../src/common/colonies/ColonyName';
import {Luna} from '../../../src/server/colonies/Luna';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {AsteroidStandardProject} from '../../../src/server/cards/base/standardProjects/AsteroidStandardProject';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {SelectColony} from '../../../src/server/inputs/SelectColony';

describe('SolBank', () => {
  let solBank: SolBank;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    [game, player] = testGame(1, {coloniesExtension: true, turmoilExtension: true});
    solBank = new SolBank();
    player.playCorporationCard(solBank);
    player.megaCredits = 100;
    game.colonies.push(new Luna());

    // Player is waiting for SelectColony. Popping it. The cast is just to ensure that if this changes, the test changes.
    cast(player.popWaitingFor(), SelectColony);
  });

  it('paying for project card', () => {
    const microMills = new MicroMills();
    player.cardsInHand = [microMills];
    const spctp = new SelectProjectCardToPlay(player);
    spctp.process({
      type: 'projectCard',
      card: CardName.MICRO_MILLS,
      payment: Payment.of({megaCredits: 3}),
    });
    runAllActions(game);

    expect(solBank.resourceCount).eq(1);
  });

  it('discounted card does not trigger', () => {
    player.playedCards = [new IndenturedWorkers()];
    player.lastCardPlayed = CardName.INDENTURED_WORKERS; // 8 MC discount
    player.cardsInHand = [new MicroMills()];
    const spctp = new SelectProjectCardToPlay(player);
    spctp.process({
      type: 'projectCard',
      card: CardName.MICRO_MILLS,
      payment: Payment.EMPTY,
    });
    runAllActions(game);

    expect(solBank.resourceCount).eq(0);
  });

  it('paying for project card with steel', () => {
    player.cardsInHand = [new BiomassCombustors()]; // Costs 4
    player.steel = 3;
    player.production.override({plants: 1}); // card requires losing 1 plant production
    setOxygenLevel(game, 6);
    const spctp = new SelectProjectCardToPlay(player);
    spctp.process({
      type: 'projectCard',
      card: CardName.BIOMASS_COMBUSTORS,
      payment: Payment.of({steel: 2}),
    });
    runAllActions(game);

    expect(solBank.resourceCount).eq(1);
  });

  it('paying for project card with titanium', () => {
    player.titanium = 10;
    player.cardsInHand = [new AerobrakedAmmoniaAsteroid()]; // Costs 26
    const spctp = new SelectProjectCardToPlay(player);
    spctp.process({
      type: 'projectCard',
      card: CardName.AEROBRAKED_AMMONIA_ASTEROID,
      payment: Payment.of({titanium: 9}),
    });
    runAllActions(game);

    expect(solBank.resourceCount).eq(1);
  });

  it('paying for research cards', () => {
    player.runResearchPhase();
    runAllActions(game);
    const selectCard = cast(player.popWaitingFor(), SelectCard);
    selectCard.cb([selectCard.cards[1], selectCard.cards[2]]);
    runAllActions(game);

    expect(player.megaCredits).eq(94);
    expect(solBank.resourceCount).eq(1);
  });

  it('paying for standard projects', () => {
    expect(game.getTemperature()).eq(-30);

    const asteroidStandardProject = new AsteroidStandardProject();
    asteroidStandardProject.action(player);
    runAllActions(game);

    expect(game.getTemperature()).eq(-28);
    expect(solBank.resourceCount).eq(1);
  });

  it('paying to trade with colonies, megacredits', () => {
    const tradeAction = player.colonies.coloniesTradeAction();
    tradeAction?.process({
      type: 'and',
      responses: [
        {
          type: 'or',
          index: cast(tradeAction.options[0], OrOptions).options.length - 1, // The last one is "trade with megacredits";
          response: {
            type: 'option',
          },
        },
        {'type': 'colony', 'colonyName': ColonyName.LUNA},
      ],
    }, player);
    runAllActions(game);

    expect(solBank.resourceCount).eq(1);
  });

  it('paying to trade with colonies, titanium', () => {
    player.megaCredits = 0;
    player.titanium = 100;

    const tradeAction = player.colonies.coloniesTradeAction();
    tradeAction?.process({
      type: 'and',
      responses: [
        {
          type: 'or',
          index: cast(tradeAction.options[0], OrOptions).options.length - 1, // The last one is "trade with titanium;
          response: {
            type: 'option',
          },
        },
        {'type': 'colony', 'colonyName': ColonyName.LUNA},
      ],
    }, player);
    runAllActions(game);

    expect(player.titanium).eq(97);
    expect(solBank.resourceCount).eq(1);
  });

  it('paying for a Turmoil delegate', () => {
    const turmoil = game.turmoil!;
    player.megaCredits = 6;
    const input = turmoil.getSendDelegateInput(player);
    input!.process({type: 'party', partyName: PartyName.REDS});
    runAllActions(game);

    expect(player.megaCredits).eq(6);
    expect(solBank.resourceCount).eq(0);

    const input2 = turmoil.getSendDelegateInput(player);
    input2!.process({type: 'party', partyName: PartyName.REDS});
    runAllActions(game);

    expect(player.megaCredits).eq(1);
    expect(solBank.resourceCount).eq(1);
  });

  it('Action that spends steel', () => {
    player.steel = 1;
    player.megaCredits = 0;
    const spaceElevator = new SpaceElevator();
    player.playedCards.push(spaceElevator);
    const selectCard = player.playActionCard();
    selectCard.process({
      type: 'card',
      cards: [CardName.SPACE_ELEVATOR],
    }, player);
    runAllActions(game);

    expect(player.steel).eq(0);
    expect(player.megaCredits).eq(5);
    expect(solBank.resourceCount).eq(1);
  });

  it('next generation', () => {
    player.megaCredits = 0;
    player.setTerraformRating(15);
    solBank.resourceCount = 5;
    finishGeneration(game);

    expect(player.megaCredits).eq(18);
    expect(solBank.resourceCount).eq(0);
  });
});
