import {expect} from 'chai';
import {MirandaResort} from '../../../src/cards/base/MirandaResort';
import {SaturnSystems} from '../../../src/cards/corporation/SaturnSystems';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('SaturnSystems', function() {
  let card : SaturnSystems; let player : Player; let game : Game;

  beforeEach(function() {
    card = new SaturnSystems();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
  });

  it('Runs onCardPlayed', function() {
    player.corporationCard = card;
    card.onCardPlayed(player, game, new MirandaResort());
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
  });

  it('Runs onCardPlayed when other player plays card', function() {
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
    player.corporationCard = card;

    card.onCardPlayed(player2, game, new MirandaResort());
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
  });
});
