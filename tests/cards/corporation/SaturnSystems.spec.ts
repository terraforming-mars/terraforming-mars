import {expect} from 'chai';
import {MirandaResort} from '../../../src/server/cards/base/MirandaResort';
import {SaturnSystems} from '../../../src/server/cards/corporation/SaturnSystems';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('SaturnSystems', function() {
  let card: SaturnSystems;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(function() {
    card = new SaturnSystems();
    [/* game */, player, player2] = testGame(2);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.production.titanium).to.eq(1);
    expect(player.production.megacredits).to.eq(1);
  });

  it('Runs onCardPlayed', function() {
    player.corporations.push(card);
    card.onCardPlayed(player, new MirandaResort());
    expect(player.production.megacredits).to.eq(1);
  });

  it('Runs onCardPlayed when other player plays card', function() {
    player.corporations.push(card);
    card.onCardPlayed(player2, new MirandaResort());
    expect(player.production.megacredits).to.eq(1);
  });
});
