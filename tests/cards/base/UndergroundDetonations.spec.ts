import {expect} from 'chai';
import {UndergroundDetonations} from '../../../src/server/cards/base/UndergroundDetonations';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {SelectPayment} from '../../../src/server/inputs/SelectPayment';
import {Payment} from '../../../src/common/inputs/Payment';

describe('UndergroundDetonations', () => {
  let card: UndergroundDetonations;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new UndergroundDetonations();
    [game, player] = testGame(2);
  });

  it('can not act without enough M€ or steel', () => {
    player.megaCredits = 7;
    player.steel = 0;
    expect(card.canAct(player)).is.false;
  });

  it('can act with steel substituting M€', () => {
    player.megaCredits = 6; // 2 short
    player.steel = 0;
    expect(card.canAct(player)).is.false;
    player.steel = 1; // 1 steel = 2 M€, covers the gap
    expect(card.canAct(player)).is.true;
  });

  it('should act: spends 8 M€ and increases heat production 2 steps', () => {
    player.megaCredits = 8;
    cast(card.action(player), undefined);
    game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(0);
    expect(player.production.heat).to.eq(2);
  });

  it('should act: can pay with steel', () => {
    player.megaCredits = 8;
    player.steel = 1; // 8 M€ + 1 steel (worth 2) = 10
    cast(card.action(player), undefined);
    const selectPayment = cast(game.deferredActions.peek()!.execute(), SelectPayment);
    selectPayment.cb({...Payment.EMPTY, megaCredits: 8, steel: 1});
    expect(player.megaCredits).to.eq(0);
    expect(player.steel).to.eq(0);
    expect(player.production.heat).to.eq(2);
  });
});
