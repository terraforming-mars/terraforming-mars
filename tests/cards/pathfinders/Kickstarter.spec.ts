import {expect} from 'chai';
import {Kickstarter} from '../../../src/server/cards/pathfinders/Kickstarter';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {Game} from '../../../src/server/Game';
import {DeclareCloneTag} from '../../../src/server/pathfinders/DeclareCloneTag';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Tag} from '../../../src/common/cards/Tag';
import {cast} from '../../TestingUtils';

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
    expect(card.tags).deep.eq([Tag.CLONE]);

    card.play(player);

    expect(game.deferredActions.length).eq(1);

    const action = cast(game.deferredActions.pop(), DeclareCloneTag);
    const options = cast(action.execute(), OrOptions);

    expect(options.options[2].title).to.match(/mars/);
    expect(game.pathfindersData).deep.eq({
      venus: -1,
      earth: 0,
      mars: 0,
      jovian: 0,
      moon: -1,
      vps: [],
    });

    options.options[2].cb();

    expect(game.pathfindersData).deep.eq({
      venus: -1,
      earth: 0,
      mars: 3,
      jovian: 0,
      moon: -1,
      vps: [],
    });

    expect(card.tags).deep.eq([Tag.MARS]);
  });
});
