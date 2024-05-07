import {expect} from 'chai';
import {RecklessDetonation} from '../../../src/server/cards/underworld/RecklessDetonation';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {assertIsExcavationAction} from '../../underworld/underworldAssertions';

describe('RecklessDetonation', () => {
  it('can play', () => {
    const card = new RecklessDetonation();
    const [/* game */, player] = testGame(2);
    player.underworldData.corruption = 1;

    expect(card.canPlay(player)).is.false;

    player.underworldData.corruption = 2;

    expect(card.canPlay(player)).is.true;
  });

  it('Should play', function() {
    const card = new RecklessDetonation();
    const [game, player, player2] = testGame(2, {underworldExpansion: true});
    player2.titanium = 3;
    player2.steel = 4;

    const orOptions = cast(card.play(player), OrOptions);

    expect(orOptions.options).has.lengthOf(3);

    orOptions.options[0].cb();
    expect(player2.titanium).to.eq(1);

    orOptions.options[1].cb();
    expect(player2.steel).to.eq(1);

    runAllActions(game);
    assertIsExcavationAction(player, player.popWaitingFor());
  });
});
