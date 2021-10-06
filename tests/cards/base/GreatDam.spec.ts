import {expect} from 'chai';
import {GreatDam} from '../../../src/cards/base/GreatDam';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/Resources';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('GreatDam', () => {
  let card : GreatDam; let player : TestPlayer;

  beforeEach(() => {
    card = new GreatDam();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can play', () => {
    TestingUtils.maxOutOceans(player, 3);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    TestingUtils.maxOutOceans(player, 4);
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('Should play', () => {
    TestingUtils.maxOutOceans(player, 4);
    expect(player.canPlayIgnoringCost(card)).is.true;
    card.play(player);

    expect(player.getProduction(Resources.ENERGY)).to.eq(2);
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
  });
});
