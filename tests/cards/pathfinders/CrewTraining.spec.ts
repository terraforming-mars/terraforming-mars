import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {CrewTraining} from '../../../src/server/cards/pathfinders/CrewTraining';
import {Game} from '../../../src/server/Game';
import {Tag} from '../../../src/common/cards/Tag';
import {TestPlayer} from '../../TestPlayer';
import {DeclareCloneTag} from '../../../src/server/pathfinders/DeclareCloneTag';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {cast} from '../../TestingUtils';

describe('CrewTraining', function() {
  let card: CrewTraining;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new CrewTraining();
    game = newTestGame(1, {pathfindersExpansion: true});
    player = getTestPlayer(game, 0);
  });

  it('Should play', function() {
    expect(player.getTerraformRating()).eq(14);
    expect(card.tags).deep.eq([Tag.CLONE, Tag.CLONE]);

    card.play(player);

    expect(player.getTerraformRating()).eq(16);

    expect(game.deferredActions.length).eq(1);
    const action = cast(game.deferredActions.pop(), DeclareCloneTag);
    const options = cast(action.execute(), OrOptions);

    expect(options.options[0].title).to.match(/earth/);
    expect(game.pathfindersData).deep.eq({
      venus: -1,
      earth: 0,
      mars: 0,
      jovian: 0,
      moon: -1,
      vps: [],
    });

    options.options[0].cb();

    expect(game.pathfindersData).deep.eq({
      venus: -1,
      earth: 2,
      mars: 0,
      jovian: 0,
      moon: -1,
      vps: [],
    });
    expect(card.tags).deep.eq([Tag.EARTH, Tag.EARTH]);
  });
});
