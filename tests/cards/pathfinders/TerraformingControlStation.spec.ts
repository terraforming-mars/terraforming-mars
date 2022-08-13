import {expect} from 'chai';
import {TerraformingControlStation} from '../../../src/server/cards/pathfinders/TerraformingControlStation';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {Ants} from '../../../src/server/cards/base/Ants';
import {AgroDrones} from '../../../src/server/cards/pathfinders/AgroDrones';
import {CorroderSuits} from '../../../src/server/cards/venusNext/CorroderSuits';

describe('TerraformingControlStation', function() {
  let card: TerraformingControlStation;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(function() {
    card = new TerraformingControlStation();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);
  });

  it('play', function() {
    expect(player.getTerraformRating()).eq(20);
    card.play(player);
    expect(player.getTerraformRating()).eq(22);
  });

  it('card discount', function() {
    player.playedCards.push(card);
    expect(card.getCardDiscount(player, new Ants())).eq(0);
    expect(card.getCardDiscount(player, new CorroderSuits())).eq(2);
    expect(card.getCardDiscount(player, new AgroDrones())).eq(2);
  });
});
