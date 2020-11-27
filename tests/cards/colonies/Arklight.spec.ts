import {expect} from 'chai';
import {Arklight} from '../../../src/cards/colonies/Arklight';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Predators} from '../../../src/cards/base/Predators';
import {Game} from '../../../src/Game';

describe('Arklight', function() {
  it('Should play', function() {
    const card = new Arklight();
    const player = new Player('test', Color.BLUE, false);
    const player2 = new Player('test2', Color.RED, false);
    const game = new Game('foobar', [player, player2], player);
    const play = card.play(player);
    expect(play).is.undefined;
    expect(card.resourceCount).to.eq(1);
    player.corporationCard = card;
    card.onCardPlayed(player, game, new Predators());
    expect(card.resourceCount).to.eq(2);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
