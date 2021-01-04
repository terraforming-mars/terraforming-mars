import {Deck} from '../src/Deck';
import {IProjectCard} from '../src/cards/IProjectCard';
import {ICardFactory} from '../src/cards/ICardFactory';
import {CardName} from '../src/CardName';
import {expect} from 'chai';
import {AcquiredCompany} from '../src/cards/base/AcquiredCompany';
import {BannedDelegate} from '../src/cards/turmoil/BannedDelegate';
import {CallistoPenalMines} from '../src/cards/base/CallistoPenalMines';

describe('Deck', function() {
  const cards: Array<ICardFactory<IProjectCard>> = [
    {cardName: CardName.ACQUIRED_COMPANY, Factory: AcquiredCompany},
    {cardName: CardName.BANNED_DELEGATE, Factory: BannedDelegate},
    {cardName: CardName.CALLISTO_PENAL_MINES, Factory: CallistoPenalMines},
  ];
  const deck: Deck<IProjectCard> = new Deck(cards);

  it('findCardByName: success', function() {
    expect(deck.findByCardName(CardName.ACQUIRED_COMPANY)).is.not.undefined;
  });
  it('findCardByName: failure', function() {
    expect(deck.findByCardName(CardName.ECOLOGICAL_ZONE)).is.undefined;
  });
});
