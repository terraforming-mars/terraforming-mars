import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {Research} from '../../../src/server/cards/base/Research';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {Extremophiles} from '../../../src/server/cards/venusNext/Extremophiles';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('Extremophiles', function() {
  let card: Extremophiles;
  let player: Player;

  beforeEach(function() {
    card = new Extremophiles();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
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

  it('Should act', function() {
    player.playedCards.push(card);
    card.action(player);
    expect(card.resourceCount).to.eq(1);
  });

  it('Should act - multiple targets', function() {
    player.playedCards.push(card, new Tardigrades());
    const action = cast(card.action(player), SelectCard);
    action.cb([card]);

    expect(card.resourceCount).to.eq(1);
  });

  it('Gives victory points', function() {
    player.addResourceTo(card, 7);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
