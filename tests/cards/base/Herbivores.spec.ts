import {expect} from 'chai';
import {Herbivores} from '../../../src/cards/base/Herbivores';
import {Game} from '../../../src/Game';
import {SelectPlayer} from '../../../src/inputs/SelectPlayer';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('Herbivores', function() {
  let card : Herbivores; let player : Player; let player2: Player; let game: Game;

  beforeEach(function() {
    card = new Herbivores();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Can\'t play if nobody has plant production', function() {
    (game as any).oxygenLevel = 8;
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Can\'t play if oxygen level too low', function() {
    (game as any).oxygenLevel = 7;
    player2.addProduction(Resources.PLANTS);
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play - auto select if single target', function() {
    (game as any).oxygenLevel = 8;
    player2.addProduction(Resources.PLANTS);
    expect(card.canPlay(player, game)).is.true;

    card.play(player, game);
    expect(card.resourceCount).to.eq(1);

    const input = game.deferredActions.next()!.execute();
    expect(input).is.undefined;
    expect(player2.getProduction(Resources.PLANTS)).to.eq(0);
  });

  it('Should play - multiple targets', function() {
    player.addProduction(Resources.PLANTS);
    player2.addProduction(Resources.PLANTS);

    card.play(player, game);
    expect(card.resourceCount).to.eq(1);

    expect(game.deferredActions).has.lengthOf(1);
    const selectPlayer = game.deferredActions.next()!.execute() as SelectPlayer;
    selectPlayer.cb(player2);
    expect(player2.getProduction(Resources.PLANTS)).to.eq(0);
  });

  it('Should add resources', function() {
    player.playedCards.push(card);
    expect(card.resourceCount).to.eq(0);

    game.addGreenery(player, game.board.getAvailableSpacesOnLand(player)[0].id);
    game.addGreenery(player, game.board.getAvailableSpacesOnLand(player)[0].id);
    expect(card.resourceCount).to.eq(2);

    game.addGreenery(player2, game.board.getAvailableSpacesOnLand(player2)[0].id);
    expect(card.resourceCount).to.eq(2); // i.e. not changed

    expect(card.getVictoryPoints()).to.eq(1);
  });

  it('Should be playable in solo mode', function() {
    const game = Game.newInstance('foobar_solo', [player], player);
    (game as any).oxygenLevel = 8;
    player.addProduction(Resources.PLANTS);

    expect(card.canPlay(player, game)).is.true;
    card.play(player, game);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1); // should not decrease
  });
});
