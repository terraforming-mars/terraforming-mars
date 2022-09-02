import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {ResearchOutpost} from '../../../src/server/cards/base/ResearchOutpost';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('ResearchOutpost', function() {
  let card: ResearchOutpost;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new ResearchOutpost();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Should play', function() {
    const action = cast(card.play(player), SelectSpace);

    action.cb(action.availableSpaces[0]);
    expect(game.getCitiesCount()).to.eq(1);
    expect(card.getCardDiscount()).to.eq(1);
  });

  it('Can not play if no spaces available', function() {
    const lands = game.board.getAvailableSpacesOnLand(player);
    for (let i = 0; i < lands.length; i++) {
      game.addGreenery(player, lands[i].id);
    }

    expect(card.canPlay(player)).is.not.true;
  });
});
