import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {AdhaiHighOrbitConstructions} from '../../../src/server/cards/pathfinders/AdhaiHighOrbitConstructions';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {SearchForLife} from '../../../src/server/cards/base/SearchForLife';
import {Soletta} from '../../../src/server/cards/base/Soletta';
import {GanymedeColony} from '../../../src/server/cards/base/GanymedeColony';
import {PhobosSpaceHaven} from '../../../src/server/cards/base/PhobosSpaceHaven';
import {SolarWindPower} from '../../../src/server/cards/base/SolarWindPower';
import {BuildColonyStandardProject} from '../../../src/server/cards/colonies/BuildColonyStandardProject';
import {cast} from '../../TestingUtils';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {AndOptions} from '../../../src/server/inputs/AndOptions';

describe('AdhaiHighOrbitConstructions', function() {
  let game: Game;
  let player: TestPlayer;
  let card: AdhaiHighOrbitConstructions;

  beforeEach(function() {
    card = new AdhaiHighOrbitConstructions();
    game = newTestGame(1, {coloniesExtension: true});
    player = getTestPlayer(game, 0);
    player.setCorporationForTest(card);
  });

  it('onCardPlayed', function() {
    card.onCardPlayed(player, new SearchForLife()); // Science
    expect(card.resourceCount).eq(0);

    card.onCardPlayed(player, new Soletta()); // Space
    expect(card.resourceCount).eq(1);

    card.onCardPlayed(player, new GanymedeColony()); // Jovian, Space, City
    expect(card.resourceCount).eq(1);

    card.onCardPlayed(player, new PhobosSpaceHaven()); // Space, City
    expect(card.resourceCount).eq(2);

    card.onCardPlayed(player, new SolarWindPower()); // Science, Space, Power
    expect(card.resourceCount).eq(3);
  });

  it('project card discount', function() {
    card.resourceCount = 4;
    expect(card.getCardDiscount(player, new SearchForLife())).eq(0); // Science
    expect(card.getCardDiscount(player, new Soletta())).eq(2); // Space
    expect(card.getCardDiscount(player, new GanymedeColony())).eq(0); // Jovian, Space, City
    expect(card.getCardDiscount(player, new PhobosSpaceHaven())).eq(2); // Space, City
    expect(card.getCardDiscount(player, new SolarWindPower())).eq(2); // Science, Space, Power

    card.resourceCount = 5;
    expect(card.getCardDiscount(player, new SearchForLife())).eq(0); // Science
    expect(card.getCardDiscount(player, new Soletta())).eq(2); // Space
    expect(card.getCardDiscount(player, new GanymedeColony())).eq(0); // Jovian, Space, City
    expect(card.getCardDiscount(player, new PhobosSpaceHaven())).eq(2); // Space, City
    expect(card.getCardDiscount(player, new SolarWindPower())).eq(2); // Science, Space, Power

    card.resourceCount = 6;
    expect(card.getCardDiscount(player, new SearchForLife())).eq(0); // Science
    expect(card.getCardDiscount(player, new Soletta())).eq(3); // Space
    expect(card.getCardDiscount(player, new GanymedeColony())).eq(0); // Jovian, Space, City
    expect(card.getCardDiscount(player, new PhobosSpaceHaven())).eq(3); // Space, City
    expect(card.getCardDiscount(player, new SolarWindPower())).eq(3); // Science, Space, Power
  });

  it('standard colony project', function() {
    const colonyStandardProject = new BuildColonyStandardProject();

    player.megaCredits = 15;
    expect(colonyStandardProject.canAct(player)).is.false;

    card.resourceCount = 3;
    expect(colonyStandardProject.canAct(player)).is.false;

    card.resourceCount = 4;
    expect(colonyStandardProject.canAct(player)).is.true;
  });


  it('trade discount', function() {
    expect(player.colonies.coloniesTradeAction()).is.undefined;

    player.megaCredits = 8;
    expect(player.colonies.coloniesTradeAction()).is.undefined;

    card.resourceCount = 2;
    expect(player.colonies.coloniesTradeAction()).is.not.undefined;
    const tradeAction = cast(player.colonies.coloniesTradeAction(), AndOptions);
    const orOptions = cast(tradeAction.options[0], OrOptions);
    expect(orOptions.options).has.length(1);
    expect(orOptions.options[0].title).eq('Pay 8 M€');

    card.resourceCount = 4;
    const tradeAction2 = cast(player.colonies.coloniesTradeAction(), AndOptions);
    expect(cast(tradeAction2.options[0], OrOptions).options[0].title).eq('Pay 7 M€');

    card.resourceCount = 30;
    const tradeAction3 = cast(player.colonies.coloniesTradeAction(), AndOptions);
    expect(cast(tradeAction3.options[0], OrOptions).options[0].title).eq('Pay 0 M€');

    // This doesn't work with titanium
    card.resourceCount = 2;
    player.megaCredits = 0;
    player.titanium = 2;
    expect(player.colonies.coloniesTradeAction()).is.undefined;

    // This doesn't work with energy
    card.resourceCount = 2;
    player.titanium = 0;
    player.energy = 2;
    expect(player.colonies.coloniesTradeAction()).is.undefined;
  });
});
