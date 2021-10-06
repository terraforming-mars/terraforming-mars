import {expect} from 'chai';
import {LunaGovernor} from '../../../src/cards/colonies/LunaGovernor';
import {MartianZoo} from '../../../src/cards/colonies/MartianZoo';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('MartianZoo', function() {
  let card : MartianZoo; let player : Player;

  beforeEach(function() {
    card = new MartianZoo();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    const lands = player.game.board.getAvailableSpacesOnLand(player);
    player.game.addCityTile(player, lands[0].id);
    player.game.addCityTile(player, lands[1].id);
    expect(player.canPlayIgnoringCost(card)).is.true;

    const action = card.play();
    expect(action).is.undefined;
  });

  it('Can\'t act', function() {
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
