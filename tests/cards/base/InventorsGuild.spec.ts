import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {InventorsGuild} from '../../../src/server/cards/base/InventorsGuild';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('InventorsGuild', function() {
  let card: InventorsGuild;
  let player: Player;
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
    const action = cast(card.action(player), SelectCard);
    action.cb([]);

    expect(game.projectDeck.discardPile).has.lengthOf(1);
    expect(player.megaCredits).to.eq(3);
    player.megaCredits = 3;

    action.cb([action.cards[0]]);
    game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(0);
    expect(player.cardsInHand).has.lengthOf(1);
  });

  it('Cannot buy card if cannot pay', function() {
    player.megaCredits = 2;
    const selectCard = cast(card.action(player), SelectCard<IProjectCard>);
    expect(selectCard.config.max).to.eq(0);
    selectCard.cb([]);
    expect(game.deferredActions).has.lengthOf(0);
    expect(game.projectDeck.discardPile).has.lengthOf(1);
    expect(player.cardsInHand).has.lengthOf(0);
    expect(player.megaCredits).to.eq(2);
  });
});
