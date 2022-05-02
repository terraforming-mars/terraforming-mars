import {expect} from 'chai';

import {TestPlayer} from '../TestPlayer';
import {Game} from '../../src/Game';
import {newTestGame, getTestPlayer} from '../TestGame';
import {SelectHowToPayDeferred} from '../../src/deferredActions/SelectHowToPayDeferred';
import {HowToPay} from '../../src/common/inputs/HowToPay';
import {SoylentSeedlingSystems} from '../../src/cards/pathfinders/SoylentSeedlingSystems';
import {Biofuels} from '../../src/cards/prelude/Biofuels';
import {EcologyExperts} from '../../src/cards/prelude/EcologyExperts';

describe('SelectHowToPay', function() {
  let game: Game;
  let player: TestPlayer;

  beforeEach(() => {
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
    player.megaCredits = 10;
    player.steel = 10;
  });

  it('allows normal inputs', () => {
    cb(HowToPay.of({megaCredits: 5, steel: 3}), 11, {canUseSteel: true});
    expect(player.purse()).to.include({megacredits: 5, steel: 7});
    cb(HowToPay.of({megaCredits: 2}), 2, {canUseSteel: true});
    expect(player.purse()).to.include({megacredits: 3});
    cb(HowToPay.of({megaCredits: 2}), 2, {});
    expect(player.purse()).to.include({megacredits: 1});
  });

  it('doesn\'t double-spend seeds', () => {
    player.corporationCard = new SoylentSeedlingSystems();
    player.playCard(new Biofuels());
    player.playCard(new EcologyExperts());
    player.corporationCard.resourceCount = 10;
    cb(HowToPay.of({seeds: 1}), 5, {canUseSeeds: true});
    expect(player.corporationCard.resourceCount).eq(9);
  });

  it('rejects partial inputs', () => {
    expect(() => cb({megaCredits: 5}, 5, {canUseSteel: true}))
      .to.throw('Unable to parse HowToPay');
    expect(() => cb(HowToPay.of({megaCredits: 3}), 5, {canUseSteel: true}))
      .to.throw('You did not spend enough');
  });

  it('rejects negative inputs', () => {
    player.corporationCard = new SoylentSeedlingSystems();
    player.corporationCard.resourceCount = 10;
    expect(() => cb(HowToPay.of({megaCredits: -5, seeds: 10}), 5, {canUseSeeds: true}))
      .to.throw('You do not have that many');
  });

  it('rejects misoptioned inputs', () => {
    expect(() => cb({megaCredits: 5, steel: 3}, 14, {})).to.throw;
  });

  function cb(value: any, count: number, options: SelectHowToPayDeferred.Options) {
    const deferred = new SelectHowToPayDeferred(player, count, options);
    const action = deferred.execute();

    if (action === undefined) {
      expect(value).deep.eq(HowToPay.of({megaCredits: count}));
      return;
    }

    const input = JSON.stringify(value);
    player.runInput([[input]], action);
  }
});

