import {expect} from 'chai';
import {Herbivores} from '../../../src/cards/base/Herbivores';
import {Game} from '../../../src/Game';
import {SelectPlayer} from '../../../src/inputs/SelectPlayer';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {runAllActions, runNextAction} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('Herbivores', () => {
  let card: Herbivores;
  let player: Player;
  let player2: Player;
  let game: Game;

  beforeEach(() => {
    card = new Herbivores();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
  });

  it('Can not play if nobody has plant production', () => {
    (game as any).oxygenLevel = 8;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can not play if oxygen level too low', () => {
    (game as any).oxygenLevel = 7;
    player2.addProduction(Resources.PLANTS, 1);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play - auto select if single target', () => {
    (game as any).oxygenLevel = 8;
    player2.addProduction(Resources.PLANTS, 1);
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(card.resourceCount).to.eq(1);

    const input = runNextAction(game);
    expect(input).is.undefined;
    expect(player2.getProduction(Resources.PLANTS)).to.eq(0);
  });

  it('Should play - multiple targets', () => {
    player.addProduction(Resources.PLANTS, 1);
    player2.addProduction(Resources.PLANTS, 1);

    card.play(player);
    expect(card.resourceCount).to.eq(1);

    expect(game.deferredActions).has.lengthOf(1);
    const selectPlayer = runNextAction(game) as SelectPlayer;
    selectPlayer.cb(player2);
    expect(player2.getProduction(Resources.PLANTS)).to.eq(0);
  });

  it('Should add resources', () => {
    player.playedCards.push(card);
    expect(card.resourceCount).to.eq(0);

    game.addGreenery(player, game.board.getAvailableSpacesOnLand(player)[0].id);
    game.addGreenery(player, game.board.getAvailableSpacesOnLand(player)[0].id);
    runAllActions(game);
    expect(card.resourceCount).to.eq(2);

    game.addGreenery(player2, game.board.getAvailableSpacesOnLand(player2)[0].id);
    runNextAction(game);
    expect(card.resourceCount).to.eq(2); // i.e. not changed

    expect(card.getVictoryPoints()).to.eq(1);
  });

  it('Should be playable in solo mode', () => {
    const game = Game.newInstance('gameid', [player], player);
    (game as any).oxygenLevel = 8;
    player.addProduction(Resources.PLANTS, 1);

    expect(player.canPlayIgnoringCost(card)).is.true;
    card.play(player);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1); // should not decrease
  });
});
