import {expect} from 'chai';
import {PowerPlantStandardProject} from '../../../../src/server/cards/base/standardProjects/PowerPlantStandardProject';
import {TestPlayer} from '../../../TestPlayer';
import {StandardTechnology} from '../../../../src/server/cards/base/StandardTechnology';
import {testGame} from '../../../TestingUtils';
import {Payment} from '../../../../src/common/inputs/Payment';

describe('PowerPlantStandardProjects', () => {
  let card: PowerPlantStandardProject;
  let player: TestPlayer;

  beforeEach(() => {
    card = new PowerPlantStandardProject();
    [/* game */, player/* , player2 */] = testGame(2);
  });

  it('Should act', () => {
    player.megaCredits = 11;
    player.playedCards.push(new StandardTechnology());
    card.payAndExecute(player, Payment.of({megacredits: card.cost}));
    expect(player.production.energy).eq(1);
    expect(player.megaCredits).eq(3);
  });
});
