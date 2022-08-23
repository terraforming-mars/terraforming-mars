import {expect} from 'chai';
import {PrefabricationofHumanHabitats} from '../../../src/server/cards/pathfinders/PrefabricationofHumanHabitats';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {ImmigrantCity} from '../../../src/server/cards/base/ImmigrantCity';
import {CityStandardProject} from '../../../src/server/cards/base/standardProjects/CityStandardProject';

describe('PrefabricationofHumanHabitats', function() {
  let card: PrefabricationofHumanHabitats;
  let player: TestPlayer;

  beforeEach(function() {
    card = new PrefabricationofHumanHabitats();
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
    player.playedCards.push(card);
  });

  it('canPlay', function() {
    expect(player.canPlayIgnoringCost(card)).is.false;

    player.production.override({steel: 0});
    expect(player.canPlayIgnoringCost(card)).is.false;

    player.production.override({steel: 1});
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('City tag discount ', function() {
    const immigrantCity = new ImmigrantCity();
    expect(card.getCardDiscount(player, immigrantCity)).eq(2);
  });

  it('City standard project discount ', function() {
    const cityStandardProject = new CityStandardProject();

    player.megaCredits = 23;
    player.playedCards.pop();
    expect(cityStandardProject.canAct(player)).is.false;

    player.playedCards.push(card);
    expect(cityStandardProject.canAct(player)).is.true;
  });

  it('Can pay for city standard project with steel ', function() {
    const cityStandardProject = new CityStandardProject();

    player.megaCredits = 19;
    player.playedCards.push(card);

    player.steel = 1;
    expect(cityStandardProject.canAct(player)).is.false;

    player.steel = 2;
    expect(cityStandardProject.canAct(player)).is.true;
  });
});
