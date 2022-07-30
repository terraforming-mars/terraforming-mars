import {expect} from 'chai';
import {UndergroundDetonations} from '../../../src/cards/base/UndergroundDetonations';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('UndergroundDetonations', function() {
  let card: UndergroundDetonations;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new UndergroundDetonations();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not act', function() {
    player.megaCredits = 9;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.megaCredits = 10;
    expect(card.canAct(player)).is.true;

    card.action(player);
    game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(0);
    expect(player.getProduction(Resources.HEAT)).to.eq(2);
  });
});
