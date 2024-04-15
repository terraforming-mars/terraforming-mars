import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {cast, forceGenerationEnd, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {SelectColony} from '../../../src/server/inputs/SelectColony';

import {Maria} from '../../../src/server/cards/ceos/Maria';
import {Venus} from '../../../src/server/cards/community/Venus';
import {Celestic} from '../../../src/server/cards/venusNext/Celestic';
import {IapetusII} from '../../../src/server/cards/pathfinders/IapetusII';
import {CollegiumCopernicus} from '../../../src/server/cards/pathfinders/CollegiumCopernicus';


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
    cast(card.action(player), undefined);
    runAllActions(player.game);
    const selectColony = cast(player.popWaitingFor(), SelectColony);
    const selectedColony = selectColony.colonies[0];
    selectColony.cb(selectedColony);
    expect(game.colonies).to.contain(selectedColony);
    expect(game.colonies.length).to.eq(coloniesInPlay + 1);
  });

  it('Takes action in Generation 4', function() {
    game.generation = 4;

    cast(card.action(player), undefined);
    runAllActions(player.game);
    const selectColony = cast(player.popWaitingFor(), SelectColony);
    expect(selectColony.colonies).has.length(4);
  });

  it('Takes action - chooses Venus which cannot be activated', () => {
    const venus = new Venus();
    game.discardedColonies = [];
    game.discardedColonies.push(venus);
    cast(card.action(player), undefined);
    runAllActions(player.game);
    const selectColony = cast(player.popWaitingFor(), SelectColony);
    selectColony?.cb(venus);

    expect(game.colonies).includes(venus);
    expect(venus.isActive).is.false;
    expect(venus.colonies).is.empty;
  });

  it('Takes action - chooses Venus, which is activated', () => {
    player2.setCorporationForTest(new Celestic());
    const venus = new Venus();
    game.discardedColonies = [];
    game.discardedColonies.push(venus);
    cast(card.action(player), undefined);
    runAllActions(player.game);
    const selectColony = cast(player.popWaitingFor(), SelectColony);
    selectColony?.cb(venus);

    expect(game.colonies).includes(venus);
    expect(venus.isActive).is.true;
    expect(venus.colonies).is.not.empty;
  });

  it('Takes action - chooses Ieptus II, which is not activated', () => {
    const iapetusii = new IapetusII();
    game.discardedColonies = [];
    game.discardedColonies.push(iapetusii);
    cast(card.action(player), undefined);
    runAllActions(player.game);
    const selectColony = cast(player.popWaitingFor(), SelectColony);
    selectColony?.cb(iapetusii);

    expect(game.colonies).includes(iapetusii);
    expect(iapetusii.isActive).is.false;
    expect(iapetusii.colonies).is.empty;
  });

  it('Takes action - chooses Ieptus II, which is activated', () => {
    player2.setCorporationForTest(new CollegiumCopernicus());
    const iapetusii = new IapetusII();
    game.discardedColonies = [];
    game.discardedColonies.push(iapetusii);
    cast(card.action(player), undefined);
    runAllActions(player.game);
    const selectColony = cast(player.popWaitingFor(), SelectColony);
    selectColony?.cb(iapetusii);

    expect(game.colonies).includes(iapetusii);
    expect(iapetusii.isActive).is.true;
    expect(iapetusii.colonies).is.not.empty;
  });

  it('Can only act once per game', function() {
    card.action(player);
    forceGenerationEnd(game);

    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
