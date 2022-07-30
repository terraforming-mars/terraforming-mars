import {expect} from 'chai';
import {MirandaResort} from '../../../src/cards/base/MirandaResort';
import {SaturnSystems} from '../../../src/cards/corporation/SaturnSystems';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';
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
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
  });

  it('Runs onCardPlayed', function() {
    player.setCorporationForTest(card);
    card.onCardPlayed(player, new MirandaResort());
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
  });

  it('Runs onCardPlayed when other player plays card', function() {
    const player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);
    player.setCorporationForTest(card);

    card.onCardPlayed(player2, new MirandaResort());
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
  });
});
