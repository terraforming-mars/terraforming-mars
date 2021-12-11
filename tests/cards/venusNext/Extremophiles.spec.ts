import {expect} from 'chai';
import {Research} from '../../../src/cards/base/Research';
import {Tardigrades} from '../../../src/cards/base/Tardigrades';
import {Extremophiles} from '../../../src/cards/venusNext/Extremophiles';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('Extremophiles', function() {
  let card : Extremophiles; let player : Player;

  beforeEach(function() {
    card = new Extremophiles();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
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

  it('Should act', function() {
    player.playedCards.push(card);
    card.action(player);
    expect(card.resourceCount).to.eq(1);
  });

  it('Should act - multiple targets', function() {
    player.playedCards.push(card, new Tardigrades());
    const action = card.action(player);
    expect(action).instanceOf(SelectCard);

        action!.cb([card]);
        expect(player.getResourcesOnCard(card)).to.eq(1);
  });

  it('Gives victory points', function() {
    player.addResourceTo(card, 7);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
