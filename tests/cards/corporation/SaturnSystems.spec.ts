import {expect} from 'chai';
import {MirandaResort} from '../../../src/server/cards/base/MirandaResort';
import {SaturnSystems} from '../../../src/server/cards/corporation/SaturnSystems';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('SaturnSystems', function() {
  let card: SaturnSystems;
  let player: TestPlayer;

  beforeEach(function() {
    card = new SaturnSystems();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.production.titanium).to.eq(1);
    expect(player.production.megacredits).to.eq(1);
  });

  it('Runs onCardPlayed', function() {
    player.setCorporationForTest(card);
    card.onCardPlayed(player, new MirandaResort());
    expect(player.production.megacredits).to.eq(1);
  });

  it('Runs onCardPlayed when other player plays card', function() {
    const player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);
    player.setCorporationForTest(card);

    card.onCardPlayed(player2, new MirandaResort());
    expect(player.production.megacredits).to.eq(1);
  });
});
