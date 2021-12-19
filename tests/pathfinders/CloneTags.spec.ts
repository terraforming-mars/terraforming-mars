import {expect} from 'chai';
import {TestPlayer} from '../TestPlayer';
import {getTestPlayer, newTestGame} from '../TestGame';
import {Tags} from '../../src/cards/Tags';
import {TestingUtils} from '../TestingUtils';
import {Game} from '../../src/Game';
import {CrewTraining} from '../../src/cards/pathfinders/CrewTraining';
import {MartianZoo} from '../../src/cards/colonies/MartianZoo';
import {DeclareCloneTag} from '../../src/pathfinders/DeclareCloneTag';
import {OrOptions} from '../../src/inputs/OrOptions';

describe('CloneTags', function() {
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    game = newTestGame(2, {
      pathfindersExpansion: true,
    });
    player = getTestPlayer(game, 0);
  });

  it('When playing a card with a clone tag, onCardPlayed uses resulting tag', () => {
    const crewTraining = new CrewTraining(); // Has two clone tags
    const martianZoo = new MartianZoo(); // When you play an Earth tag, place an animal here
    player.cardsInHand = [crewTraining];
    player.playedCards = [martianZoo];

    player.playCard(crewTraining);

    expect(martianZoo.resourceCount).eq(0);


    const action = TestingUtils.cast(DeclareCloneTag, game.deferredActions.pop());
    const options = TestingUtils.cast(OrOptions, action!.execute());

    expect(options.options[0].title).to.match(/earth/);

    options.options[0].cb();

    TestingUtils.runAllActions(game);

    expect(crewTraining.tags).deep.eq([Tags.EARTH, Tags.EARTH]);
    expect(martianZoo.resourceCount).eq(2);
  });
});
