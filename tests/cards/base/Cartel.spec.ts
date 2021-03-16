import {expect} from 'chai';
import {Cartel} from '../../../src/cards/base/Cartel';
import {ImportedHydrogen} from '../../../src/cards/base/ImportedHydrogen';
import {InterstellarColonyShip} from '../../../src/cards/base/InterstellarColonyShip';
import {LunarBeam} from '../../../src/cards/base/LunarBeam';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('Cartel', function() {
  let card : Cartel; let player : Player;

  beforeEach(function() {
    card = new Cartel();
    player = TestPlayers.BLUE.newPlayer();
  });

  it('Should play', function() {
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    player.playedCards.push(card);

    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);
  });

  it('Correctly counts tags', function() {
    const cards = [
      new ImportedHydrogen(), // event with earth tag
      new InterstellarColonyShip(), // event with earth tag
      new LunarBeam(), // another card with earth tag
    ];

    player.playedCards = player.playedCards.concat(cards);
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2); // exclude events
  });
});
