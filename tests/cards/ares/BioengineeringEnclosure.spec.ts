import {AICentral} from '../../../src/server/cards/base/AICentral';
import {BioengineeringEnclosure} from '../../../src/server/cards/ares/BioengineeringEnclosure';
import {Birds} from '../../../src/server/cards/base/Birds';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {expect} from 'chai';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {Game} from '../../../src/server/Game';
import {runAllActions} from '../../TestingUtils';

describe('BioengineeringEnclosure', function() {
  let card: BioengineeringEnclosure;
  let player: TestPlayer;
  let game: Game;
  let animalHost: IProjectCard;

  beforeEach(function() {
    animalHost = new Birds();
    card = new BioengineeringEnclosure();
    game = newTestGame(2, ARES_OPTIONS_NO_HAZARDS);
    game.deferredActions.pop(); // Removing SelectInitialCards.
    player = getTestPlayer(game, 0);
  });

  it('Can not play without a science tag', () => {
    expect(player.canPlayIgnoringCost(card)).is.false;
    player.playCard(new AICentral());
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('Play', () => {
    expect(card.resourceCount).eq(0);
    card.play(player);
    runAllActions(game);
    expect(card.resourceCount).eq(2);
  });

  it('Can not move animal if it is empty', () => {
    card.play(player);
    player.playCard(animalHost);
    card.resourceCount = 0;
    expect(card.canAct(player)).is.false;
  });

  it('Can not move animal if there is no other animal card', () => {
    card.play(player);
    expect(card.canAct(player)).is.false;
  });

  it('Move animal', () => {
    // Set up the cards.
    player.playCard(animalHost);
    player.playCard(card);
    runAllActions(game);

    // Initial expectations that will change after playing the card.
    expect(card.canAct(player)).is.true;
    expect(card.resourceCount).eq(2);
    expect(animalHost.resourceCount).eq(0);
    expect(game.deferredActions).has.lengthOf(0);

    card.action(player);

    game.deferredActions.peek()!.execute();

    expect(card.resourceCount).eq(1);
    expect(animalHost.resourceCount).eq(1);
  });
});
