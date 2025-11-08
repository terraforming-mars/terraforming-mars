import {expect} from 'chai';
import {PowerPlantStandardProject} from '../../../../src/server/cards/base/standardProjects/PowerPlantStandardProject';
import {TestPlayer} from '../../../TestPlayer';
import {IGame} from '../../../../src/server/IGame';
import {StandardTechnology} from '../../../../src/server/cards/base/StandardTechnology';
import {testGame} from '../../../TestingUtils';

describe('PowerPlantStandardProjects', () => {
  let card: PowerPlantStandardProject;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new PowerPlantStandardProject();
    [game, player/* , player2 */] = testGame(2);
  });

  it('Should act', () => {
    player.megaCredits = 11;
    player.playedCards.push(new StandardTechnology());
    expect(game.deferredActions).has.length(0);
    card.action(player);
    expect(game.deferredActions).has.length(1);
    expect(player.megaCredits).eq(11);
    game.deferredActions.runNext();
    expect(player.production.energy).eq(1);
    expect(player.megaCredits).eq(3);
  });
});
