import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {InventorsGuild} from '../../../src/server/cards/base/InventorsGuild';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';

describe('InventorsGuild', function() {
  let card: InventorsGuild;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new InventorsGuild();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Should play', function() {
    const action = card.play(player);
    expect(action).is.undefined;
  });

  it('Should act', function() {
    player.megaCredits = 3;
    expect(card.action(player)).is.undefined;
    runAllActions(game);
    const selectCard = cast(player.popWaitingFor(), SelectCard);
    selectCard.cb([]);

    expect(game.projectDeck.discardPile).has.lengthOf(1);
    expect(player.megaCredits).to.eq(3);
    player.megaCredits = 3;

    selectCard.cb([selectCard.cards[0]]);
    game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(0);
    expect(player.cardsInHand).has.lengthOf(1);
  });

  it('Cannot buy card if cannot pay', function() {
    player.megaCredits = 2;
    expect(card.action(player)).is.undefined;
    runAllActions(game);
    const selectCard = cast(player.popWaitingFor(), SelectCard);
    expect(selectCard.config.max).to.eq(0);
    selectCard.cb([]);
    expect(game.deferredActions).has.lengthOf(0);
    expect(game.projectDeck.discardPile).has.lengthOf(1);
    expect(player.cardsInHand).has.lengthOf(0);
    expect(player.megaCredits).to.eq(2);
  });
});
