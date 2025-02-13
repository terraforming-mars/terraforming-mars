import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {ResearchOutpost} from '../../../src/server/cards/base/ResearchOutpost';
import {IGame} from '../../../src/server/IGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('ResearchOutpost', () => {
  let card: ResearchOutpost;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new ResearchOutpost();
    [game, player] = testGame(2);
  });

  it('Should play', () => {
    cast(card.play(player), undefined);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);


    action.cb(action.spaces[0]);
    expect(game.board.getCities()).has.length(1);
    expect(card.getCardDiscount()).to.eq(1);
  });

  it('Can not play if no spaces available', () => {
    const lands = game.board.getAvailableSpacesOnLand(player);
    lands.forEach((land) => game.addGreenery(player, land));

    expect(card.canPlay(player)).is.not.true;
  });
});
