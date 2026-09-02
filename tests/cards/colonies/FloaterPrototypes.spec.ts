import {expect} from 'chai';
import {FloaterPrototypes} from '@/server/cards/colonies/FloaterPrototypes';
import {Dirigibles} from '@/server/cards/venusNext/Dirigibles';
import {FloatingHabs} from '@/server/cards/venusNext/FloatingHabs';
import {ICard} from '@/server/cards/ICard';
import {IGame} from '@/server/IGame';
import {SelectCard} from '@/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';
import {cast} from '@/common/utils/utils';

describe('FloaterPrototypes', () => {
  let card: FloaterPrototypes;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new FloaterPrototypes();
    [game, player] = testGame(2);
  });

  it('Should play with multiple eligible cards', () => {
    const dirigibles = new Dirigibles();
    const floatingHabs = new FloatingHabs();
    player.playedCards.push(dirigibles, floatingHabs);

    card.play(player);
    runAllActions(game);

    const selectCard = cast(player.popWaitingFor(), SelectCard<ICard>);
    expect(selectCard.cards).has.members([dirigibles, floatingHabs]);

    selectCard.cb([floatingHabs]);
    expect(floatingHabs.resourceCount).to.eq(2);
    expect(dirigibles.resourceCount).to.eq(0);
  });

  it('Should auto-select with a single eligible card', () => {
    const dirigibles = new Dirigibles();
    player.playedCards.push(dirigibles);

    card.play(player);
    runAllActions(game);

    expect(player.popWaitingFor()).is.undefined;
    expect(dirigibles.resourceCount).to.eq(2);
  });
});
