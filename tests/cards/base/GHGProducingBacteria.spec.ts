import {expect} from 'chai';
import {GHGProducingBacteria} from '../../../src/server/cards/base/GHGProducingBacteria';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions, setOxygenLevel} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('GHGProducingBacteria', () => {
  let card: GHGProducingBacteria;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new GHGProducingBacteria();
    [game, player] = testGame(2);
  });

  it('Can play', () => {
    setOxygenLevel(game, 3);
    expect(card.canPlay(player)).is.not.true;
    setOxygenLevel(game, 4);
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    setOxygenLevel(game, 4);
    cast(card.play(player), undefined);
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
