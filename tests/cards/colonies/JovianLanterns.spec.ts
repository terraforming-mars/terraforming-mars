import {expect} from 'chai';
import {JovianLanterns} from '../../../src/server/cards/colonies/JovianLanterns';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '@/common/utils/utils';
import {runAllActions} from '../../TestingUtils';

describe('JovianLanterns', () => {
  let card: JovianLanterns;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new JovianLanterns();
    [game, player] = testGame(2);
  });

  it('Should play', () => {
    card.play(player);
    expect(player.terraformRating).to.eq(21);
  });

  it('Can not act', () => {
    player.playedCards.push(card);
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', () => {
    player.titanium = 3;
    expect(card.canAct(player)).is.true;
    expect(card.getVictoryPoints(player)).to.eq(0);

    cast(card.action(player), undefined);
    runAllActions(game);
    expect(card.resourceCount).to.eq(2);
    expect(player.titanium).to.eq(2);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
