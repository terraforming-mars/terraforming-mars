import {expect} from 'chai';
import {Hotsprings} from '../../../src/server/cards/community/Hotsprings';
import {Resource} from '../../../src/common/Resource';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Hotsprings', () => {
  let card: Hotsprings;
  let player: TestPlayer;

  beforeEach(() => {
    card = new Hotsprings();
    [/* game */, player] = testGame(1);
    player.playedCards.push(card);
  });

  it('starts with 48 M€ and 5 heat', () => {
    card.play(player);

    expect(player.heat).to.eq(5);
  });

  for (const run of [
    {heatProduction: 0, expected: false},
    {heatProduction: 1, expected: true},
    {heatProduction: 2, expected: true},
    {heatProduction: -1, expected: false},
  ] as const) {
    it('canAct is false when heat production has not increased', () => {
      player.production.add(Resource.HEAT, run.heatProduction);

      expect(card.canAct(player)).eq(run.expected);
    });
  }

  it('gains 1 M€ production when heat production is raised 1 step', () => {
    player.production.add(Resource.HEAT, 1);
    card.action(player);

    expect(player.production.megacredits).to.eq(1);
  });

  it('gains 2 M€ production when heat production is raised more than 1 step', () => {
    player.production.add(Resource.HEAT, 2);
    card.action(player);

    expect(player.production.megacredits).to.eq(2);
  });

  it('disregards drops in production', () => {
    player.production.add(Resource.HEAT, 1);

    expect(player.production.heat).to.eq(1);
    expect(card.canAct(player)).is.true;

    player.production.add(Resource.HEAT, -1);

    expect(player.production.heat).to.eq(0);
    expect(card.canAct(player)).is.true;
  });

  it('accumulates heat production increases within the same generation', () => {
    player.production.add(Resource.HEAT, 1);
    player.production.add(Resource.HEAT, 1);
    card.action(player);

    expect(player.production.megacredits).to.eq(2);
  });

  it('resets the counter during the production phase', () => {
    player.production.add(Resource.HEAT, 1);

    expect(card.canAct(player)).is.true;

    card.onProductionPhase(player);

    expect(card.canAct(player)).is.false;
  });
});
