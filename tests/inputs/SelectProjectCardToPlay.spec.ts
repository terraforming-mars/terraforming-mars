import {expect} from 'chai';
import {SelectProjectCardToPlay} from '../../src/server/inputs/SelectProjectCardToPlay';
import {AquiferPumping} from '../../src/server/cards/base/AquiferPumping';
import {IoMiningIndustries} from '../../src/server/cards/base/IoMiningIndustries';
import {TestPlayer} from '../TestPlayer';
import {IProjectCard} from '../../src/server/cards/IProjectCard';
import {CardName} from '../../src/common/cards/CardName';
import {Payment} from '../../src/common/inputs/Payment';
import {testGame} from '../TestGame';

describe('SelectProjectCardToPlay', () => {
  let player: TestPlayer;
  let aquiferPumping: IProjectCard;
  let ioMiningIndustries: IProjectCard;
  let called: boolean;
  let selectProjectCardToPlay: SelectProjectCardToPlay;

  const cb = () => {
    called = true;
    return undefined;
  };

  beforeEach(() => {
    [/* game */, player] = testGame(1);
    aquiferPumping = new AquiferPumping();
    ioMiningIndustries = new IoMiningIndustries();
    called = false;
    selectProjectCardToPlay = new SelectProjectCardToPlay(
      player,
      [aquiferPumping, ioMiningIndustries],
    ).andThen(cb);
  });

  it('Did not pay enough', () => {
    expect(() => selectProjectCardToPlay.process({
      type: 'projectCard',
      card: CardName.AQUIFER_PUMPING,
      payment: Payment.of({}),
    })).to.throw(/Did not spend enough to pay for card/);
  });
  it('Spending what you do not have', () => {
    expect(() => selectProjectCardToPlay.process({
      type: 'projectCard',
      card: CardName.AQUIFER_PUMPING,
      payment: Payment.of({megacredits: 18}),
    })).to.throw(/You do not have that many resources to spend/);
  });

  it('Success', () => {
    player.megaCredits = 20;
    expect(called).is.false;
    expect(player.playedCards.length).eq(0);
    selectProjectCardToPlay.process({
      type: 'projectCard',
      card: CardName.AQUIFER_PUMPING,
      payment: Payment.of({megacredits: 18}),
    });
    expect(called).is.true;
    expect(player.megaCredits).eq(2);
    expect(player.playedCards).has.length(1);
    expect(player.playedCards.get(CardName.AQUIFER_PUMPING)).is.not.undefined;
  });

  it('Cannot play a disabled card', () => {
    selectProjectCardToPlay = new SelectProjectCardToPlay(
      player,
      [aquiferPumping, ioMiningIndustries],
      {enabled: [false, true]},
    ).andThen(cb);
    player.megaCredits = 20;
    expect(() => selectProjectCardToPlay.process({
      type: 'projectCard',
      card: CardName.AQUIFER_PUMPING,
      payment: Payment.of({megacredits: 18}),
    })).to.throw(/Unavailable card/);
    expect(called).is.false;
    expect(player.megaCredits).eq(20);
    expect(player.playedCards).has.length(0);
  });
});
