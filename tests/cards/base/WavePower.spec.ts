import {expect} from 'chai';
import {WavePower} from '../../../src/cards/base/WavePower';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/Resources';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('WavePower', function() {
  let card : WavePower; let player : TestPlayer;

  beforeEach(function() {
    card = new WavePower();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    TestingUtils.maxOutOceans(player, 2);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    TestingUtils.maxOutOceans(player, 3);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
  });
});
