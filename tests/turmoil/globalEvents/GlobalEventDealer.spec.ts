import {expect} from 'chai';
import {GlobalDustStorm} from '../../../src/server/turmoil/globalEvents/GlobalDustStorm';
import {GlobalEventDealer, getGlobalEventByName} from '../../../src/server/turmoil/globalEvents/GlobalEventDealer';
import {GlobalEventName} from '../../../src/common/turmoil/globalEvents/GlobalEventName';
import {IGlobalEvent} from '../../../src/server/turmoil/globalEvents/IGlobalEvent';
import {ScientificCommunity} from '../../../src/server/turmoil/globalEvents/ScientificCommunity';
import {SerializedGlobalEventDealer} from '../../../src/server/turmoil/globalEvents/SerializedGlobalEventDealer';
import {SponsoredProjects} from '../../../src/server/turmoil/globalEvents/SponsoredProjects';
import {SuccessfulOrganisms} from '../../../src/server/turmoil/globalEvents/SuccessfulOrganisms';
import {WarOnEarth} from '../../../src/server/turmoil/globalEvents/WarOnEarth';
import {testGame} from '../../TestGame';
import {GameOptions} from '@/server/game/GameOptions';

describe('GlobalEventDealer', () => {
  it('serialize/deserialize - empty', () => {
    const dealer = new GlobalEventDealer([], []);

    const jsonString = JSON.stringify(dealer.serialize());
    const json = JSON.parse(jsonString) as SerializedGlobalEventDealer;
    const newDealer = GlobalEventDealer.deserialize(json);

    expect(newDealer.deck).is.empty;
    expect(newDealer.discards).is.empty;
  });

  it('serialize/deserialize - not empty', () => {
    const dealer = new GlobalEventDealer(
      [new SponsoredProjects(), new SuccessfulOrganisms(), new ScientificCommunity()],
      [new GlobalDustStorm(), new WarOnEarth()]);

    const jsonString = JSON.stringify(dealer.serialize());
    const json = JSON.parse(jsonString) as SerializedGlobalEventDealer;
    const newDealer = GlobalEventDealer.deserialize(json);

    const cardName = (e: IGlobalEvent) => e.name;
    expect(newDealer.deck.map(cardName)).deep.eq([
      GlobalEventName.SPONSORED_PROJECTS,
      GlobalEventName.SUCCESSFUL_ORGANISMS,
      GlobalEventName.SCIENTIFIC_COMMUNITY]);
    expect(newDealer.discards.map(cardName)).deep.eq([
      GlobalEventName.GLOBAL_DUST_STORM, GlobalEventName.WAR_ON_EARTH,
    ]);
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
    for (const card of dealer.deck) {
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
    return dealer.deck.some((e) => e.name === name);
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
