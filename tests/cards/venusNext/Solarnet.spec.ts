import {expect} from 'chai';
import {Solarnet} from '../../../src/cards/venusNext/Solarnet';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';

describe('Solarnet', function() {
  it('Should play', function() {
    const card = new Solarnet();
    const player = new Player('test', Color.BLUE, false);
    const game = new Game('foobar', [player, player], player);
    expect(card.canPlay(player)).is.not.true;
    const action = card.play(player, game);
    expect(action).is.undefined;
    expect(player.cardsInHand).has.lengthOf(2);
  });
});
