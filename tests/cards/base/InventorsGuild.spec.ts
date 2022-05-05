import {expect} from 'chai';
import {InventorsGuild} from '../../../src/cards/base/InventorsGuild';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('InventorsGuild', function() {
  let card : InventorsGuild; let player : Player; let game : Game;

  beforeEach(function() {
    card = new InventorsGuild();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    const action = card.play(player);
    expect(action).is.undefined;
  });

  it('Should act', function() {
    player.megaCredits = 3;
    const action = card.action(player);
    expect(action).instanceOf(SelectCard);
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
    const selectCard = card.action(player) as SelectCard<IProjectCard>;
    expect(selectCard.config.max).to.eq(0);
    selectCard.cb([]);
    expect(game.deferredActions).has.lengthOf(0);
    expect(game.dealer.discarded).has.lengthOf(1);
    expect(player.cardsInHand).has.lengthOf(0);
    expect(player.megaCredits).to.eq(2);
  });
});
