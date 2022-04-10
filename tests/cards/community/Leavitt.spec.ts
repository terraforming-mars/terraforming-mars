import {expect} from 'chai';
import {Leavitt} from '../../../src/cards/community/Leavitt';
import {Vitor} from '../../../src/cards/prelude/Vitor';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
// import {TestingUtils} from '../../TestingUtils';
import {Tags} from '../../../src/common/cards/Tags';

describe('Leavitt', function() {
  let leavitt: Leavitt;
  let player: Player;
  let player2: Player;
  let game: Game;

  beforeEach(function() {
    leavitt = new Leavitt();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
    game.gameOptions.coloniesExtension = true;
    game.colonies.push(leavitt);
  });

  it('Should build', function() {
    expect(player.getTagCount(Tags.SCIENCE)).to.eq(0);
    leavitt.addColony(player);
    expect(player.getTagCount(Tags.SCIENCE)).to.eq(1);
    leavitt.addColony(player);
    expect(player.getTagCount(Tags.SCIENCE)).to.eq(2);
  });

  // TODO(kberg): add trade and trade bonus tests.
  // it('Should trade', function() {
  //   leavitt.trade(player);
  //   expect(player.titanium).to.eq(1);
  //   expect(player2.titanium).to.eq(0);
  // });

  // it('Should give trade bonus', function() {
  //   leavitt.addColony(player);

  //   leavitt.trade(player2);
  //   TestingUtils.runAllActions(game);

  //   expect(player.titanium).to.eq(4);
  //   expect(player2.titanium).to.eq(1);
  // });

  it('Leavitt is compatible with Vitor', () => {
    // This test verifies that a regression doesn't reoccur.
    // Merely completing these is sufficient because
    // it doesn't throw an Error.
    player.corporationCard = new Vitor();
    expect(player.getTagCount(Tags.SCIENCE)).to.eq(0);
    leavitt.addColony(player);
    expect(player.getTagCount(Tags.SCIENCE)).to.eq(1);
  });
});
