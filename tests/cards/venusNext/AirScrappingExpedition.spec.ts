import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {ICard} from '../../../src/server/cards/ICard';
import {AirScrappingExpedition} from '../../../src/server/cards/venusNext/AirScrappingExpedition';
import {Celestic} from '../../../src/server/cards/venusNext/Celestic';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';

describe('AirScrappingExpedition', function() {
  it('Should play', function() {
    const card = new AirScrappingExpedition();
    const corp = new Celestic();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, redPlayer], player);
    player.setCorporationForTest(corp);

    const selectCard = cast(card.play(player), SelectCard<ICard>);

    selectCard.cb([selectCard.cards[0]]);
    expect(corp.resourceCount).to.eq(3);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
