import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {DeclareCloneTag} from '../../../src/server/pathfinders/DeclareCloneTag';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Tag} from '../../../src/common/cards/Tag';
import {Shara} from '../../../src/server/cards/ceos/Shara';


describe('Shara', function() {
  let card: Shara;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Shara();
    [game, player] = testGame(2, {ceoExtension: true, pathfindersExpansion: true});
  });

  it('Can act', function() {
    expect(card.canAct(player)).is.true;
  });

  it('Activate for Mars on Generation 6', function() {
    player.playedCards.push(card);
    player.megaCredits = 12;
    game.generation = 6;

    card.action(player);

    expect(game.deferredActions.length).eq(1);

    const action = cast(game.deferredActions.pop(), DeclareCloneTag);
    const options = cast(action.execute(), OrOptions);

    expect(options.options[1].title).to.match(/mars/);
    expect(game.pathfindersData).deep.eq({
      venus: -1,
      earth: 0,
      mars: 0,
      jovian: 0,
      moon: -1,
      vps: [],
    });
    options.options[1].cb();
    expect(game.pathfindersData).deep.eq({
      venus: -1,
      earth: 0,
      mars: 2,
      jovian: 0,
      moon: -1,
      vps: [],
    });

    expect(player.megaCredits).eq(12+2);
    expect(card.tags).deep.eq([Tag.MARS, Tag.MARS]);
  });
});
