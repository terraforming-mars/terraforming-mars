import {IProjectCard} from '../../src/server/cards/IProjectCard';
import {CardName} from '../../src/common/cards/CardName';
import {expect} from 'chai';
import {AcquiredCompany} from '../../src/server/cards/base/AcquiredCompany';
import {BannedDelegate} from '../../src/server/cards/turmoil/BannedDelegate';
import {CallistoPenalMines} from '../../src/server/cards/base/CallistoPenalMines';
import {CEOsFavoriteProject} from '../../src/server/cards/base/CEOsFavoriteProject';
import {RadChemFactory} from '../../src/server/cards/base/RadChemFactory';
import {TitanFloatingLaunchPad} from '../../src/server/cards/colonies/TitanFloatingLaunchPad';
import {EarthEmbassy} from '../../src/server/cards/moon/EarthEmbassy';
import {CardManifest} from '../../src/server/cards/ModuleManifest';
import {ICard} from '../../src/server/cards/ICard';

describe('ModuleManifest', () => {
  const cardManifest: CardManifest<IProjectCard> = {
    [CardName.ACQUIRED_COMPANY]: {Factory: AcquiredCompany},
    [CardName.BANNED_DELEGATE]: {Factory: BannedDelegate},
    [CardName.CALLISTO_PENAL_MINES]: {Factory: CallistoPenalMines},
    [CardName.CEOS_FAVORITE_PROJECT]: {Factory: CEOsFavoriteProject},
    [CardName.RAD_CHEM_FACTORY]: {Factory: RadChemFactory},
    [CardName.TITAN_FLOATING_LAUNCHPAD]: {Factory: TitanFloatingLaunchPad},
    [CardName.EARTH_EMBASSY]: {Factory: EarthEmbassy},
  };

  it('findCardByName: success', () => {
    expect(cardManifest[CardName.ACQUIRED_COMPANY]).is.not.undefined;
  });
  it('findCardByName: failure', () => {
    expect(cardManifest[CardName.ECOLOGICAL_ZONE]).is.undefined;
  });
  it('CardManifest.keys', () => {
    expect(CardManifest.keys(cardManifest)).to.have.members(
      [
        CardName.ACQUIRED_COMPANY,
        CardName.BANNED_DELEGATE,
        CardName.CALLISTO_PENAL_MINES,
        CardName.CEOS_FAVORITE_PROJECT,
        CardName.RAD_CHEM_FACTORY,
        CardName.TITAN_FLOATING_LAUNCHPAD,
        CardName.EARTH_EMBASSY,
      ]);
  });

  it('CardManifest.values', () => {
    const cards = CardManifest.values(cardManifest).map((f) => new f.Factory());
    expect(cards.map((c) => c.name)).to.have.members(
      [
        CardName.ACQUIRED_COMPANY,
        CardName.BANNED_DELEGATE,
        CardName.CALLISTO_PENAL_MINES,
        CardName.CEOS_FAVORITE_PROJECT,
        CardName.RAD_CHEM_FACTORY,
        CardName.TITAN_FLOATING_LAUNCHPAD,
        CardName.EARTH_EMBASSY,
      ]);
  });

  it('CardManifest.entries', () => {
    const nameToCard: Array<[CardName, ICard]> = CardManifest.entries(cardManifest).map(([n, f]) => [n, new f.Factory()]);
    const nameToName: Array<[CardName, CardName]> = nameToCard.map(([n, c]) => [n, c.name]);

    expect(nameToName).to.deep.eq([
      [CardName.ACQUIRED_COMPANY, CardName.ACQUIRED_COMPANY],
      [CardName.BANNED_DELEGATE, CardName.BANNED_DELEGATE],
      [CardName.CALLISTO_PENAL_MINES, CardName.CALLISTO_PENAL_MINES],
      [CardName.CEOS_FAVORITE_PROJECT, CardName.CEOS_FAVORITE_PROJECT],
      [CardName.RAD_CHEM_FACTORY, CardName.RAD_CHEM_FACTORY],
      [CardName.TITAN_FLOATING_LAUNCHPAD, CardName.TITAN_FLOATING_LAUNCHPAD],
      [CardName.EARTH_EMBASSY, CardName.EARTH_EMBASSY,
      ]]);
  });
});
