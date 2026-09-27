import {expect} from 'chai';
import {preludeDrawingCards} from '@/client/components/create/preludeDrawingCards';
import {CardName} from '@/common/cards/CardName';
import {DEFAULT_EXPANSIONS, Expansion} from '@/common/cards/GameModule';

function myExpect(overrides: {
    expansions?: Partial<Record<Expansion, boolean>>,
    customPreludes?: Array<CardName>,
    customCorporations?: Array<CardName>,
    customCeos?: Array<CardName>,
    bannedCards?: Array<CardName>,
    includedCards?: Array<CardName>,
  }, expected: Array<CardName>) {
  const settings =  {
    customPreludes: [CardName.DONATION],
    customCorporations: [CardName.ECOLINE],
    customCeos: [],
    bannedCards: [],
    includedCards: [],
    ...overrides,
    expansions: {...DEFAULT_EXPANSIONS, prelude: true, ...overrides.expansions},
  };
  expect(preludeDrawingCards(settings)).deep.eq(expected);
}

describe('preludeDrawingCards', () => {
  it('is empty without a custom prelude list', () => {
    myExpect({customPreludes: [], customCorporations: []}, []);
  });

  it('is empty when no prelude-drawing cards are in the game', () => {
    myExpect({}, []);
  });

  it('Valley Trust', () => {
    myExpect({customCorporations: []}, [CardName.VALLEY_TRUST]);
    myExpect({customCorporations: [CardName.VALLEY_TRUST]}, [CardName.VALLEY_TRUST]);
  });

  it('New Partner and Board of Directors', () => {
    myExpect({customPreludes: [CardName.NEW_PARTNER]}, [CardName.NEW_PARTNER]);
    myExpect({customPreludes: [CardName.BOARD_OF_DIRECTORS]}, [CardName.BOARD_OF_DIRECTORS]);
  });

  it('WG Project', () => {
    myExpect({expansions: {prelude2: true, turmoil: true}}, [CardName.WG_PROJECT]);
    // Requires Turmoil.
    myExpect({expansions: {prelude2: true, turmoil: false}}, []);
    myExpect({expansions: {prelude2: true, turmoil: true}, bannedCards: [CardName.WG_PROJECT]}, []);
    myExpect({expansions: {prelude2: false, turmoil: true}, includedCards: [CardName.WG_PROJECT]}, [CardName.WG_PROJECT]);
  });

  it('Karen', () => {
    myExpect({expansions: {ceo: true}}, [CardName.KAREN]);
    myExpect({expansions: {ceo: true}, customCeos: [CardName.KAREN]}, [CardName.KAREN]);
    myExpect({expansions: {ceo: true}, customCeos: [CardName.FLOYD]}, []);
    myExpect({expansions: {ceo: false}, customCeos: [CardName.KAREN]}, []);
  });
});
