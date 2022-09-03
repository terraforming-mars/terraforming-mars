import {expect} from 'chai';
import {LunaGovernor} from '../../../src/server/cards/colonies/LunaGovernor';
import {MartianZoo} from '../../../src/server/cards/colonies/MartianZoo';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('MartianZoo', function() {
  let card: MartianZoo;
  let player: Player;

  beforeEach(function() {
    card = new MartianZoo();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    const lands = player.game.board.getAvailableSpacesOnLand(player);
    player.game.addCityTile(player, lands[0].id);
    player.game.addCityTile(player, lands[1].id);
    expect(player.canPlayIgnoringCost(card)).is.true;

    const action = card.play(player);
    expect(action).is.undefined;
  });

  it('Can not act', function() {
    player.playedCards.push(card);
    expect(card.canAct()).is.not.true;
  });

  it('Should act', function() {
    card.onCardPlayed(player, new LunaGovernor());
    expect(card.canAct()).is.true;

    card.action(player);
    expect(player.megaCredits).to.eq(2);
    expect(card.resourceCount).to.eq(2);
  });
});
