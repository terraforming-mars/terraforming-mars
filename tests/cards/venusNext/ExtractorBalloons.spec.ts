import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {ExtractorBalloons} from '../../../src/server/cards/venusNext/ExtractorBalloons';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('ExtractorBalloons', () => {
  let card: ExtractorBalloons;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new ExtractorBalloons();
    [game, player] = testGame(2);
  });

  it('Should play', () => {
    cast(card.play(player), undefined);
    runAllActions(game);
    expect(card.resourceCount).to.eq(3);
  });

  it('Can act', () => {
    player.playedCards.push(card);
    card.resourceCount = 1;
    expect(card.canAct()).is.true;
    card.resourceCount = 2;
    expect(card.canAct()).is.true;
  });

  it('Should act', () => {
    player.playedCards.push(card);
    card.resourceCount = 3;

    const orOptions = cast(card.action(player), OrOptions);

    orOptions.options[0].cb();
    expect(card.resourceCount).to.eq(1);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
