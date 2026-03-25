import {expect} from 'chai';
import {ExcavateStandardProject} from '../../../src/server/cards/underworld/ExcavateStandardProject';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Units} from '../../../src/common/Units';
import {UnderworldExpansion} from '../../../src/server/underworld/UnderworldExpansion';

describe('ExcavateStandardProject', () => {
  let game: IGame;
  let player: TestPlayer;
  let card: ExcavateStandardProject;

  beforeEach(() => {
    [game, player] = testGame(1, {underworldExpansion: true});
    card = new ExcavateStandardProject();
  });

  it('can play', () => {
    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    cast(card.play(player), undefined);
  });

  for (const run of [
    {mc: 6, steel: 0, expected: false},
    {mc: 7, steel: 0, expected: true},
    {mc: 2, steel: 2, expected: false},
    {mc: 3, steel: 2, expected: true},
  ] as const) {
    it('can act ' + JSON.stringify(run), () => {
      player.megaCredits = run.mc;
      player.steel = run.steel;
      expect(card.canAct(player)).eq(run.expected);
    });
  }

  it('can act, no excavatable spaces', () => {
    player.megaCredits = 7;
    for (const space of UnderworldExpansion.excavatableSpaces(player, {ignorePlacementRestrictions: true})) {
      space.excavator = player;
    }
    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    player.megaCredits = 7;

    card.action(player);
    runAllActions(game);

    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    const space = selectSpace.spaces[0];
    // Simplify the test by forcing the space to have an easy-to-manage-resource.
    space.undergroundResources = 'plant2';
    selectSpace.cb(space);

    expect(player.stock.asUnits()).deep.eq(Units.of({megacredits: 0, plants: 2}));
    expect(space.excavator).eq(player);

    runAllActions(game);

    expect(player.popWaitingFor()).is.undefined;
  });
});
