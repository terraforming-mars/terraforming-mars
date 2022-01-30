import {LobbyHalls} from '../../src/cards/pathfinders/LobbyHalls';
import {expect} from 'chai';
import {DeclareCloneTag} from '../../src/pathfinders/DeclareCloneTag';
import {Tags} from '../../src/common/cards/Tags';
import {OrOptions} from '../../src/inputs/OrOptions';
import {SelectOption} from '../../src/inputs/SelectOption';
import {TestPlayer} from '../../tests/TestPlayer';
import {getTestPlayer, newTestGame} from '../../tests/TestGame';
import {TestingUtils} from '../TestingUtils';
import {Game} from '../../src/Game';
import {CrewTraining} from '../../src/cards/pathfinders/CrewTraining';
import {MartianZoo} from '../../src/cards/colonies/MartianZoo';

describe('DeclareCloneTag', function() {
  let player: TestPlayer;
  let game: Game;
  let card: LobbyHalls;
  let tag: Tags;

  beforeEach(function() {
    game = newTestGame(1);
    card = new LobbyHalls();
    player = getTestPlayer(game, 0);
  });

  it('sanity', function() {
    const action = new DeclareCloneTag(player, card, (t) => tag = t);

    const options = action.execute();
    expect(options).instanceOf(OrOptions);
    const orOptions = options.options as Array<SelectOption>;

    expect(orOptions).has.length(3);
    expect(card.cloneTag).eq(Tags.CLONE);

    orOptions[0].cb();
    expect(card.cloneTag).eq(Tags.EARTH);
    expect(tag).eq(Tags.EARTH);

    orOptions[1].cb();
    expect(card.cloneTag).eq(Tags.JOVIAN);
    expect(tag).eq(Tags.JOVIAN);

    orOptions[2].cb();
    expect(card.cloneTag).eq(Tags.MARS);
    expect(tag).eq(Tags.MARS);
  });

  it('clone tag with expansions', function() {
    const game = newTestGame(1, {venusNextExtension: true, moonExpansion: true});
    player = getTestPlayer(game, 0);

    const action = new DeclareCloneTag(player, card, (t) => tag = t);

    const options = action.execute();
    const orOptions = options.options as Array<SelectOption>;

    expect(orOptions).has.length(5);

    orOptions[3].cb();
    expect(card.cloneTag).eq(Tags.VENUS);
    expect(tag).eq(Tags.VENUS);

    orOptions[4].cb();
    expect(card.cloneTag).eq(Tags.MOON);
    expect(tag).eq(Tags.MOON);
  });


  it('When playing a card with a clone tag, onCardPlayed uses resulting tag', () => {
    const crewTraining = new CrewTraining(); // Has two clone tags
    const martianZoo = new MartianZoo(); // When you play an Earth tag, place an animal here
    player.cardsInHand = [crewTraining];
    player.playedCards = [martianZoo];

    player.playCard(crewTraining);

    expect(martianZoo.resourceCount).eq(0);


    const action = TestingUtils.cast(game.deferredActions.pop(), DeclareCloneTag);
    const options = TestingUtils.cast(action!.execute(), OrOptions);

    expect(options.options[0].title).to.match(/earth/);

    options.options[0].cb();

    TestingUtils.runAllActions(game);

    expect(crewTraining.tags).deep.eq([Tags.EARTH, Tags.EARTH]);
    expect(martianZoo.resourceCount).eq(2);
  });
});
