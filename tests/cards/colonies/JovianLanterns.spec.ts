import {expect} from 'chai';
import {JovianLanterns} from '../../../src/server/cards/colonies/JovianLanterns';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('JovianLanterns', function() {
  let card: JovianLanterns;
  let player: Player;

  beforeEach(function() {
    card = new JovianLanterns();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.getTerraformRating()).to.eq(21);
  });

  it('Can not act', function() {
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
