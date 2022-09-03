import {expect} from 'chai';
import {Research} from '../../../src/server/cards/base/Research';
import {VenusianAnimals} from '../../../src/server/cards/venusNext/VenusianAnimals';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('VenusianAnimals', function() {
  let card: VenusianAnimals;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new VenusianAnimals();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    (game as any).venusScaleLevel = 16;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).venusScaleLevel = 18;
    expect(player.canPlayIgnoringCost(card)).is.true;
    player.playedCards.push(card);
    card.play(player);

    card.onCardPlayed(player, card);
    expect(card.resourceCount).to.eq(1);

    card.onCardPlayed(player, new Research());
    expect(card.resourceCount).to.eq(3);

    expect(card.getVictoryPoints()).to.eq(3);
  });
});
