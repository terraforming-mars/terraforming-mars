import {expect} from 'chai';
import {ICard} from '../../../src/cards/ICard';
import {AirScrappingExpedition} from '../../../src/cards/venusNext/AirScrappingExpedition';
import {Celestic} from '../../../src/cards/venusNext/Celestic';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';

describe('AirScrappingExpedition', function() {
  it('Should play', function() {
    const card = new AirScrappingExpedition();
    const corp = new Celestic();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, redPlayer], player);
    player.setCorporationForTest(corp);


    const selectCard = card.play(player) as SelectCard<ICard>;
    expect(selectCard).is.not.undefined;
    expect(selectCard instanceof SelectCard).is.true;

    selectCard.cb([selectCard.cards[0]]);
    expect(corp.resourceCount).to.eq(3);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
