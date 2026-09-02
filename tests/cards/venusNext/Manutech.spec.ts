import {expect} from 'chai';
import {PowerPlantStandardProject} from '../../../src/server/cards/base/standardProjects/PowerPlantStandardProject';
import {Manutech} from '../../../src/server/cards/venusNext/Manutech';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {Payment} from '../../../src/common/inputs/Payment';

describe('Manutech', () => {
  let card: Manutech;
  let player: TestPlayer;

  beforeEach(() => {
    card = new Manutech();
    [, player] = testGame(2);
    player.playedCards.push(card);
  });

  it('Should play', () => {
    card.play(player);
    expect(player.production.steel).to.eq(1);
    expect(player.steel).to.eq(1);
  });

  it('Should add energy resources by Power Plant standard project', () => {
    player.megaCredits = 11;
    new PowerPlantStandardProject().payAndExecute(player, Payment.of({megacredits: 11}));
    expect(player.energy).to.eq(1);
  });
});
