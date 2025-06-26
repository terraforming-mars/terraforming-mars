import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {ICard} from '../../../src/server/cards/ICard';
import {AirScrappingExpedition} from '../../../src/server/cards/venusNext/AirScrappingExpedition';
import {JetStreamMicroscrappers} from '../../../src/server/cards/venusNext/JetStreamMicroscrappers';
import {Celestic} from '../../../src/server/cards/venusNext/Celestic';
import {testGame} from '../../TestGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';

describe('AirScrappingExpedition', () => {
  it('No cards', () => {
    const card = new AirScrappingExpedition();
    const [game, player] = testGame(2);

    cast(card.play(player), undefined);

    expect(game.getVenusScaleLevel()).to.eq(2);
  });

  it('One option', () => {
    const card = new AirScrappingExpedition();
    const corp = new Celestic(); // Stores floaters, has Venus tag.
    const [game, player] = testGame(2);
    player.corporations.push(corp);

    cast(card.play(player), undefined);

    expect(corp.resourceCount).to.eq(3);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });

  it('Play, multiple cards.', () => {
    const card = new AirScrappingExpedition();
    const celestic = new Celestic(); // Stores floaters. has Venus tag
    const jsr = new JetStreamMicroscrappers(); // Stores floaters, has Venus tag.
    const [game, player] = testGame(2);
    player.corporations.push(celestic);
    player.playedCards.push(jsr);

    const selectCard = cast(card.play(player), SelectCard<ICard>);

    selectCard.cb([selectCard.cards[0]]);
    expect(celestic.resourceCount).to.eq(3);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
