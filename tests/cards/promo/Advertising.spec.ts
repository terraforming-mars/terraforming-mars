import {expect} from 'chai';
import {EarthCatapult} from '../../../src/cards/base/EarthCatapult';
import {Advertising} from '../../../src/cards/promo/Advertising';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('Advertising', function() {
  it('Should play', function() {
    const advertising = new Advertising();
    const player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);

    player.playedCards.push(advertising);
    advertising.play();
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(0);

    const card = new EarthCatapult();
    card.play();
    advertising.onCardPlayed(player, card);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
  });
});
