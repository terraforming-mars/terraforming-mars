import {expect} from 'chai';
import {GHGProducingBacteria} from '../../../src/server/cards/base/GHGProducingBacteria';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('GHGProducingBacteria', () => {
  let card: GHGProducingBacteria;
  let player: Player;
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

    card.action(player);
    expect(card.resourceCount).to.eq(1);

    card.action(player);
    expect(card.resourceCount).to.eq(2);

    const orAction = cast(card.action(player), OrOptions);

    orAction.options[1].cb();
    expect(card.resourceCount).to.eq(3);

    orAction.options[0].cb();
    expect(card.resourceCount).to.eq(1);
    expect(game.getTemperature()).to.eq(-28);
  });
});
