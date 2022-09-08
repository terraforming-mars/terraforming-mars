import {expect} from 'chai';
import {SearchForLife} from '../../../src/server/cards/base/SearchForLife';
import {TectonicStressPower} from '../../../src/server/cards/base/TectonicStressPower';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('TectonicStressPower', function() {
  let card: TectonicStressPower;
  let player: TestPlayer;

  beforeEach(function() {
    card = new TectonicStressPower();
    const game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(new SearchForLife(), new SearchForLife());
    expect(card.canPlay(player)).is.true;
    card.play(player);

    expect(player.production.energy).to.eq(3);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
