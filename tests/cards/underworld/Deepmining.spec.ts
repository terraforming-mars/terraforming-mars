import {expect} from 'chai';
import {Deepmining} from '../../../src/server/cards/underworld/Deepmining';
import {IGame} from '../../../src/server/IGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('Deepmining', () => {
  let card: Deepmining;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Deepmining();
    [game, player, player2] = testGame(2, {underworldExpansion: true});
  });

  it('Cannot play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  const playRuns = [
    {resourceToken: 'steel2', production: 'steel'},
    {resourceToken: 'titanium2', production: 'titanium'},
  ] as const;
  for (const run of playRuns) {
    it('play ' + JSON.stringify(run), () => {
      const [space, space2, space3] = game.board.getAvailableSpacesOnLand(player);
      space.undergroundResources = run.resourceToken;
      space2.undergroundResources = run.resourceToken;
      space3.undergroundResources = run.resourceToken;
      space3.excavator = player2;

      expect(card.canPlay(player)).is.true;

      const action = cast(card.play(player), SelectSpace);

      expect(action.spaces).deep.eq([space, space2]);

      action.cb(space);
      runAllActions(game);

      expect(space.player).to.be.undefined;
      expect(space.tile).is.undefined;
      expect(space.excavator?.id).eq(player.id);
      expect(player.production[run.production]).to.eq(1);
    });
  }
});
