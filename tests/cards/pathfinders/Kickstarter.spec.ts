import {expect} from 'chai';
import {Kickstarter} from '../../../src/cards/pathfinders/Kickstarter';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {Game} from '../../../src/Game';
import {DeclareCloneTag} from '../../../src/pathfinders/DeclareCloneTag';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Tags} from '../../../src/common/cards/Tags';

describe('Kickstarter', function() {
  let card: Kickstarter;
  let game: Game;
  let player: TestPlayer;

  beforeEach(function() {
    card = new Kickstarter();
    game = newTestGame(1, {pathfindersExpansion: true});
    player = getTestPlayer(game, 0);
  });

  it('play', () => {
    expect(card.tags).deep.eq([Tags.CLONE]);

    card.play(player);

    expect(game.deferredActions.length).eq(1);

    const action = game.deferredActions.pop();
    expect(action).instanceOf(DeclareCloneTag);
    const options = action!.execute() as OrOptions;

    expect(options.options[2].title).to.match(/mars/);
    expect(game.pathfindersData).deep.eq({
      venus: 0,
      earth: 0,
      mars: 0,
      jovian: 0,
      moon: -1,
      vps: [],
    });

    options.options[2].cb();

    expect(game.pathfindersData).deep.eq({
      venus: 0,
      earth: 0,
      mars: 3,
      jovian: 0,
      moon: -1,
      vps: [],
    });

    expect(card.tags).deep.eq([Tags.MARS]);
  });
});
