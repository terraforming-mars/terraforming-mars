import {expect} from 'chai';
import {EarthCatapult} from '../../../src/server/cards/base/EarthCatapult';
import {Advertising} from '../../../src/server/cards/promo/Advertising';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('Advertising', function() {
  it('Should play', function() {
    const advertising = new Advertising();
    const player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);

    player.playedCards.push(advertising);
    advertising.play();
    expect(player.production.megacredits).to.eq(0);

    const card = new EarthCatapult();
    card.play();
    advertising.onCardPlayed(player, card);
    expect(player.production.megacredits).to.eq(1);
  });
});
