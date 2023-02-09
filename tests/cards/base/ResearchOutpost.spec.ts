import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {ResearchOutpost} from '../../../src/server/cards/base/ResearchOutpost';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';

describe('ResearchOutpost', function() {
  let card: ResearchOutpost;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new ResearchOutpost();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Should play', function() {
    expect(card.play(player)).is.undefined;
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);


    action.cb(action.availableSpaces[0]);
    expect(game.getCitiesCount()).to.eq(1);
    expect(card.getCardDiscount()).to.eq(1);
  });

  it('Can not play if no spaces available', function() {
    const lands = game.board.getAvailableSpacesOnLand(player);
    lands.forEach((land) => game.addGreenery(player, land));

    expect(card.canPlay(player)).is.not.true;
  });
});
