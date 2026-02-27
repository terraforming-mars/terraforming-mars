import {expect} from 'chai';
import {Predators} from '../../../src/server/cards/base/Predators';
import {Arklight} from '../../../src/server/cards/colonies/Arklight';
import {runAllActions, testGame} from '../../TestingUtils';
import {EcoLine} from '../../../src/server/cards/corporation/EcoLine';
import {Bushes} from '../../../src/server/cards/base/Bushes';

describe('Arklight', () => {
  it('Should play', () => {
    const card = new Arklight();
    const [game, player/* , player2 */] = testGame(2);
    player.playCorporationCard(card);
    runAllActions(game);

    expect(card.resourceCount).to.eq(1);
    expect(player.production.megacredits).to.eq(1);

    player.playCard(new Predators());

    expect(card.resourceCount).to.eq(2);
    expect(player.production.megacredits).to.eq(2);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });

  it('Increases MC production for plant tags', () => {
    const card = new Arklight();
    const [game, player] = testGame(2);
    player.playCorporationCard(card);
    runAllActions(game);

    // 1 animal tag from playing Arklight itself
    expect(player.production.megacredits).to.eq(1);

    // Bushes has a plant tag
    player.playCard(new Bushes());

    expect(card.resourceCount).to.eq(2);
    expect(player.production.megacredits).to.eq(2);
  });

  it('Compatible with Merger', () => {
    const card = new Arklight();
    const [game, player/* , player2 */] = testGame(2);
    player.playCorporationCard(card);
    runAllActions(game);

    expect(card.resourceCount).to.eq(1);

    player.playCorporationCard(new EcoLine());

    expect(card.resourceCount).to.eq(2);
  });
});
