import {expect} from 'chai';
import {SuitableInfrastructure} from '../../../src/server/cards/prelude2/SuitableInfrastructure';
import {testGame} from '../../TestGame';
import {IPlayer} from '../../../src/server/IPlayer';
import {Resource} from '../../../src/common/Resource';
import {PowerPlantStandardProject} from '../../../src/server/cards/base/standardProjects/PowerPlantStandardProject';
import {cast, runAllActions} from '../../TestingUtils';
import {SaturnSystems} from '../../../src/server/cards/corporation/SaturnSystems';
import {JovianLanterns} from '../../../src/server/cards/colonies/JovianLanterns';

function simulateFinishingAction(player: IPlayer) {
  player.actionsTakenThisGame++;
  player.actionsTakenThisRound++;
}

describe('SuitableInfrastructure', () => {
  it('effect', () => {
    const card = new SuitableInfrastructure();
    const [/* game */, player] = testGame(1);

    player.playedCards.push(card);

    expect(player.stock.megacredits).eq(0);
    player.production.add(Resource.ENERGY, 1);
    expect(player.stock.megacredits).eq(2);
    player.production.add(Resource.ENERGY, 1);
    expect(player.stock.megacredits).eq(2);

    simulateFinishingAction(player);

    player.production.add(Resource.ENERGY, 1);
    expect(player.stock.megacredits).eq(4);
    player.production.add(Resource.ENERGY, 1);
    expect(player.stock.megacredits).eq(4);

    simulateFinishingAction(player);
  });

  it('works with Power Plant standard project', () => {
    const card = new SuitableInfrastructure();
    const [game, player] = testGame(1);

    player.playedCards.push(card);
    player.megaCredits = 11;
    cast(new PowerPlantStandardProject().action(player), undefined);
    runAllActions(game);

    expect(player.stock.megacredits).eq(2);

    simulateFinishingAction(player);

    expect(player.stock.megacredits).eq(2);
  });

  it('Does not reward when other player has an action that rewards you.', () => {
    const card = new SuitableInfrastructure();
    const [game, player, player2] = testGame(2);

    const saturnSystems = new SaturnSystems();
    player.playedCards.push(card);
    // Gain 1 MC prouduction when anybody plays a card with a jovian tag.
    player.corporations.push(saturnSystems);
    const jovianLanterns = new JovianLanterns();

    game.activePlayer = player2.id;
    saturnSystems.onCardPlayed(player2, jovianLanterns);
    expect(player.stock.megacredits).eq(0);

    game.activePlayer = player.id;
    saturnSystems.onCardPlayed(player2, jovianLanterns);
    expect(player.stock.megacredits).eq(2);
  });
});
