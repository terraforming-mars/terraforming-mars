import {expect} from 'chai';
import {Odyssey} from '../../../src/server/cards/pathfinders/Odyssey';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {cast, fakeCard, runAllActions, setTemperature} from '../../TestingUtils';
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
import {AdvancedEcosystems} from '../../../src/server/cards/base/AdvancedEcosystems';
import {SolarWindPower} from '../../../src/server/cards/base/SolarWindPower';
import {ThoriumRush} from '../../../src/server/cards/moon/ThoriumRush';
import {Diversity} from '../../../src/server/turmoil/globalEvents/Diversity';
import {Kelvinists} from '../../../src/server/turmoil/parties/Kelvinists';
import {Anthozoa} from '../../../src/server/cards/pathfinders/Anthozoa';
import {ControlledBloom} from '../../../src/server/cards/pathfinders/ControlledBloom';
import {Ecologist} from '../../../src/server/milestones/Ecologist';


describe('Odyssey', () => {
  let odyssey: Odyssey;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    odyssey = new Odyssey();
    [game, player] = testGame(1);
    player.corporations.push(odyssey);
  });

  it('events count for tags', () => {
    const event = fakeCard({type: CardType.EVENT, tags: [Tag.JOVIAN]});
    player.playedCards.push(event);
    expect(player.tags.count(Tag.JOVIAN)).eq(1);
    player.corporations = [];
    expect(player.tags.count(Tag.JOVIAN)).eq(0);
  });

  it('cannot act - cannot afford', () => {
    const expensiveEvent = fakeCard({type: CardType.EVENT, cost: 8});
    player.playedCards = [expensiveEvent];
    expect(odyssey.canAct(player)).is.false;
    player.megaCredits = 7;
    expect(odyssey.canAct(player)).is.false;
    player.megaCredits = 8;
    expect(odyssey.canAct(player)).is.true;
  });

  it('cannot act - cannot meet requirements', () => {
    // Requires +2C temperature.
    const event = new IceCapMelting();
    player.megaCredits = event.cost;
    player.playedCards = [event];
    expect(odyssey.canAct(player)).is.false;
    setTemperature(game, 0);
    expect(odyssey.canAct(player)).is.false;
    setTemperature(game, 2);
    expect(odyssey.canAct(player)).is.true;
  });

  it('can act', () => {
    player.megaCredits = 50;
    expect(odyssey.canAct(player)).is.false;
    const expensiveEvent = fakeCard({type: CardType.EVENT, cost: 17});
    const nonEvent = fakeCard({type: CardType.ACTIVE, cost: 2});
    player.playedCards = [expensiveEvent, nonEvent];
    expect(odyssey.canAct(player)).is.false;
    expensiveEvent.cost = 16;
    expect(odyssey.canAct(player)).is.true;
  });

  it('action', () => {
    // Costs 9. Raise heat 2 steps,
    const importOfAdvancedGHG = new ImportOfAdvancedGHG();
    // Costs 2. Look at the top 3 cards from the deck. Take 1 of them into hand and discard the other two.
    const inventionContest = new InventionContest();
    player.playedCards = [importOfAdvancedGHG, inventionContest];

    let selectProjectCardToPlay = cast(odyssey.action(player), SelectProjectCardToPlay);

    expect(selectProjectCardToPlay.cards).is.empty;

    player.megaCredits = 4;
    selectProjectCardToPlay = cast(odyssey.action(player), SelectProjectCardToPlay);
    expect(selectProjectCardToPlay.cards).has.members([inventionContest]);

    player.megaCredits = 9;
    selectProjectCardToPlay = cast(odyssey.action(player), SelectProjectCardToPlay);
    expect(selectProjectCardToPlay.cards).has.members([importOfAdvancedGHG, inventionContest]);

    expect(player.playedCards).has.members([importOfAdvancedGHG, inventionContest]);
    expect(player.production.heat).eq(0);

    selectProjectCardToPlay.payAndPlay(importOfAdvancedGHG, {...Payment.EMPTY, megaCredits: importOfAdvancedGHG.cost});
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
    const selectProjectCardToPlay = cast(odyssey.action(player), SelectProjectCardToPlay);

    expect(player.production.heat).eq(0);
    expect(player.megaCredits).eq(50);

    selectProjectCardToPlay.payAndPlay(importOfAdvancedGHG, {...Payment.EMPTY, megaCredits: 9});
    runAllActions(game);

    expect(player.production.heat).eq(2);
    expect(player.megaCredits).eq(44); // 50 - 9 + 3 = 44
    expect(game.projectDeck.discardPile.pop()).eq(importOfAdvancedGHG);
    expect(player.playedCards).has.members([mediaGroup]);
  });

  it('Acts correctly for event cards that give one time discount', () => {
    const indenturedWorkers = new IndenturedWorkers();
    player.playedCards.push(indenturedWorkers);

    const selectProjectCardToPlay = cast(odyssey.action(player), SelectProjectCardToPlay);
    expect(selectProjectCardToPlay.cards).includes(indenturedWorkers);
    selectProjectCardToPlay.payAndPlay(indenturedWorkers, Payment.of({})); // Indentured workers costs 0.
    runAllActions(game);
    const deimosDown = new DeimosDown();

    expect(player.getCardCost(deimosDown)).to.eq(deimosDown.cost - 8);

    player.playCard(deimosDown);

    expect(player.getCardCost(deimosDown)).to.eq(deimosDown.cost); // no more discount
  });

  it('Be compatible with milestones requiring tags', () => {
    const anthozoa = new Anthozoa();
    const controlledBloom = new ControlledBloom();
    player.playedCards.push(anthozoa);
    player.playedCards.push(controlledBloom);

    const ecologist = new Ecologist();
    expect(ecologist.canClaim(player)).to.be.true;
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

    const selectProjectCardToPlay = cast(odyssey.action(player), SelectProjectCardToPlay);
    player.addActionThisGeneration(odyssey.name); // This is played after `action` as it matches code behavior.
    expect(selectProjectCardToPlay.cards.map((c) => c.name)).deep.eq([projectInspection.name]);

    const playAction = selectProjectCardToPlay.payAndPlay(projectInspection, Payment.EMPTY);
    expect(playAction).is.undefined;
    runAllActions(game);
    const selectAction = cast(player.popWaitingFor(), SelectCard);
    // It might be a bug that odyssey is replayable, but that's what you get when you bend the rules.
    expect(selectAction.cards.map((c) => c.name)).deep.eq([odyssey.name, inventorsGuild.name]);
  });

  it('Be compatible with Diversity Global Event', () => {
    const diversity = new Diversity();

    const [game, player] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;

    // player has 8 tags.
    player.playedCards.push(new AdvancedEcosystems()); // Plant, Microbe, Animal
    player.playedCards.push(new SolarWindPower()); // Science, Space, Power

    player.playedCards.push(new ThoriumRush()); // Event: Building, Moon

    turmoil.chairman = player;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player;
    turmoil.dominantParty.delegates.add(player);

    // Not enough tags, because the event does not count.
    diversity.resolve(game, turmoil);
    expect(player.megaCredits).to.eq(0);

    // Now there will be enough tags, with the event.
    player.corporations.push(odyssey);
    diversity.resolve(game, turmoil);

    expect(player.megaCredits).to.eq(10);
  });
});
