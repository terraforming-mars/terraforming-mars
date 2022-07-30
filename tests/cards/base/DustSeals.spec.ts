import {expect} from 'chai';
import {DustSeals} from '../../../src/cards/base/DustSeals';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {maxOutOceans} from '../../TestingUtils';

describe('DustSeals', function() {
  let card: DustSeals;
  let player: TestPlayer;

  beforeEach(function() {
    card = new DustSeals();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    maxOutOceans(player, 4);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    expect(player.canPlayIgnoringCost(card)).is.true;
    card.play();
    expect(card.getVictoryPoints()).to.eq(1);
  });
});

