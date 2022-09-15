import {expect} from 'chai';
import {Dealer} from '../src/server/Dealer';
import {testGameOptions} from './TestingUtils';
import {GameCards} from '../src/server/GameCards';
import {DEFAULT_GAME_OPTIONS} from '../src/server/GameOptions';
import {CardName} from '../src/common/cards/CardName';
import {ConstRandom} from '../src/server/Random';

describe('Dealer', function() {
  it('deserializes from serialized', () => {
    const gameOptions = testGameOptions({
      corporateEra: false,
      preludeExtension: true,
      venusNextExtension: false,
      coloniesExtension: true,
      turmoilExtension: false,
      promoCardsOption: true,
      communityCardsOption: false,
      aresExtension: true,
    });
    const dealer = Dealer.newInstance(new GameCards(gameOptions));
    expect(dealer).to.deep.eq(Dealer.deserialize(dealer.serialize()));
  });

  it('addresses incompatible fan preludes', () => {
    const commonGameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      preludeExtension: true,
      turmoilExtension: true,
    };

    const first = Dealer.newInstance(new GameCards({...commonGameOptions}));
    expect(preludeCardNames(first)).does.not.include(CardName.BY_ELECTION);
    expect(preludeCardNames(first)).does.not.include(CardName.THE_NEW_SPACE_RACE);

    const second = Dealer.newInstance(new GameCards({...commonGameOptions, communityCardsOption: true}));
    expect(preludeCardNames(second)).includes(CardName.BY_ELECTION);
    expect(preludeCardNames(second)).does.not.include(CardName.THE_NEW_SPACE_RACE);

    const third = Dealer.newInstance(new GameCards({...commonGameOptions, pathfindersExpansion: true}));
    expect(preludeCardNames(third)).does.not.include(CardName.BY_ELECTION);
    expect(preludeCardNames(third)).includes(CardName.THE_NEW_SPACE_RACE);

    const fourth = Dealer.newInstance(
      new GameCards({...commonGameOptions, communityCardsOption: true, pathfindersExpansion: true}), new ConstRandom(0));
    expect(preludeCardNames(fourth)).does.not.include(CardName.BY_ELECTION);
    expect(preludeCardNames(fourth)).includes(CardName.THE_NEW_SPACE_RACE);

    const fifth = Dealer.newInstance(
      new GameCards({...commonGameOptions, communityCardsOption: true, pathfindersExpansion: true}), new ConstRandom(0.5));
    expect(preludeCardNames(fifth)).includes(CardName.BY_ELECTION);
    expect(preludeCardNames(fifth)).does.not.include(CardName.THE_NEW_SPACE_RACE);
  });
});

function preludeCardNames(dealer: Dealer): Array<CardName> {
  return dealer.preludeDeck.map((card) => card.name);
}

