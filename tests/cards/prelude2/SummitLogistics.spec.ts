import {expect} from 'chai';
import {SummitLogistics} from '@/server/cards/prelude2/SummitLogistics';
import {PartyName} from '@/common/turmoil/PartyName';
import {IGame} from '@/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {setRulingParty} from '../../TestingUtils';

describe('SummitLogistics', () => {
  let card: SummitLogistics;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new SummitLogistics();
    [game, player] = testGame(2, {turmoilExtension: true, coloniesExtension: true});
  });

  it('canPlay', () => {
    setRulingParty(game, PartyName.REDS);
    expect(card.canPlay(player)).is.false;

    setRulingParty(game, PartyName.SCIENTISTS);
    expect(card.canPlay(player)).is.true;
  });

  it('play() draws 2 cards', () => {
    expect(player.cardsInHand).has.lengthOf(0);
    card.play(player);
    expect(player.cardsInHand).has.lengthOf(2);
  });

  it('play() grants 1 M€ per JOVIAN, EARTH, VENUS, and MARS tag', () => {
    player.tagsForTest = {
      'jovian': 1,
      'earth': 2,
      'venus': 1,
      'mars': 1,
    };
    card.play(player);
    expect(player.megaCredits).to.eq(5);
  });

  it('does not count Moon tags', () => {
    player.tagsForTest = {'moon': 5};
    card.play(player);
    expect(player.megaCredits).to.eq(0);
  });
});
