import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {CrewTraining} from '../../../src/cards/pathfinders/CrewTraining';
import {Game} from '../../../src/Game';
import {Tags} from '../../../src/cards/Tags';
import {TestPlayer} from '../../TestPlayer';
import {DeclareCloneTag} from '../../../src/pathfinders/DeclareCloneTag';
import {OrOptions} from '../../../src/inputs/OrOptions';

describe('CrewTraining', function() {
  let card: CrewTraining;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new CrewTraining();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });

  it('Should play', function() {
    expect(player.getTerraformRating()).eq(14);
    expect(card.tags).deep.eq([Tags.CLONE, Tags.CLONE]);

    card.play(player);

    expect(player.getTerraformRating()).eq(16);

    expect(game.deferredActions.length).eq(1);
    const action = game.deferredActions.pop();
    expect(action).instanceOf(DeclareCloneTag);
    const options = action!.execute() as OrOptions;
    expect(() => options.options[0].cb()).to.throw(/Not implemented/);
    expect(card.tags).deep.eq([Tags.EARTH, Tags.EARTH]);
  });
});
