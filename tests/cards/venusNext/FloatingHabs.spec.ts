import {expect} from 'chai';
import {Research} from '../../../src/cards/base/Research';
import {ICard} from '../../../src/cards/ICard';
import {Dirigibles} from '../../../src/cards/venusNext/Dirigibles';
import {FloatingHabs} from '../../../src/cards/venusNext/FloatingHabs';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('FloatingHabs', function() {
  let card : FloatingHabs; let player : Player; let game : Game;

  beforeEach(function() {
    card = new FloatingHabs();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(new Research());
    expect(player.canPlayIgnoringCost(card)).is.true;
    const action = card.play();
    expect(action).is.undefined;
  });

  it('Should act - single target', function() {
    player.playedCards.push(card);
    player.megaCredits = 10;

    card.action(player);
    game.deferredActions.runNext();
    expect(card.resourceCount).to.eq(1);
    expect(player.megaCredits).to.eq(8);
  });

  it('Should act - multiple targets', function() {
    player.playedCards.push(card, new Dirigibles());
    player.megaCredits = 10;
    const action = card.action(player);
    expect(action).instanceOf(SelectCard);

    (action as SelectCard<ICard>).cb([card]);
    game.deferredActions.runNext();
    expect(card.resourceCount).to.eq(1);
    expect(player.megaCredits).to.eq(8);
  });

  it('Gives victory points', function() {
    player.addResourceTo(card, 5);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
