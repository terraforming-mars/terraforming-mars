import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {Dirigibles} from '../../../src/server/cards/venusNext/Dirigibles';
import {FloatingHabs} from '../../../src/server/cards/venusNext/FloatingHabs';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('Dirigibles', function() {
  let card: Dirigibles;
  let player: Player;

  beforeEach(function() {
    card = new Dirigibles();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    player.playedCards.push(card);
  });

  it('Should play', function() {
    const action = card.play(player);
    expect(action).is.undefined;
  });

  it('Should act - single target', function() {
    expect(player.getSpendableFloaters()).to.eq(0);
    const action = card.action(player);
    expect(action).is.undefined;
    expect(player.getCardsWithResources()).has.lengthOf(1);
    expect(player.getSpendableFloaters()).to.eq(1);
    expect(card.resourceCount).to.eq(1);
  });

  it('Should act - multiple targets', function() {
    player.playedCards.push(new FloatingHabs());
    const action = cast(card.action(player), SelectCard);
    action.cb([card]);

    expect(card.resourceCount).to.eq(1);
  });
});
