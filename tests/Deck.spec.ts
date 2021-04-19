import {Deck} from '../src/Deck';
import {IProjectCard} from '../src/cards/IProjectCard';
import {ICardFactory} from '../src/cards/ICardFactory';
import {CardName} from '../src/CardName';
import {expect} from 'chai';
import {AcquiredCompany} from '../src/cards/base/AcquiredCompany';
import {BannedDelegate} from '../src/cards/turmoil/BannedDelegate';
import {CallistoPenalMines} from '../src/cards/base/CallistoPenalMines';
import {CEOsFavoriteProject} from '../src/cards/base/CEOsFavoriteProject';
import {RadChemFactory} from '../src/cards/base/RadChemFactory';
import {TitanFloatingLaunchPad} from '../src/cards/colonies/TitanFloatingLaunchPad';
import {EarthEmbassy} from '../src/cards/moon/EarthEmbassy';

describe('Deck', function() {
  const cards: Array<ICardFactory<IProjectCard>> = [
    {cardName: CardName.ACQUIRED_COMPANY, Factory: AcquiredCompany},
    {cardName: CardName.BANNED_DELEGATE, Factory: BannedDelegate},
    {cardName: CardName.CALLISTO_PENAL_MINES, Factory: CallistoPenalMines},
    {cardName: CardName.CEOS_FAVORITE_PROJECT, Factory: CEOsFavoriteProject},
    {cardName: CardName.RAD_CHEM_FACTORY, Factory: RadChemFactory},
    {cardName: CardName.TITAN_FLOATING_LAUNCHPAD, Factory: TitanFloatingLaunchPad},
    {cardName: CardName.EARTH_EMBASSY, Factory: EarthEmbassy},
  ];
  const deck: Deck<IProjectCard> = new Deck(cards);

  it('findCardByName: success', function() {
    expect(deck.findByCardName(CardName.ACQUIRED_COMPANY)).is.not.undefined;
  });
  it('findCardByName: failure', function() {
    expect(deck.findByCardName(CardName.ECOLOGICAL_ZONE)).is.undefined;
  });

  // Dont' remove this test. It's a placeholder for card renames.
  it('finds renamed cards', function() {
    // expect(deck.findByCardName('Earth Embasy' as CardName)?.cardName).to.equal(CardName.EARTH_EMBASSY);
  });
});
