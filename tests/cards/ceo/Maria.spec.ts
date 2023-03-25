import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {cast, forceGenerationEnd} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {SelectColony} from '../../../src/server/inputs/SelectColony';

import {Maria} from '../../../src/server/cards/ceos/Maria';

describe('Maria', function() {
  let card: Maria;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Maria();
    [game, player] = testGame(1, {ceoExtension: true, coloniesExtension: true});
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


  it('Can only act once per game', function() {
    card.action(player);
    forceGenerationEnd(game);

    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
