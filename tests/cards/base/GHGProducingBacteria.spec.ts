import {expect} from 'chai';
import {GHGProducingBacteria} from '../../../src/server/cards/base/GHGProducingBacteria';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';

describe('GHGProducingBacteria', () => {
  let card: GHGProducingBacteria;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new GHGProducingBacteria();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can play', () => {
    (game as any).oxygenLevel = 3;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    (game as any).oxygenLevel = 4;
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('Should play', () => {
    (game as any).oxygenLevel = 4;
    const action = card.play(player);
    expect(action).is.undefined;
  });

  it('Should act', () => {
    player.playedCards.push(card);

    expect(card.action(player)).is.undefined;
    runAllActions(game);
    expect(card.resourceCount).to.eq(1);

    expect(card.action(player)).is.undefined;
    runAllActions(game);
    expect(card.resourceCount).to.eq(2);

    expect(card.action(player)).is.undefined;
    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);

    orOptions.options[1].cb();
    runAllActions(game);
    expect(card.resourceCount).to.eq(3);

    orOptions.options[0].cb();
    expect(card.resourceCount).to.eq(1);
    expect(game.getTemperature()).to.eq(-28);
  });
});
