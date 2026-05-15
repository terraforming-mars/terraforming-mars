import {expect} from 'chai';
import {SpacePortColony} from '../../../src/server/cards/colonies/SpacePortColony';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {ColonyName} from '../../../src/common/colonies/ColonyName';

describe('SpacePortColony', () => {
  let card: SpacePortColony;
  let player: TestPlayer;

  beforeEach(() => {
    card = new SpacePortColony();
    [/* game */, player] = testGame(2, {coloniesExtension: true, customColoniesList: [
      ColonyName.CERES,
      ColonyName.CALLISTO,
      ColonyName.ENCELADUS,
      ColonyName.EUROPA,
      ColonyName.GANYMEDE,
    ]});
  });

  it('getVictoryPoints', () => {
    expect(card.getVictoryPoints(player)).eq(0);

    player.game.colonies[0].colonies.push(player.id);
    expect(card.getVictoryPoints(player)).eq(0);

    player.game.colonies[0].colonies.push(player.id);
    expect(card.getVictoryPoints(player)).eq(1);

    player.game.colonies[1].colonies.push(player.id);
    expect(card.getVictoryPoints(player)).eq(1);

    player.game.colonies[1].colonies.push(player.id);
    expect(card.getVictoryPoints(player)).eq(2);

    // Counts colonies from all players, not just this one.
    player.game.colonies[2].colonies.push(player.opponents[0].id);
    expect(card.getVictoryPoints(player)).eq(2);

    player.game.colonies[2].colonies.push(player.opponents[0].id);
    expect(card.getVictoryPoints(player)).eq(3);
  });
});
