import {expect} from 'chai';
import {Fish} from '../../../src/cards/base/Fish';
import {Game} from '../../../src/Game';
import {SelectPlayer} from '../../../src/inputs/SelectPlayer';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('Fish', function() {
  let card : Fish; let player : Player; let player2 : Player; let game : Game;

  beforeEach(function() {
    card = new Fish();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should act', function() {
    card.action(player);
    expect(card.resourceCount).to.eq(1);
  });

  it('Should play - auto select if single target', function() {
    (game as any).temperature = 2;
    player2.addProduction(Resources.PLANTS);

    expect(card.canPlay(player, game)).is.true;
    card.play(player, game);

    const input = game.deferredActions.next()!.execute();
    expect(input).is.undefined;
    expect(player2.getProduction(Resources.PLANTS)).to.eq(0);
  });

  it('Should play - multiple targets', function() {
    (game as any).temperature = 2;
    player.addProduction(Resources.PLANTS);
    player2.addProduction(Resources.PLANTS);

    expect(card.canPlay(player, game)).is.true;
    card.play(player, game);

    expect(game.deferredActions).has.lengthOf(1);
    const selectPlayer = game.deferredActions.next()!.execute() as SelectPlayer;
    selectPlayer.cb(player2);
    expect(player2.getProduction(Resources.PLANTS)).to.eq(0);
  });

  it('Should give victory points', function() {
    player.addResourceTo(card, 5);
    expect(card.getVictoryPoints()).to.eq(card.resourceCount);
  });
});
