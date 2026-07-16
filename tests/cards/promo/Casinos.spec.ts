import {expect} from 'chai';
import {Casinos} from '../../../src/server/cards/promo/Casinos';
import {TestPlayer} from '../../TestPlayer';
import {Resource} from '../../../src/common/Resource';
import {addCity, cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('Casinos', () => {
  let card: Casinos;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(() => {
    card = new Casinos();
    [/* game */, player, player2] = testGame(2);
  });

  const canPlayRuns = [
    {myCity: false, otherCity: false, energyProduction: 0, expected: false},
    {myCity: true, otherCity: false, energyProduction: 0, expected: false},
    {myCity: false, otherCity: false, energyProduction: 0, expected: false},
    {myCity: false, otherCity: true, energyProduction: 1, expected: false},
    {myCity: true, otherCity: false, energyProduction: 1, expected: true},
  ] as const;
  for (const run of canPlayRuns) {
    it('canPlay ' + JSON.stringify(run), () => {
      if (run.myCity) {
        addCity(player);
      }
      if (run.otherCity) {
        addCity(player2);
      }
      player.production.add(Resource.ENERGY, run.energyProduction);
      expect(card.canPlay(player)).eq(run.expected);
    });
  }

  it('Should play', () => {
    player.production.add(Resource.ENERGY, 1);

    cast(card.play(player), undefined);
    runAllActions(player.game);

    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(4);
    cast(player.popWaitingFor(), undefined);
  });
});
