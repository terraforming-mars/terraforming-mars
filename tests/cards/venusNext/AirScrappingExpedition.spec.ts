import {expect} from 'chai';
import {AirScrappingExpedition} from '../../../src/cards/venusNext/AirScrappingExpedition';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Celestic} from '../../../src/cards/venusNext/Celestic';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {ICard} from '../../../src/cards/ICard';
import {Game} from '../../../src/Game';

describe('AirScrappingExpedition', function() {
  it('Should play', function() {
    const card = new AirScrappingExpedition();
    const corp = new Celestic();
    const player = new Player('test', Color.BLUE, false);
    const game = new Game('foobar', [player, player], player);
    player.corporationCard = corp;


    const selectCard = card.play(player, game) as SelectCard<ICard>;
    expect(selectCard).is.not.undefined;
    expect(selectCard instanceof SelectCard).is.true;

    selectCard.cb([selectCard.cards[0]]);
    expect(player.getResourcesOnCard(corp)).to.eq(3);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
