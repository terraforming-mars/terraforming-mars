import {expect} from 'chai';
import {UndergroundCity} from '../../../src/server/cards/base/UndergroundCity';
import {Game} from '../../../src/server/Game';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {cast, runAllActions} from '../../TestingUtils';

describe('UndergroundCity', function() {
  let card: UndergroundCity;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new UndergroundCity();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    player.production.add(Resources.ENERGY, 1);
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resources.ENERGY, 2);
    expect(player.simpleCanPlay(card)).is.true;

    expect(card.play(player)).is.undefined;
    runAllActions(player.game);
    const action = cast(player.popWaitingFor(), SelectSpace);

    action.cb(action.availableSpaces[0]);
    expect(game.getCitiesCount()).to.eq(1);
    expect(player.production.energy).to.eq(0);
    expect(player.production.steel).to.eq(2);
  });
});
