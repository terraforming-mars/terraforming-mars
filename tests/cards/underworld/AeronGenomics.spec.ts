import {AeronGenomics} from '../../../src/server/cards/underworld/AeronGenomics';
import {Birds} from '../../../src/server/cards/base/Birds';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {cast, runAllActions} from '../../TestingUtils';
import {UnderworldExpansion} from '../../../src/server/underworld/UnderworldExpansion';
import {Fish} from '../../../src/server/cards/base/Fish';
import {SelectCard} from '../../../src/server/inputs/SelectCard';

describe('AeronGenomics', () => {
  let card: AeronGenomics;
  let player: TestPlayer;
  let game: IGame;
  let animalHost: IProjectCard;

  beforeEach(() => {
    animalHost = new Birds();
    card = new AeronGenomics();
    [game, player] = testGame(2, {underworldExpansion: true});
  });

  it('Play', () => {
    expect(card.resourceCount).eq(0);
    card.play(player);
    runAllActions(game);
    expect(card.resourceCount).eq(1);
    expect(player.steel).eq(5);
  });

  it('onExcavate', () => {
    player.corporations.push(card);
    card.resourceCount = 0;
    const spaces = UnderworldExpansion.excavatableSpaces(player);
    spaces[0].undergroundResources = 'nothing';
    UnderworldExpansion.excavate(player, spaces[0]);

    expect(card.resourceCount).eq(1);
  });

  const canPlayRuns = [
    {resourceCount: 0, mc: 1, destinationCard: true, expected: false},
    {resourceCount: 1, mc: 1, destinationCard: true, expected: true},
    {resourceCount: 1, mc: 1, destinationCard: false, expected: false},
    {resourceCount: 1, mc: 1, destinationCard: true, expected: true},
  ] as const;
  for (const run of canPlayRuns) {
    it('canPlay ' + JSON.stringify(run), () => {
      card.play(player);
      player.playedCards.push(card);
      if (run.destinationCard) {
        player.playCard(animalHost);
      }
      card.resourceCount = run.resourceCount;
      player.megaCredits = run.mc;
      expect(card.canAct(player)).eq(run.expected);
    });
  }

  // Matches Bioengineering Enclosure test.
  it('Move animal', () => {
    // Set up the cards.

    const fish = new Fish();
    player.playedCards.push(fish);
    player.playedCards.push(animalHost);
    player.playCard(card);
    runAllActions(game);

    // Initial expectations that will change after playing the card.
    expect(card.canAct(player)).is.false;

    player.stock.megacredits = 1;
    expect(card.canAct(player)).is.true;

    expect(card.resourceCount).eq(1);
    expect(animalHost.resourceCount).eq(0);
    expect(game.deferredActions).has.lengthOf(0);

    card.action(player);

    runAllActions(game);

    const selectCard = cast(player.popWaitingFor(), SelectCard);

    expect(selectCard.cards).to.have.members([animalHost, fish]);

    selectCard.cb([animalHost]);
    runAllActions(game);

    cast(player.popWaitingFor(), undefined);

    expect(card.resourceCount).eq(0);
    expect(animalHost.resourceCount).eq(1);
    expect(player.stock.megacredits).eq(0);
  });
});
