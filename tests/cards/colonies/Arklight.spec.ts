import {expect} from 'chai';
import {Predators} from '../../../src/server/cards/base/Predators';
import {Arklight} from '../../../src/server/cards/colonies/Arklight';
import {cast, runAllActions, testGame} from '../../TestingUtils';
import {EcoLine} from '../../../src/server/cards/corporation/EcoLine';

describe('Arklight', () => {
  it('Should play', () => {
    const card = new Arklight();
    const [game, player/* , player2 */] = testGame(2);
    cast(card.play(player), undefined);
    player.corporations.push(card);
    runAllActions(game);

    expect(card.resourceCount).to.eq(1);

    card.onCardPlayed(player, new Predators());

    expect(card.resourceCount).to.eq(2);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });

  it('Compatible with Merger', () => {
    const card = new Arklight();
    const [game, player/* , player2 */] = testGame(2);
    player.corporations.push(card);
    runAllActions(game);

    card.resourceCount = 0;

    player.playAdditionalCorporationCard(new EcoLine());

    expect(card.resourceCount).to.eq(1);
  });
});
