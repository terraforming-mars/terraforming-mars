import {expect} from 'chai';
import {ICard} from '../../../src/cards/ICard';
import {AirScrappingExpedition} from '../../../src/cards/venusNext/AirScrappingExpedition';
import {Celestic} from '../../../src/cards/venusNext/Celestic';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {TestPlayers} from '../../TestPlayers';

describe('AirScrappingExpedition', function() {
  it('Should play', function() {
    const card = new AirScrappingExpedition();
    const corp = new Celestic();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, redPlayer], player);
    player.corporationCard = corp;


    const selectCard = card.play(player) as SelectCard<ICard>;
    expect(selectCard).is.not.undefined;
    expect(selectCard instanceof SelectCard).is.true;

    selectCard.cb([selectCard.cards[0]]);
    expect(player.getResourcesOnCard(corp)).to.eq(3);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
