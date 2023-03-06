import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {Dirigibles} from '../../../src/server/cards/venusNext/Dirigibles';
import {FloatingHabs} from '../../../src/server/cards/venusNext/FloatingHabs';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';

describe('Dirigibles', function() {
  let card: Dirigibles;
  let player: TestPlayer;

  beforeEach(function() {
    card = new Dirigibles();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    player.playedCards.push(card);
    player.popSelectInitialCards();
  });

  it('Should play', function() {
    const action = card.play(player);
    expect(action).is.undefined;
  });

  it('Should act - single target', function() {
    expect(player.getSpendableFloaters()).to.eq(0);
    expect(card.action(player)).is.undefined;
    runAllActions(player.game);
    expect(player.popWaitingFor()).is.undefined;
    expect(player.getCardsWithResources()).has.lengthOf(1);
    expect(player.getSpendableFloaters()).to.eq(1);
    expect(card.resourceCount).to.eq(1);
  });

  it('Should act - multiple targets', function() {
    player.playedCards.push(new FloatingHabs());
    expect(card.action(player)).is.undefined;
    runAllActions(player.game);

    const action = cast(player.popWaitingFor(), SelectCard);
    action.cb([card]);

    expect(card.resourceCount).to.eq(1);
  });
});
