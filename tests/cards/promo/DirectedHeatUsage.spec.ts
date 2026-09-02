import {expect} from 'chai';
import {DirectedHeatUsage} from '@/server/cards/promo/DirectedHeatUsage';
import {IGame} from '@/server/IGame';
import {OrOptions} from '@/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';
import {cast} from '@/common/utils/utils';

describe('DirectedHeatUsage', () => {
  let card: DirectedHeatUsage;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new DirectedHeatUsage();
    [game, player] = testGame(2);
    player.playedCards.push(card);
  });

  it('canAct', () => {
    player.stock.heat = 2;
    expect(card.canAct(player)).is.false;

    player.stock.heat = 3;
    expect(card.canAct(player)).is.true;
  });

  it('Should act, gain M€', () => {
    player.stock.heat = 3;
    card.action(player);
    runAllActions(game);

    const orOptions = cast(player.popWaitingFor(), OrOptions);
    orOptions.options[0].cb();

    expect(player.stock.heat).to.eq(0);
    expect(player.megaCredits).to.eq(4);
    expect(player.plants).to.eq(0);
  });

  it('Should act, gain plants', () => {
    player.stock.heat = 3;
    card.action(player);
    runAllActions(game);

    const orOptions = cast(player.popWaitingFor(), OrOptions);
    orOptions.options[1].cb();

    expect(player.stock.heat).to.eq(0);
    expect(player.plants).to.eq(2);
    expect(player.megaCredits).to.eq(0);
  });
});
