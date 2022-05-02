import {expect} from 'chai';

import {TestPlayer} from '../TestPlayer';
import {Game} from '../../src/Game';
import {newTestGame, getTestPlayer} from '../TestGame';
import {HowToPay} from '../../src/common/inputs/HowToPay';
import {SelectHowToPayForProjectCard} from '../../src/inputs/SelectHowToPayForProjectCard';
import {IProjectCard} from '../../src/cards/IProjectCard';
import {Soletta} from '../../src/cards/base/Soletta';
import {EarthCatapult} from '../../src/cards/base/EarthCatapult';
import {CardName} from '../../src/common/cards/CardName';

describe('SelectHowToPayForProjectCard', function() {
  let game: Game;
  let player: TestPlayer;
  const cards = [new Soletta(), new EarthCatapult()];

  beforeEach(() => {
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
    player.megaCredits = 100;
    player.titanium = 10;
  });

  it('allows normal inputs', () => {
    cb(CardName.SOLETTA, HowToPay.of({megaCredits: 23, titanium: 4}), cards);
    expect(player.purse()).to.include({megacredits: 77, titanium: 6});
    cb(CardName.EARTH_CATAPULT, HowToPay.of({megaCredits: 23}), cards);
    expect(player.purse()).to.include({megacredits: 54, titanium: 6});
  });

  it('rejects partial inputs', () => {
    expect(() => cb(CardName.SOLETTA, {megaCredits: 35}, cards)).to.throw('Unable to parse HowToPay');
  });

  it('rejects unselectable cards', () => {
    expect(() => cb(CardName.COMET, HowToPay.of({megaCredits: 35}), cards)).to.throw('not found');
  });

  it('rejects negative inputs', () => {
    expect(() => cb(CardName.SOLETTA, HowToPay.of({megaCredits: 50, titanium: -5}), cards))
      .to.throw('You do not have that many');
  });

  it('rejects overspending', () => {
    player.megaCredits = 10;
    expect(() => cb(CardName.SOLETTA, HowToPay.of({megaCredits: 35}), cards))
      .to.throw('You do not have that many');
  });

  it('rejects underspending', () => {
    expect(() => cb(CardName.SOLETTA, HowToPay.of({megaCredits: 20}), cards))
      .to.throw('Did not spend enough');
  });

  function cb(name: string, value: any, cards: IProjectCard[]) {
    const action = new SelectHowToPayForProjectCard(player, cards,
      (...args) => player.checkHowToPayAndPlayCard(...args));

    const input = JSON.stringify(value);
    player.runInput([[name, input]], action);
  }
});

