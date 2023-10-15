import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {ResearchOutpost} from '../../../src/server/cards/base/ResearchOutpost';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('ResearchOutpost', function() {
  let card: ResearchOutpost;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new ResearchOutpost();
    [game, player] = testGame(2);
  });

  it('Should play', function() {
    expect(card.play(player)).is.undefined;
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);


    action.cb(action.spaces[0]);
    expect(game.board.getCities()).has.length(1);
    expect(card.getCardDiscount()).to.eq(1);
  });

  it('Can not play if no spaces available', function() {
    const lands = game.board.getAvailableSpacesOnLand(player);
    lands.forEach((land) => game.addGreenery(player, land));

    expect(card.canPlay(player)).is.not.true;
  });
});
