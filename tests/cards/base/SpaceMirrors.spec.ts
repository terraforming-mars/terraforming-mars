import {expect} from 'chai';
import {SpaceMirrors} from '../../../src/server/cards/base/SpaceMirrors';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('SpaceMirrors', function() {
  let card: SpaceMirrors;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new SpaceMirrors();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not act', function() {
    player.megaCredits = 6;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.megaCredits = 7;
    expect(card.canAct(player)).is.true;

    card.action(player);
    game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(0);
    expect(player.production.energy).to.eq(1);
  });
});
