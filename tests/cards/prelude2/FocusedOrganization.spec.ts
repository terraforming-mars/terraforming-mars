import {expect} from 'chai';
import {FocusedOrganization} from '../../../src/server/cards/prelude2/FocusedOrganization';
import {testGame} from '../../TestGame';
import {Units} from '../../../src/common/Units';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectResources} from '../../../src/server/inputs/SelectResources';
import {AndOptions} from '../../../src/server/inputs/AndOptions';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {SelectResource} from '../../../src/server/inputs/SelectResource';
import {SolBank} from '../../../src/server/cards/pathfinders/SolBank';

describe('FocusedOrganization', () => {
  it('play', () => {
    const card = new FocusedOrganization();
    const [game, player] = testGame(1);

    card.play(player);
    runAllActions(game);
    expect(player.cardsInHand).has.length(1);

    const selectResources = cast(player.popWaitingFor(), SelectResources);
    expect(selectResources.options).has.length(6);
    selectResources.options[0].cb(0);
    selectResources.options[1].cb(0);
    selectResources.options[2].cb(0);
    selectResources.options[3].cb(1);
    selectResources.options[4].cb(0);
    selectResources.options[5].cb(0);
    selectResources.cb(undefined);
    expect(player.stock.asUnits()).deep.eq(Units.of({plants: 1}));

    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
  });

  const canActRuns = [
    {cardsInHand: 0, resources: 0, expected: false},
    {cardsInHand: 1, resources: 0, expected: false},
    {cardsInHand: 0, resources: 1, expected: false},
    {cardsInHand: 1, resources: 1, expected: true},
  ] as const;
  for (const run of canActRuns) {
    it('canAct: ' + JSON.stringify(run), () => {
      const card = new FocusedOrganization();
      const [/* game */, player] = testGame(1);

      if (run.cardsInHand === 1) {
        player.drawCard();
      }
      player.megaCredits = run.resources;
      expect(card.canAct(player)).eq(run.expected);
    });
  }

  it('action', () => {
    const card = new FocusedOrganization();
    const [game, player] = testGame(1);

    const firstCard = game.projectDeck.drawOrThrow(game);
    const secondCard = game.projectDeck.drawOrThrow(game);
    player.cardsInHand = [firstCard, secondCard];
    player.megaCredits = 5;
    player.plants = 3;

    const andOptions: AndOptions = card.action(player);
    const selectCard = cast(andOptions.options[0], SelectCard);

    expect(selectCard.cards).to.have.members([firstCard, secondCard]);

    selectCard.cb([firstCard]);

    const selectResource = cast(andOptions.options[1], SelectResource);
    expect(selectResource.options.length).eq(2);
    selectResource.options[1].cb();
    const selectNewResource = cast(andOptions.cb(undefined), SelectResource);

    expect(player.cardsInHand).does.not.contain(firstCard);
    expect(game.projectDeck.discardPile).contains(firstCard);
    expect(player.cardsInHand).contains(secondCard);
    expect(player.cardsInHand).has.length(2);

    expect(player.stock.asUnits()).deep.eq(Units.of({megacredits: 5, plants: 2}));

    selectNewResource.options[2].cb();
    expect(player.stock.asUnits()).deep.eq(Units.of({megacredits: 5, titanium: 1, plants: 2}));
  });

  it('Compatible with Sol Bank', () => {
    const card = new FocusedOrganization();
    const solBank = new SolBank();
    const [game, player] = testGame(1, {pathfindersExpansion: true});
    player.setCorporationForTest(solBank);

    const firstCard = game.projectDeck.drawOrThrow(game);
    const secondCard = game.projectDeck.drawOrThrow(game);
    player.cardsInHand = [firstCard, secondCard];
    player.megaCredits = 5;
    player.plants = 3;

    const andOptions: AndOptions = card.action(player);
    const selectCard = cast(andOptions.options[0], SelectCard);

    selectCard.cb([firstCard]);

    const selectResource = cast(andOptions.options[1], SelectResource);
    expect(selectResource.options.length).eq(2);
    selectResource.options[1].cb(); // plants
    runAllActions(game);
    expect(solBank.resourceCount).eq(0);
    selectResource.options[0].cb(); // MC
    runAllActions(game);
    expect(solBank.resourceCount).eq(1);
  });
});
