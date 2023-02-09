import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {ICard} from '../../../src/server/cards/ICard';
import {AirScrappingExpedition} from '../../../src/server/cards/venusNext/AirScrappingExpedition';
import {Celestic} from '../../../src/server/cards/venusNext/Celestic';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';

describe('AirScrappingExpedition', function() {
  it('Should play', function() {
    const card = new AirScrappingExpedition();
    const corp = new Celestic();
    const game = newTestGame(2);
    const player = getTestPlayer(game, 0);
    player.setCorporationForTest(corp);

    const selectCard = cast(card.play(player), SelectCard<ICard>);

    selectCard.cb([selectCard.cards[0]]);
    expect(corp.resourceCount).to.eq(3);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
