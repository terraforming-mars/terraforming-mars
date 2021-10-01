import {expect} from 'chai';
import {TerraformingControlStation} from '../../../src/cards/pathfinders/TerraformingControlStation';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {Ants} from '../../../src/cards/base/Ants';
import {AgroDrones} from '../../../src/cards/pathfinders/AgroDrones';
import {CorroderSuits} from '../../../src/cards/venusNext/CorroderSuits';

describe('TerraformingControlStation', function() {
  let card: TerraformingControlStation;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(function() {
    card = new TerraformingControlStation();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);
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
