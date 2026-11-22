import {expect} from 'chai';
import {GlobalDustStorm} from '../../../src/server/turmoil/globalEvents/GlobalDustStorm';
import {GlobalEventDealer, getGlobalEventByName} from '../../../src/server/turmoil/globalEvents/GlobalEventDealer';
import {GlobalEventName} from '../../../src/common/turmoil/globalEvents/GlobalEventName';
import {ScientificCommunity} from '../../../src/server/turmoil/globalEvents/ScientificCommunity';
import {LegacySerializedGlobalEventDealer} from '../../../src/server/turmoil/globalEvents/LegacySerializedGlobalEventDealer';
import {SponsoredProjects} from '../../../src/server/turmoil/globalEvents/SponsoredProjects';
import {SuccessfulOrganisms} from '../../../src/server/turmoil/globalEvents/SuccessfulOrganisms';
import {WarOnEarth} from '../../../src/server/turmoil/globalEvents/WarOnEarth';
import {testGame} from '../../TestGame';
import {GameOptions} from '../../../src/server/game/GameOptions';
import {SerializedDeck} from '@/server/cards/SerializedDeck';
import {SeededRandom} from '@/common/utils/Random';
import {toName} from '@/common/utils/utils';

describe('GlobalEventDealer', () => {
  it('serialize/deserialize - empty', () => {
    const dealer = GlobalEventDealer.deserialize({drawPile: [], discardPile: []}, new SeededRandom(1));

    const jsonString = JSON.stringify(dealer.serialize());
    const json = JSON.parse(jsonString) as SerializedDeck<GlobalEventName>;
    const newDealer = GlobalEventDealer.deserialize(json, new SeededRandom(1));

    expect(newDealer.deck.drawPile).is.empty;
    expect(newDealer.deck.discardPile).is.empty;
  });

  it('serialize/deserialize - not empty', () => {
    const dealer = GlobalEventDealer.deserialize({drawPile: [], discardPile: []}, new SeededRandom(1));
    dealer.deck.drawPile.push(new SponsoredProjects(), new SuccessfulOrganisms(), new ScientificCommunity());
    dealer.deck.discardPile.push(new GlobalDustStorm(), new WarOnEarth());

    const jsonString = JSON.stringify(dealer.serialize());
    const json = JSON.parse(jsonString) as SerializedDeck<GlobalEventName>;
    const newDealer = GlobalEventDealer.deserialize(json, new SeededRandom(1));

    expect(newDealer.deck.drawPile.map(toName)).deep.eq([
      GlobalEventName.SPONSORED_PROJECTS,
      GlobalEventName.SUCCESSFUL_ORGANISMS,
      GlobalEventName.SCIENTIFIC_COMMUNITY]);
    expect(newDealer.deck.discardPile.map(toName)).deep.eq([
      GlobalEventName.GLOBAL_DUST_STORM, GlobalEventName.WAR_ON_EARTH,
    ]);
  });

  it('deserialize - legacy format', () => {
    const json: LegacySerializedGlobalEventDealer = {
      deck: [GlobalEventName.SPONSORED_PROJECTS, GlobalEventName.SUCCESSFUL_ORGANISMS],
      discarded: [GlobalEventName.WAR_ON_EARTH],
    };
    const dealer = GlobalEventDealer.deserialize(json, new SeededRandom(1));

    expect(dealer.deck.drawPile.map(toName)).deep.eq([
      GlobalEventName.SPONSORED_PROJECTS,
      GlobalEventName.SUCCESSFUL_ORGANISMS]);
    expect(dealer.deck.discardPile.map(toName)).deep.eq([GlobalEventName.WAR_ON_EARTH]);
  });

  it('getGlobalEventByName can retrieve all cards', () => {
    const [game] = testGame(1, {
      preludeExtension: true,
      venusNextExtension: true,
      coloniesExtension: true,
      turmoilExtension: true,
      aresExtension: true,
      communityCardsOption: true,
      removeNegativeGlobalEventsOption: false,
    });
    const dealer = GlobalEventDealer.newInstance(game);
    for (const card of dealer.deck.drawPile) {
      expect(getGlobalEventByName(card.name), card.name + ' cannot be retrieved, card is probably missing from ALL_EVENTS').to.deep.eq(card);
    }
  });

  function newDealer(options: Partial<GameOptions>) {
    const [game] = testGame(1, {
      turmoilExtension: true,
      ...options,
    });
    return GlobalEventDealer.newInstance(game);
  }

  function deckHasCard(dealer: GlobalEventDealer, name: GlobalEventName): boolean {
    return dealer.deck.drawPile.some((e) => e.name === name);
  }

  it('dealer includes negative events by default', () => {
    const dealer = newDealer({removeNegativeGlobalEventsOption: false});
    expect(deckHasCard(dealer, GlobalEventName.MINERS_ON_STRIKE)).is.true;
  });

  it('dealer filters negative events', () => {
    const dealer = newDealer({removeNegativeGlobalEventsOption: true});
    expect(deckHasCard(dealer, GlobalEventName.MINERS_ON_STRIKE)).is.false;
  });

  it('dealer filters venus events', () => {
    expect(deckHasCard(newDealer({}), GlobalEventName.VENUS_INFRASTRUCTURE)).is.false;
    expect(deckHasCard(newDealer({venusNextExtension: true}), GlobalEventName.VENUS_INFRASTRUCTURE)).is.true;
  });

  it('dealer filters colonies events', () => {
    expect(deckHasCard(newDealer({}), GlobalEventName.JOVIAN_TAX_RIGHTS)).is.false;
    expect(deckHasCard(newDealer({coloniesExtension: true}), GlobalEventName.JOVIAN_TAX_RIGHTS)).is.true;
  });

  it('dealer filters colonies + venus events', () => {
    expect(deckHasCard(newDealer({}), GlobalEventName.CLOUD_SOCIETIES)).is.false;
    expect(deckHasCard(newDealer({coloniesExtension: true}), GlobalEventName.CLOUD_SOCIETIES)).is.false;
    expect(deckHasCard(newDealer({venusNextExtension: true}), GlobalEventName.CLOUD_SOCIETIES)).is.false;
    expect(deckHasCard(newDealer({coloniesExtension: true, venusNextExtension: true}), GlobalEventName.CLOUD_SOCIETIES)).is.true;
  });

  it('dealer filters pathfinders events', () => {
    expect(deckHasCard(newDealer({}), GlobalEventName.BALANCED_DEVELOPMENT)).is.false;
    expect(deckHasCard(newDealer({pathfindersExpansion: true}), GlobalEventName.BALANCED_DEVELOPMENT)).is.true;
  });
});
