import {expect} from 'chai';
import {ArchaeBacteria} from '../../../src/server/cards/base/ArchaeBacteria';
import {TestPlayer} from '../../TestPlayer';
import {Game} from '../../../src/server/Game';
import {Resources} from '../../../src/common/Resources';

describe('ArchaeBacteria', function() {
  let card: ArchaeBacteria;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new ArchaeBacteria();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    (game as any).temperature = -12;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    card.play(player);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
  });
});
