import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {ICard} from '../../../src/server/cards/ICard';
import {AirScrappingExpedition} from '../../../src/server/cards/venusNext/AirScrappingExpedition';
import {JetStreamMicroscrappers} from '../../../src/server/cards/venusNext/JetStreamMicroscrappers';
import {Celestic} from '../../../src/server/cards/venusNext/Celestic';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';

describe('AirScrappingExpedition', function() {
  it('No cards', function() {
    const card = new AirScrappingExpedition();
    const game = newTestGame(2);
    const player = getTestPlayer(game, 0);

    expect(card.play(player)).is.undefined;

    expect(game.getVenusScaleLevel()).to.eq(2);
  });

  it('One option', function() {
    const card = new AirScrappingExpedition();
    const corp = new Celestic(); // Stores floaters, has Venus tag.
    const game = newTestGame(2);
    const player = getTestPlayer(game, 0);
    player.setCorporationForTest(corp);

    expect(card.play(player)).is.undefined;

    expect(corp.resourceCount).to.eq(3);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });

  it('Play, multiple cards.', function() {
    const card = new AirScrappingExpedition();
    const celestic = new Celestic(); // Stores floaters. has Venus tag
    const jsr = new JetStreamMicroscrappers(); // Stores floaters, has Venus tag.
    const game = newTestGame(2);
    const player = getTestPlayer(game, 0);
    player.setCorporationForTest(celestic);
    player.playedCards.push(jsr);

    const selectCard = cast(card.play(player), SelectCard<ICard>);

    selectCard.cb([selectCard.cards[0]]);
    expect(celestic.resourceCount).to.eq(3);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
