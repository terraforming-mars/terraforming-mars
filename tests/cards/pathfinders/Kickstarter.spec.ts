import {expect} from 'chai';
import {Kickstarter} from '../../../src/cards/pathfinders/Kickstarter';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {Game} from '../../../src/Game';
import {DeclareCloneTag} from '../../../src/pathfinders/DeclareCloneTag';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Tags} from '../../../src/cards/Tags';

describe('Kickstarter', function() {
  let card: Kickstarter;
  let game: Game;
  let player: TestPlayer;

  beforeEach(function() {
    card = new Kickstarter();
    game = newTestGame(1, {turmoilExtension: true});
    player = getTestPlayer(game, 0);
  });

  it('play', () => {
    expect(card.tags).deep.eq([Tags.CLONE]);

    card.play(player);

    expect(game.deferredActions.length).eq(1);

    const action = game.deferredActions.pop();
    expect(action).instanceOf(DeclareCloneTag);
    const options = action!.execute() as OrOptions;
    expect(() => options.options[0].cb()).to.throw(/Not implemented/);
    expect(card.tags).deep.eq([Tags.EARTH]);
  });
});
