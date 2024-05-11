import {expect} from 'chai';
import {Deepmining} from '../../../src/server/cards/underworld/Deepmining';
import {IGame} from '../../../src/server/IGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('Deepmining', function() {
  let card: Deepmining;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new Deepmining();
    [game, player] = testGame(2, {underworldExpansion: true});
  });

  it('Cannot play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  const playRuns = [
    {spaceBonus: SpaceBonus.STEEL, production: 'steel'},
    {spaceBonus: SpaceBonus.TITANIUM, production: 'titanium'},
  ] as const;
  for (const run of playRuns) {
    it('play ' + JSON.stringify(run), function() {
      for (const space of game.board.getAvailableSpacesOnLand(player)) {
        if (space.bonus.includes(run.spaceBonus)) {
          space.undergroundResources = 'card1';
        }
      }

      const action = cast(card.play(player), SelectSpace);
      const space = action.spaces.find((space) => space.bonus.includes(run.spaceBonus))!;

      player.cardsInHand = [];

      action.cb(space);
      runAllActions(game);

      expect(space.player).to.be.undefined;
      expect(space.tile).is.undefined;
      expect(player.production[run.production]).to.eq(1);
      expect(space.adjacency?.bonus).eq(undefined);
      expect(player.cardsInHand).to.have.length(1);
    });
  }
});
