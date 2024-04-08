import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {Fish} from '../../../src/server/cards/base/Fish';
import {LocalHeatTrapping} from '../../../src/server/cards/base/LocalHeatTrapping';
import {Pets} from '../../../src/server/cards/base/Pets';
import {Helion} from '../../../src/server/cards/corporation/Helion';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {StormCraftIncorporated} from '../../../src/server/cards/colonies/StormCraftIncorporated';

describe('LocalHeatTrapping', () => {
  let card: LocalHeatTrapping;
  let player: TestPlayer;
  let helion: Helion;

  beforeEach(() => {
    card = new LocalHeatTrapping();
    [/* game */, player] = testGame(2);
    helion = new Helion();
  });

  it('Cannot play without 5 heat', () => {
    player.megaCredits = card.cost;
    player.cardsInHand = [card];
    expect(player.canPlay(card)).is.false;
    player.heat = 4;
    expect(player.canPlay(card)).is.false;
    player.heat = 5;
    expect(player.canPlay(card)).is.true;
  });

  it('Should play - no animal targets', () => {
    player.megaCredits = card.cost;
    player.heat = 6;
    player.megaCredits = 1;
    player.cardsInHand = [card];

    expect(player.canPlay(card)).is.true;

    card.play(player);

    expect(player.plants).to.eq(4);
    expect(player.heat).to.eq(1);
  });

  it('Should play - single animal target', () => {
    player.heat = 5;
    const pets = new Pets();
    player.playedCards.push(card, pets);

    const orOptions = cast(card.play(player), OrOptions);

    orOptions.options[0].cb();
    expect(player.plants).to.eq(4);
    expect(player.heat).to.eq(0);

    orOptions.options[1].cb();
    expect(pets.resourceCount).to.eq(2);
  });

  it('Should play - multiple animal targets', () => {
    player.heat = 5;
    const pets = new Pets();
    const fish = new Fish();
    player.playedCards.push(card, pets, fish);

    const orOptions = cast(card.play(player), OrOptions);
    expect(player.heat).to.eq(0);
    orOptions.options[1].cb([fish]);
    expect(fish.resourceCount).to.eq(2);
  });

  it('Cannot play as Helion if not enough heat left after paying for card', () => {
    helion.play(player);
    player.setCorporationForTest(helion);

    player.megaCredits = 0;
    player.heat = 5; // have to pay for card with 1 heat
    player.cardsInHand = [card];
    expect(player.canPlay(card)).is.false;
    player.megaCredits = 1;
    expect(player.canPlay(card)).is.true;
  });

  it('Helion / Stormcraft merger canPlay', () => {
    const stormcraft = new StormCraftIncorporated();
    helion.play(player);
    player.setCorporationForTest(helion);
    player.corporations.push(stormcraft);
    player.cardsInHand = [card];

    function canPlay(config: {mc: number, heat: number, floaters: number, discount: number}) {
      player.megaCredits = config.mc;
      player.heat = config.heat;
      stormcraft.resourceCount = config.floaters;
      player.colonies.cardDiscount = config.discount;
      return player.canPlay(card);
    }

    // Thanks to Merger, canPlay has to solve these edge cases.
    // Case 1: Player has 5 heat and 1MC.
    // Case 2: 0 heat, 1 MC, and 3 Stormcraft resources
    // Case 3: 0 heat, 0 MC, and 3 Stormcraft resources
    // Case 4: 1 heat, 0 MC, and 3 Stormcraft resources
    // Case 5: 0 heat, 0 MC, 3 Stormcraft resources, and a 1MC card discount.

    expect(canPlay({mc: 1, heat: 5, floaters: 0, discount: 0})).is.true;
    expect(canPlay({mc: 1, heat: 0, floaters: 3, discount: 0})).is.true;
    expect(canPlay({mc: 0, heat: 0, floaters: 3, discount: 0})).is.false;
    expect(canPlay({mc: 0, heat: 0, floaters: 3, discount: 1})).is.true;
    expect(canPlay({mc: 0, heat: 6, floaters: 0, discount: 0})).is.true;
    expect(canPlay({mc: 0, heat: 4, floaters: 1, discount: 0})).is.true;
  });
});
