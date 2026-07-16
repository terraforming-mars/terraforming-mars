import {expect} from 'chai';
import {Research} from '../../../src/server/cards/base/Research';
import {AerialMappers} from '../../../src/server/cards/venusNext/AerialMappers';
import {Stratopolis} from '../../../src/server/cards/venusNext/Stratopolis';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {cast, churn, runAllActions, testGame} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('Stratopolis', () => {
  let card: Stratopolis;
  let player: TestPlayer;

  beforeEach(() => {
    card = new Stratopolis();
    [/* game */, player/* , player2 */] = testGame(2, {venusNextExtension: true});
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    player.playedCards.push(new Research());
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.megacredits).to.eq(2);
  });

  it('Should act - single target', () => {
    player.playedCards.push(card);
    card.action(player);
    runAllActions(player.game);
    expect(card.resourceCount).to.eq(2);
  });

  it('Should act - multiple targets', () => {
    const card2 = new AerialMappers();
    player.playedCards.push(card, card2);

    const selectCard = cast(churn(card.action(player), player), SelectCard);
    selectCard.cb([card2]);

    expect(card2.resourceCount).to.eq(2);
  });
});
