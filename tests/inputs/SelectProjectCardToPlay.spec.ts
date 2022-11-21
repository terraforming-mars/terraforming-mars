import {expect} from 'chai';
import {SelectProjectCardToPlay} from '../../src/server/inputs/SelectProjectCardToPlay';
import {AquiferPumping} from '../../src/server/cards/base/AquiferPumping';
import {IoMiningIndustries} from '../../src/server/cards/base/IoMiningIndustries';
import {TestPlayer} from '../TestPlayer';
import {IProjectCard} from '../../src/server/cards/IProjectCard';
import {CardName} from '../../src/common/cards/CardName';
import {Payment} from '../../src/common/inputs/Payment';
import {Game} from '../../src/server/Game';
import {getTestPlayer, newTestGame} from '../TestGame';

describe('SelectProjectCardToPlay', function() {
  let player: TestPlayer;
  let game: Game;
  let aquiferPumping: IProjectCard;
  let ioMiningIndustries: IProjectCard;
  let called: boolean;
  const cb = () => {
    called = true;
    return undefined;
  };

  beforeEach(() => {
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
    aquiferPumping = new AquiferPumping();
    ioMiningIndustries = new IoMiningIndustries();
    called = false;
  });

  it('Simple', function() {
    const selectProjectCardToPlay = new SelectProjectCardToPlay(
      player,
      [aquiferPumping, ioMiningIndustries],
      {cb},
    );

    expect(() => selectProjectCardToPlay.process({
      type: 'projectCard',
      card: CardName.AQUIFER_PUMPING,
      payment: Payment.of({}),
    })).to.throw(/Did not spend enough to pay for card/);

    expect(() => selectProjectCardToPlay.process({
      type: 'projectCard',
      card: CardName.AQUIFER_PUMPING,
      payment: Payment.of({megaCredits: 18}),
    })).to.throw(/You do not have that many resources to spend/);

    player.megaCredits = 20;
    expect(called).is.false;
    expect(player.playedCards).is.empty;
    selectProjectCardToPlay.process({
      type: 'projectCard',
      card: CardName.AQUIFER_PUMPING,
      payment: Payment.of({megaCredits: 18}),
    });
    expect(called).is.true;
    expect(player.megaCredits).eq(2);
    expect(player.playedCards.map((c) => c.name)).deep.eq([CardName.AQUIFER_PUMPING]);
  });
});
