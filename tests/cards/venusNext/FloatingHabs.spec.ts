import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {Research} from '../../../src/server/cards/base/Research';
import {Dirigibles} from '../../../src/server/cards/venusNext/Dirigibles';
import {FloatingHabs} from '../../../src/server/cards/venusNext/FloatingHabs';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('FloatingHabs', function() {
  let card: FloatingHabs;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new FloatingHabs();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(new Research());
    expect(player.canPlayIgnoringCost(card)).is.true;
    const action = card.play(player);
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
    const action = cast(card.action(player), SelectCard);
    action.cb([card]);
    game.deferredActions.runNext();
    expect(card.resourceCount).to.eq(1);
    expect(player.megaCredits).to.eq(8);
  });

  it('Gives victory points', function() {
    player.addResourceTo(card, 5);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
