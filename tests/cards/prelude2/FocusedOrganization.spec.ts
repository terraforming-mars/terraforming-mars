import {expect} from 'chai';
import {FocusedOrganization} from '../../../src/server/cards/prelude2/FocusedOrganization';
import {testGame} from '../../TestGame';
import {Units} from '../../../src/common/Units';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectResource} from '../../../src/server/inputs/SelectResource';
import {AndOptions} from '../../../src/server/inputs/AndOptions';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {SolBank} from '../../../src/server/cards/pathfinders/SolBank';

describe('FocusedOrganization', () => {
  it('play', () => {
    const card = new FocusedOrganization();
    const [game, player] = testGame(1);

    card.play(player);
    runAllActions(game);
    expect(player.cardsInHand).has.length(1);

    const selectResources = cast(player.popWaitingFor(), SelectResource);
    expect(selectResources.include).has.length(6);
    selectResources.cb('plants');
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

    const selectResource = cast(andOptions.options[0], SelectResource);
    const selectCard = cast(andOptions.options[1], SelectCard);

    expect(selectResource.include.length).eq(2);
    expect(selectCard.cards).to.have.members([firstCard, secondCard]);
    expect(selectResource.include).deep.eq(['megacredits', 'plants']);

    selectResource.cb('plants');
    selectCard.cb([firstCard]);

    const selectNewResource = cast(andOptions.cb(undefined), SelectResource);

    expect(player.cardsInHand).does.not.contain(firstCard);
    expect(game.projectDeck.discardPile).contains(firstCard);
    expect(player.cardsInHand).contains(secondCard);
    expect(player.cardsInHand).has.length(2);

    expect(player.stock.asUnits()).deep.eq(Units.of({megacredits: 5, plants: 2}));

    selectNewResource.cb('titanium');
    expect(player.stock.asUnits()).deep.eq(Units.of({megacredits: 5, titanium: 1, plants: 2}));
  });

  it('Compatible with Sol Bank', () => {
    const card = new FocusedOrganization();
    const solBank = new SolBank();
    const [game, player] = testGame(1, {pathfindersExpansion: true});
    player.corporations.push(solBank);

    const firstCard = game.projectDeck.drawOrThrow(game);
    const secondCard = game.projectDeck.drawOrThrow(game);
    player.cardsInHand = [firstCard, secondCard];
    player.megaCredits = 5;
    player.plants = 3;

    const andOptions: AndOptions = card.action(player);
    const selectCard = cast(andOptions.options[1], SelectCard);
    const selectResource = cast(andOptions.options[0], SelectResource);

    expect(selectResource.include.length).eq(2);

    selectCard.cb([firstCard]);
    selectResource.cb('plants');

    runAllActions(game);
    expect(solBank.resourceCount).eq(0);
    selectResource.cb('megacredits');
    runAllActions(game);
    expect(solBank.resourceCount).eq(1);
  });
});
