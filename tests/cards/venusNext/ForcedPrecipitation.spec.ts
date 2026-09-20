import {expect} from 'chai';
import {cast} from '@/common/utils/utils';
import {ForcedPrecipitation} from '../../../src/server/cards/venusNext/ForcedPrecipitation';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {churn, runAllActions} from '../../TestingUtils';

describe('ForcedPrecipitation', () => {
  let card: ForcedPrecipitation;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new ForcedPrecipitation();
    [game, player] = testGame(2);
  });

  it('Should play', () => {
    cast(card.play(player), undefined);
  });

  it('Should act - both actions available', () => {
    player.playedCards.push(card);
    player.megaCredits = 10;

    // Not enough floaters yet, so only the M€ branch is executable and it auto-selects.
    const result = churn(card.action(player), player);
    cast(result, undefined);
    expect(card.resourceCount).to.eq(1);
    expect(player.megaCredits).to.eq(8);

    player.addResourceTo(card);
    expect(card.resourceCount).to.eq(2);

    const orOptions2 = cast(churn(card.action(player), player), OrOptions);
    orOptions2.options[0].cb();
    expect(card.resourceCount).to.eq(0);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });

  it('Should act - only one action available', () => {
    player.playedCards.push(card);
    player.megaCredits = 0;
    player.addResourceTo(card, 2);

    card.action(player);
    runAllActions(game);
    expect(card.resourceCount).to.eq(0);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
