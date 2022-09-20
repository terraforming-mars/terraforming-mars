import {expect} from 'chai';
import {BusinessNetwork} from '../../../src/server/cards/base/BusinessNetwork';
import {Player} from '../../../src/server/Player';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('BusinessNetwork', function() {
  let card: BusinessNetwork;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new BusinessNetwork();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Should play', function() {
    expect(card.canPlay(player)).is.true;
    card.play(player);
    expect(player.production.megacredits).to.eq(-1);
  });

  it('Can not play', function() {
    player.production.add(Resources.MEGACREDITS, -5);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can act', function() {
    expect(card.canAct()).is.true;
  });

  it('Cannot buy card if cannot pay', function() {
    player.megaCredits = 2;
    const action = cast(card.action(player), SelectCard);
    expect(action.config.max).to.eq(0);

    action.cb([]);
    expect(game.projectDeck.discardPile).has.lengthOf(1);
    expect(player.cardsInHand).has.lengthOf(0);
    expect(player.megaCredits).to.eq(2);
  });

  it('Should action as not helion', function() {
    player.megaCredits = 3;
    const action = cast(card.action(player), SelectCard);

    action.cb([]);
    expect(game.projectDeck.discardPile).has.lengthOf(1);
    expect(player.megaCredits).to.eq(3);

    player.megaCredits = 3;
    action.cb([action.cards[0]]);
    expect(game.deferredActions).has.lengthOf(1);
    game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(0);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
