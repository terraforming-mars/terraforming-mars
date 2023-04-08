import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {cast, forceGenerationEnd, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {SelectColony} from '../../../src/server/inputs/SelectColony';

import {Maria} from '../../../src/server/cards/ceos/Maria';
import {ColonyName} from '../../../src/common/colonies/ColonyName';
import {Venus} from '../../../src/server/cards/community/Venus';
import {Celestic} from '../../../src/server/cards/venusNext/Celestic';


describe('Maria', function() {
  let card: Maria;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Maria();
    [game, player, player2] = testGame(2, {ceoExtension: true, coloniesExtension: true});
  });

  it('Can act', function() {
    expect(card.canAct(player)).is.true;
  });

  it('Takes action generation 1', function() {
    const coloniesInPlay = game.colonies.length;
    const selectColony = cast(card.action(player), SelectColony);
    const builtColonyName = selectColony.colonies[0].name;
    selectColony.cb(selectColony.colonies[0]);
    expect(game.colonies.find((colony) => colony.name === builtColonyName)).is.not.undefined;
    expect(game.colonies.length).to.eq(coloniesInPlay + 1);
  });

  it('Takes action in Generation 4', function() {
    game.generation = 4;

    const selectColony = cast(card.action(player), SelectColony);
    expect(selectColony.colonies).has.length(4);
  });

  it('Takes action in Generation 99 - chooses Venus which cannot be activated', () => {
    [game, player, player2] = testGame(2, {ceoExtension: true, coloniesExtension: true, venusNextExtension: true});
    const selectColony = cast(card.action(player), SelectColony);
    expect(selectColony.colonies.length).eq(99);

    const selectColonyVenus = selectColony.colonies.findIndex((c) => c.name === ColonyName.VENUS);
    expect(selectColonyVenus).not.eq(-1); // Sanity to make sure it's a choice
    selectColony.cb(selectColony.colonies[selectColonyVenus]);
    expect(game.colonies.find((colony) => colony.name === ColonyName.IAPETUS_II)).is.not.undefined;
    const colonyIapetusII = game.colonies.findIndex((c) => c.name === ColonyName.VENUS);
    expect(game.colonies[colonyIapetusII].isActive).is.false;
  });

  it('Takes action in Generation 99 - chooses Venus, which is activated', () => {
    player2.setCorporationForTest(new Celestic());
    const venus = new Venus();
    game.discardedColonies.push(venus);
    const selectColony = cast(card.action(player), SelectColony);
    expect(selectColony?.colonies).contains(venus);
    selectColony?.cb(venus);
    expect(game.colonies).includes(venus);
    expect(venus.isActive).is.true;
  });

  it('Takes action in Generation 99 - chooses Iapetus II without Data cards', function() {
    card = new Maria();
    // [game, player] = testGame(2, {ceoExtension: true, coloniesExtension: true, pathfindersExpansion: true});

    game.generation = 99;
    const coloniesInPlay = game.colonies.length;

    const selectColony = cast(card.action(player), SelectColony);
    const selectColonyIapetuisII = selectColony.colonies.findIndex((c) => c.name === ColonyName.IAPETUS_II);
    expect(selectColonyIapetuisII).not.eq(-1); // Sanity to make sure it's a choice
    selectColony.cb(selectColony.colonies[selectColonyIapetuisII]);
    expect(game.colonies.find((colony) => colony.name === ColonyName.IAPETUS_II)).is.not.undefined;
    expect(game.colonies.length).to.eq(coloniesInPlay + 1);
    const colonyIapetusII = game.colonies.findIndex((c) => c.name === ColonyName.IAPETUS_II);
    expect(game.colonies[colonyIapetusII].isActive).is.false;
    expect(game.colonies[colonyIapetusII].colonies).eq(0);
  });

  it('Can only act once per game', function() {
    card.action(player);
    forceGenerationEnd(game);

    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
