import {expect} from 'chai';
import {Odyssey} from '../../../src/server/cards/pathfinders/Odyssey';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {cast, fakeCard, runAllActions} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';
import {CardType} from '../../../src/common/cards/CardType';
import {ImportOfAdvancedGHG} from '../../../src/server/cards/base/ImportOfAdvancedGHG';
import {InventionContest} from '../../../src/server/cards/base/InventionContest';
import {SelectProjectCardToPlay} from '../../../src/server/inputs/SelectProjectCardToPlay';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {MediaGroup} from '../../../src/server/cards/base/MediaGroup';
import {IceCapMelting} from '../../../src/server/cards/base/IceCapMelting';
import {Payment} from '../../../src/common/inputs/Payment';
import {IndenturedWorkers} from '../../../src/server/cards/base/IndenturedWorkers';
import {DeimosDown} from '../../../src/server/cards/base/DeimosDown';
import {ProjectInspection} from '../../../src/server/cards/promo/ProjectInspection';
import {Viron} from '../../../src/server/cards/venusNext/Viron';
import {InventorsGuild} from '../../../src/server/cards/base/InventorsGuild';

describe('Odyssey', () => {
  let card: Odyssey;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Odyssey();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
    player.setCorporationForTest(card);
  });

  it('events count for tags', () => {
    const event = fakeCard({cardType: CardType.EVENT, tags: [Tag.JOVIAN]});
    player.playedCards.push(event);
    expect(player.tags.count(Tag.JOVIAN)).eq(1);
    player.setCorporationForTest(undefined);
    expect(player.tags.count(Tag.JOVIAN)).eq(0);
  });

  it('cannot act - cannot afford', () => {
    const expensiveEvent = fakeCard({cardType: CardType.EVENT, cost: 8});
    player.playedCards = [expensiveEvent];
    expect(card.canAct(player)).is.false;
    player.megaCredits = 7;
    expect(card.canAct(player)).is.false;
    player.megaCredits = 8;
    expect(card.canAct(player)).is.true;
  });

  it('cannot act - cannot meet requirements', () => {
    // Requires +2C temperature.
    const event = new IceCapMelting();
    player.megaCredits = event.cost;
    player.playedCards = [event];
    expect(card.canAct(player)).is.false;
    (game as any).temperature = 0;
    expect(card.canAct(player)).is.false;
    (game as any).temperature = 2;
    expect(card.canAct(player)).is.true;
  });

  it('can act', () => {
    player.megaCredits = 50;
    expect(card.canAct(player)).is.false;
    const expensiveEvent = fakeCard({cardType: CardType.EVENT, cost: 17});
    const nonEvent = fakeCard({cardType: CardType.ACTIVE, cost: 2});
    player.playedCards = [expensiveEvent, nonEvent];
    expect(card.canAct(player)).is.false;
    expensiveEvent.cost = 16;
    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    // Costs 9. Raise heat 2 steps,
    const importOfAdvancedGHG = new ImportOfAdvancedGHG();
    // Costs 2. Look at the top 3 cards from the deck. Take 1 of them into hand and discard the other two.
    const inventionContest = new InventionContest();
    player.playedCards = [importOfAdvancedGHG, inventionContest];

    let selectCard = cast(card.action(player), SelectProjectCardToPlay);

    expect(selectCard.cards).is.empty;

    player.megaCredits = 4;
    selectCard = cast(card.action(player), SelectProjectCardToPlay);
    expect(selectCard.cards).has.members([inventionContest]);

    player.megaCredits = 9;
    selectCard = cast(card.action(player), SelectProjectCardToPlay);
    expect(selectCard.cards).has.members([importOfAdvancedGHG, inventionContest]);

    expect(player.playedCards).has.members([importOfAdvancedGHG, inventionContest]);
    expect(player.production.heat).eq(0);

    selectCard.cb(importOfAdvancedGHG, {...Payment.EMPTY, megaCredits: importOfAdvancedGHG.cost});
    runAllActions(game);

    expect(player.production.heat).eq(2);
    expect(game.projectDeck.discardPile.pop()).eq(importOfAdvancedGHG);
    expect(player.playedCards).has.members([inventionContest]);
    expect(player.megaCredits).eq(0);
  });

  it('action triggers related effects', () => {
    const importOfAdvancedGHG = new ImportOfAdvancedGHG();
    const mediaGroup = new MediaGroup();
    player.megaCredits = 50;

    player.playedCards = [importOfAdvancedGHG, mediaGroup];
    const selectCard = cast(card.action(player), SelectProjectCardToPlay);

    expect(player.production.heat).eq(0);
    expect(player.megaCredits).eq(50);

    selectCard.cb(importOfAdvancedGHG, {...Payment.EMPTY, megaCredits: 9});
    runAllActions(game);

    expect(player.production.heat).eq(2);
    expect(player.megaCredits).eq(44); // 50 - 9 + 3 = 44
    expect(game.projectDeck.discardPile.pop()).eq(importOfAdvancedGHG);
    expect(player.playedCards).has.members([mediaGroup]);
  });

  it('Acts correctly for event cards that give one time discount', () => {
    const indenturedWorkers = new IndenturedWorkers();
    player.playedCards.push(indenturedWorkers);

    const selectCard = cast(card.action(player), SelectProjectCardToPlay);
    expect(selectCard.cards).includes(indenturedWorkers);
    selectCard.cb(indenturedWorkers, Payment.of({})); // Indentured workers costs 0.
    runAllActions(game);
    const deimosDown = new DeimosDown();

    expect(player.getCardCost(deimosDown)).to.eq(deimosDown.cost - 8);

    player.playCard(deimosDown);

    expect(player.getCardCost(deimosDown)).to.eq(deimosDown.cost); // no more discount
  });

  // This is a weird one.
  // Odyssey lets you replay an event card.
  // Project Inspection is an event that lets you replay a blue action.
  // Assume Viron and Inventors Guild are used blue actions. (Inventors guild lets you draw a card. Viron lets you replay a blue action.)
  //
  // Play Odyssey, which lets player replay Project Inspection.
  //   Project Inspection looks for blue action cards to play.
  //   Project Inspection sees Viron.
  //     Project Inspection evaluates whether Viron has an action to take.
  //       Viron looks for blue card actions to play.
  //       Viron sees Odyssey
  //         Viron evaluates whether Odyssey can be played.
  //
  // ... and so on.
  it('Be compatible with Viron and Project Inspection', () => {
    const viron = new Viron();
    player.playAdditionalCorporationCard(viron);

    const projectInspection = new ProjectInspection();
    player.playedCards.push(projectInspection);
    player.addActionThisGeneration(viron.name);

    // Need another action that Project Inspection can play. This creates the conditions
    // which caused a recursive call stack problem.
    const inventorsGuild = new InventorsGuild();
    player.playedCards.push(inventorsGuild);
    player.addActionThisGeneration(inventorsGuild.name);

    const selectProjectCardToPlay = cast(card.action(player), SelectProjectCardToPlay);
    player.addActionThisGeneration(card.name); // This is played after `action` as it matches code behavior.
    expect(selectProjectCardToPlay.cards.map((c) => c.name)).deep.eq([projectInspection.name]);

    const playAction = selectProjectCardToPlay.cb(projectInspection, Payment.EMPTY);
    expect(playAction).is.undefined;
    runAllActions(game);
    const selectAction = cast(player.popWaitingFor(), SelectCard);
    // It might be a bug that odyssey is replayable, but that's what you get when you bend the rules.
    expect(selectAction.cards.map((c) => c.name)).deep.eq([card.name, inventorsGuild.name]);
  });
});
