import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {cast, forceGenerationEnd, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {SelectColony} from '../../../src/server/inputs/SelectColony';

import {Maria} from '../../../src/server/cards/ceos/Maria';
import {Titan} from '../../../src/server/colonies/Titan';
import {AerialMappers} from '../../../src/server/cards/venusNext/AerialMappers';

// import {ColonyName} from '../../../src/common/colonies/ColonyName';

describe('Maria', function() {
  let card: Maria;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Maria();
    game = newTestGame(1, {ceoExtension: true, coloniesExtension: true});
    player = getTestPlayer(game, 0);
  });

  it('Can act', function() {
    expect(card.canAct(player)).is.true;
  });

  it('Takes action generation 6', function() {
    game.generation = 6;
    const coloniesInPlay = game.colonies.length;
    const selectColony = cast(card.action(player), SelectColony);
    expect(selectColony.colonies).has.length(game.generation);
    selectColony.cb(selectColony.colonies[0]);
    expect(game.colonies.length).is.eq(coloniesInPlay+1);

    // Can only take OPG action OPG.
    game.deferredActions.runAll(() => {});
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });

  it('Takes action, chooses Colony it cannot build on', function() {
    // Stack the colony discard pile so we get a predictable list of colonies
    const titan = new Titan();
    game.discardedColonies[0] = titan;
    const selectColony = cast(card.action(player), SelectColony);
    expect(selectColony.colonies[0].name).eq('Titan');
    selectColony.cb(selectColony.colonies[0]); // 0 is Titan
    expect(game.colonies[0].name).eq('Titan');
    expect(game.colonies[0].isActive).eq(false);
  });

  it('Takes action, chooses Colony and gets the benefit', function() {
    const aerialmappers = new AerialMappers();
    // Stack the colony discard pile so we get a predictable list of colonies
    const titan = new Titan();
    game.discardedColonies[0] = titan;
    const selectColony = cast(card.action(player), SelectColony);
    expect(selectColony.colonies[0].name).eq('Titan');
    selectColony.cb(selectColony.colonies[0]); // 0 is Titan
    expect(game.colonies[0].name).eq('Titan');
    expect(game.colonies[0].isActive).eq(false);
    player.playCard(aerialmappers);
    expect(game.colonies[0].isActive).eq(true);
  });
});
