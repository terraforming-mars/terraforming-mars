import {expect} from 'chai';
import {EarthCatapult} from '../../../src/server/cards/base/EarthCatapult';
import {Advertising} from '../../../src/server/cards/promo/Advertising';
import {Game} from '../../../src/server/Game';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('Advertising', function() {
  it('Should play', function() {
    const advertising = new Advertising();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    Game.newInstance('gameid', [player], player);

    player.playedCards.push(advertising);
    advertising.play(player);
    expect(player.production.megacredits).to.eq(0);

    const card = new EarthCatapult();
    card.play(player);
    advertising.onCardPlayed(player, card);
    expect(player.production.megacredits).to.eq(1);
  });
});
