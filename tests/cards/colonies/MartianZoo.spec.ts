import {expect} from 'chai';
import {LunaGovernor} from '../../../src/server/cards/colonies/LunaGovernor';
import {MartianZoo} from '../../../src/server/cards/colonies/MartianZoo';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';

describe('MartianZoo', function() {
  let card: MartianZoo;
  let player: TestPlayer;

  beforeEach(function() {
    card = new MartianZoo();
    [/* skipped */, player] = testGame(2);
  });

  it('Can not play', function() {
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    const lands = player.game.board.getAvailableSpacesOnLand(player);
    player.game.addCityTile(player, lands[0]);
    player.game.addCityTile(player, lands[1]);
    expect(player.simpleCanPlay(card)).is.true;

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
