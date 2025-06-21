import {expect} from 'chai';
import {BuildColony} from '../../src/server/deferredActions/BuildColony';
import {TestPlayer} from '../TestPlayer';
import {cast} from '../TestingUtils';
import {testGame} from '../TestGame';
import {ColonyName} from '../../src/common/colonies/ColonyName';
import {SelectColony} from '../../src/server/inputs/SelectColony';
import {ColoniesHandler} from '../../src/server/colonies/ColoniesHandler';

describe('BuildColony', () => {
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;

  beforeEach(() => {
    [/* unused */, player, player2, player3] = testGame(3, {
      coloniesExtension: true,
      customColoniesList: [
        // The important thing is that Europa is absent.
        ColonyName.GANYMEDE,
        ColonyName.LUNA,
        ColonyName.PLUTO,
        ColonyName.TITAN,
        ColonyName.TRITON],
    });
  });

  it('simple', () => {
    const ganymede = ColoniesHandler.getColony(player.game, ColonyName.GANYMEDE);
    expect(ganymede.colonies).deep.eq([]);

    const buildColony = new BuildColony(player);
    const selectColony = cast(buildColony.execute(), SelectColony);
    const colonyName = selectColony.colonies[0].name;

    expect(colonyName).eq(ColonyName.GANYMEDE);

    selectColony.cb(selectColony.colonies[0]);

    expect(player.production.plants).eq(1);
    expect(ganymede.colonies).deep.eq([player.id]);
  });

  it('Does not allow duplicates by default', () => {
    const ganymede = ColoniesHandler.getColony(player.game, ColonyName.GANYMEDE);
    ganymede.colonies = [player.id];

    const buildColony = new BuildColony(player);
    const selectColony = cast(buildColony.execute(), SelectColony);

    expect(selectColony.colonies).does.not.include(ganymede);
  });

  it('Cannot play on full colonies', () => {
    const ganymede = ColoniesHandler.getColony(player.game, ColonyName.GANYMEDE);
    ganymede.colonies = [player2.id, player3.id, player2.id];

    const buildColony = new BuildColony(player);
    const selectColony = cast(buildColony.execute(), SelectColony);

    expect(selectColony.colonies).does.not.include(ganymede);
  });

  it('Cannot play on full colonies, even if duplicates are allowed', () => {
    const ganymede = ColoniesHandler.getColony(player.game, ColonyName.GANYMEDE);
    ganymede.colonies = [player2.id, player3.id, player2.id];

    const buildColony = new BuildColony(player, {allowDuplicate: true});
    const selectColony = cast(buildColony.execute(), SelectColony);

    expect(selectColony.colonies).does.not.include(ganymede);
  });

  it('allows duplicates', () => {
    const ganymede = ColoniesHandler.getColony(player.game, ColonyName.GANYMEDE);
    ganymede.colonies = [player.id];

    const buildColony = new BuildColony(player, {allowDuplicate: true});
    const selectColony = cast(buildColony.execute(), SelectColony);
    const colonyName = selectColony.colonies[0].name;

    expect(colonyName).eq(ColonyName.GANYMEDE);

    selectColony.cb(selectColony.colonies[0]);

    expect(player.production.plants).eq(1);
    expect(ganymede.colonies).deep.eq([player.id, player.id]);
  });
});
