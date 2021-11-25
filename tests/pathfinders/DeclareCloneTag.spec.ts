import {LobbyHalls} from '../../src/cards/pathfinders/LobbyHalls';
import {expect} from 'chai';
import {DeclareCloneTag} from '../../src/pathfinders/DeclareCloneTag';
import {Tags} from '../../src//cards/Tags';
import {OrOptions} from '../../src//inputs/OrOptions';
import {SelectOption} from '../../src//inputs/SelectOption';
import {TestPlayer} from '../../tests/TestPlayer';
import {getTestPlayer, newTestGame} from '../../tests/TestGame';

describe('DeclareCloneTag', function() {
  let player: TestPlayer;
  let card: LobbyHalls;
  let tag: Tags;

  beforeEach(function() {
    const game = newTestGame(1);
    card = new LobbyHalls();
    player = getTestPlayer(game, 0);
  });

  it('sanity', function() {
    const action = new DeclareCloneTag(player, card, '', (t) => tag = t);

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

    const action = new DeclareCloneTag(player, card, '', (t) => tag = t);

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
});
