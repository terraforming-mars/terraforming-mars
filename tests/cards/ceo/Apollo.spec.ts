import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {forceGenerationEnd} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {Apollo} from '../../../src/server/cards/ceos/Apollo';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';

describe('Apollo', () => {
  let card: Apollo;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;
  let moonData: MoonData;

  beforeEach(() => {
    card = new Apollo();
    [game, player, player2] = testGame(4, {ceoExtension: true, moonExpansion: true});
    moonData = MoonExpansion.moonData(game);
  });

  it('Can only act once per game', () => {
    card.action(player);
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });

  it('Takes action: Gains 3 M€ for each Moon tile', () => {
    const spaces = moonData.moon.getAvailableSpacesOnLand(player);
    MoonExpansion.addHabitatTile(player, spaces[0].id);
    MoonExpansion.addMineTile(player2, spaces[1].id);
    MoonExpansion.addRoadTile(player2, spaces[2].id);

    card.action(player);
    expect(player.megaCredits).eq(9);
  });
});
