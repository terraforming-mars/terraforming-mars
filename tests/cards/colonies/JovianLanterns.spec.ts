import {expect} from 'chai';
import {JovianLanterns} from '../../../src/cards/colonies/JovianLanterns';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('JovianLanterns', function() {
  let card : JovianLanterns; let player : Player;

  beforeEach(function() {
    card = new JovianLanterns();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.getTerraformRating()).to.eq(21);
  });

  it('Can\'t act', function() {
    player.playedCards.push(card);
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.titanium = 3;
    expect(card.canAct(player)).is.true;

    const action = card.action(player);
    expect(action).is.undefined;
    expect(card.resourceCount).to.eq(2);
    expect(player.titanium).to.eq(2);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
