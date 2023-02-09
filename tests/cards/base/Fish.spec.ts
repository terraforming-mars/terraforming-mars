import {expect} from 'chai';
import {Fish} from '../../../src/server/cards/base/Fish';
import {Game} from '../../../src/server/Game';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('Fish', function() {
  let card: Fish;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Fish();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should act', function() {
    card.action(player);
    expect(card.resourceCount).to.eq(1);
  });

  it('Should play - auto select if single target', function() {
    (game as any).temperature = 2;
    player2.production.add(Resources.PLANTS, 1);

    expect(card.canPlay(player)).is.true;
    card.play(player);

    const input = game.deferredActions.peek()!.execute();
    expect(input).is.undefined;
    expect(player2.production.plants).to.eq(0);
  });

  it('Should play - multiple targets', function() {
    (game as any).temperature = 2;
    player.production.add(Resources.PLANTS, 1);
    player2.production.add(Resources.PLANTS, 1);

    expect(card.canPlay(player)).is.true;
    card.play(player);

    expect(game.deferredActions).has.lengthOf(1);
    const selectPlayer = cast(game.deferredActions.peek()!.execute(), SelectPlayer);
    selectPlayer.cb(player2);
    expect(player2.production.plants).to.eq(0);
  });

  it('Should give victory points', function() {
    player.addResourceTo(card, 5);
    expect(card.getVictoryPoints()).to.eq(card.resourceCount);
  });
});
