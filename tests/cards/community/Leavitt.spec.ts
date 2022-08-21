import {expect} from 'chai';
import {Leavitt} from '../../../src/server/cards/community/Leavitt';
import {Vitor} from '../../../src/server/cards/prelude/Vitor';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {Tag} from '../../../src/common/cards/Tag';

describe('Leavitt', function() {
  let leavitt: Leavitt;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    leavitt = new Leavitt();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
    game.gameOptions.coloniesExtension = true;
    game.colonies.push(leavitt);
  });

  it('Should build', function() {
    expect(player.tags.count(Tag.SCIENCE)).to.eq(0);
    leavitt.addColony(player);
    expect(player.tags.count(Tag.SCIENCE)).to.eq(1);
    leavitt.addColony(player);
    expect(player.tags.count(Tag.SCIENCE)).to.eq(2);
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
  //   runAllActions(game);

  //   expect(player.titanium).to.eq(4);
  //   expect(player2.titanium).to.eq(1);
  // });

  it('Leavitt is compatible with Vitor', () => {
    // This test verifies that a regression doesn't reoccur.
    // Merely completing these is sufficient because
    // it doesn't throw an Error.
    player.setCorporationForTest(new Vitor());
    expect(player.tags.count(Tag.SCIENCE)).to.eq(0);
    leavitt.addColony(player);
    expect(player.tags.count(Tag.SCIENCE)).to.eq(1);
  });
});
