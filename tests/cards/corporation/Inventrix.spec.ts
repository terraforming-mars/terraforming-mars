import {expect} from 'chai';
import {Inventrix} from '../../../src/server/cards/corporation/Inventrix';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {GlobalParameter} from '../../../src/common/GlobalParameter';

describe('Inventrix', () => {
  let card: Inventrix;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Inventrix();
    [game, player] = testGame(2);
  });

  it('Should play', () => {
    card.play(player);
    expect(card.getGlobalParameterRequirementBonus(player, GlobalParameter.OCEANS)).to.eq(2);
  });

  it('Should take initial action', () => {
    player.deferInitialAction(card);
    runAllActions(game);
    expect(player.cardsInHand).has.lengthOf(3);
  });
});
