import {expect} from 'chai';
import {InventorsGuild} from '../../../src/cards/base/InventorsGuild';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {IProjectCard} from '../../../src/cards/IProjectCard';

describe('InventorsGuild', function() {
  let card : InventorsGuild; let player : Player; let game : Game;

  beforeEach(function() {
    card = new InventorsGuild();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player);
  });

  it('Should play', function() {
    const action = card.play(player, game);
    expect(action).is.undefined;
  });

  it('Should act', function() {
    player.megaCredits = 3;
    const action = card.action(player, game);
    expect(action instanceof SelectCard).is.true;
    (action! as SelectCard<IProjectCard>).cb([]);

    expect(game.dealer.discarded).has.lengthOf(1);
    expect(player.megaCredits).to.eq(3);
    player.megaCredits = 3;

    (action as SelectCard<IProjectCard>).cb([(action as SelectCard<IProjectCard>).cards[0]]);
    game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(0);
    expect(player.cardsInHand).has.lengthOf(1);
  });

  it('Cannot buy card if cannot pay', function() {
    player.megaCredits = 2;
    const selectCard = card.action(player, game) as SelectCard<IProjectCard>;
    expect(selectCard.title).to.eq('You cannot pay for this card');
    selectCard.cb([selectCard.cards[0]]);
    expect(game.deferredActions).has.lengthOf(0);
    expect(game.dealer.discarded).has.lengthOf(1);
    expect(player.cardsInHand).has.lengthOf(0);
    expect(player.megaCredits).to.eq(2);
  });
});
