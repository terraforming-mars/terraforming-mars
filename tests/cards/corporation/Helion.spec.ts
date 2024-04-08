import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Helion} from '../../../src/server/cards/corporation/Helion';
import {TestPlayer} from '../../TestPlayer';
import {StormCraftIncorporated} from '../../../src/server/cards/colonies/StormCraftIncorporated';
import {cast} from '../../TestingUtils';

describe('Helion', function() {
  let card: Helion;
  let player: TestPlayer;

  beforeEach(function() {
    card = new Helion();
    [/* game */, player] = testGame(1);
  });

  it('Should play', function() {
    cast(card.play(player), undefined);
    expect(player.production.heat).to.eq(3);

    player.megaCredits = 3;
    expect(player.canAfford(5)).to.be.false;

    player.heat = 2;
    expect(player.canAfford(5)).to.be.true;
  });

  it('Merger with Helion, Stormcraft Incorporated', () => {
    const stormcraft = new StormCraftIncorporated();
    player.playCorporationCard(card);
    player.playAdditionalCorporationCard(stormcraft);

    player.heat = 4;
    player.megaCredits = 0;

    expect(player.availableHeat()).eq(4);
    expect(player.canAfford(10)).is.false;

    stormcraft.resourceCount = 3;

    expect(player.availableHeat()).eq(10);
    expect(player.canAfford(10)).is.true;
  });
});
