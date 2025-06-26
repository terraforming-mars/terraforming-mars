import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {AdaptationTechnology} from '../../../src/server/cards/base/AdaptationTechnology';
import {OpenCity} from '../../../src/server/cards/base/OpenCity';
import {Resource} from '../../../src/common/Resource';
import {setOxygenLevel} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {GlobalParameter} from '../../../src/common/GlobalParameter';

describe('AdaptationTechnology', () => {
  let adaptationTechnology: AdaptationTechnology;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    adaptationTechnology = new AdaptationTechnology();
    [game, player] = testGame(2);
  });

  it('Should play', () => {
    expect(player.playCard(adaptationTechnology)).is.undefined;

    expect(adaptationTechnology.getVictoryPoints(player)).to.eq(1);
    expect(adaptationTechnology.getGlobalParameterRequirementBonus(player, GlobalParameter.TEMPERATURE)).to.eq(2);
  });

  it('Test against oxygen requirement', () => {
    const openCity = new OpenCity();
    player.megaCredits = openCity.cost;

    player.production.add(Resource.ENERGY, 1);

    setOxygenLevel(game, 8);
    expect(openCity.canPlay(player)).is.not.true;
    setOxygenLevel(game, 9);
    expect(openCity.canPlay(player)).is.not.true;
    setOxygenLevel(game, 10);
    expect(openCity.canPlay(player)).is.not.true;
    setOxygenLevel(game, 11);
    expect(openCity.canPlay(player)).is.not.true;
    setOxygenLevel(game, 12);
    expect(openCity.canPlay(player)).is.true;

    player.playedCards.push(adaptationTechnology);
    setOxygenLevel(game, 8);
    expect(openCity.canPlay(player)).is.not.true;
    setOxygenLevel(game, 9);
    expect(openCity.canPlay(player)).is.not.true;
    setOxygenLevel(game, 10);
    expect(openCity.canPlay(player)).is.true;
  });
});
