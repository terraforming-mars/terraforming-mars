import {expect} from 'chai';
import {GlobalDustStorm} from '../src/turmoil/globalEvents/GlobalDustStorm';
import {GlobalEventDealer} from '../src/turmoil/globalEvents/GlobalEventDealer';
import {GlobalEventName} from '../src/turmoil/globalEvents/GlobalEventName';
import {IGlobalEvent} from '../src/turmoil/globalEvents/IGlobalEvent';
import {ScientificCommunity} from '../src/turmoil/globalEvents/ScientificCommunity';
import {SponsoredProjects} from '../src/turmoil/globalEvents/SponsoredProjects';
import {SuccessfulOrganisms} from '../src/turmoil/globalEvents/SuccessfulOrganisms';
import {WarOnEarth} from '../src/turmoil/globalEvents/WarOnEarth';

describe('GlobalEventsDealer', () => {
  it('serialize/deserialize - empty', () => {
    const dealer = new GlobalEventDealer([], []);

    const jsonString = JSON.stringify(dealer.serialize());
    const json = JSON.parse(jsonString) as GlobalEventDealer;
    const newDealer = GlobalEventDealer.deserialize(json);

    expect(newDealer.globalEventsDeck).is.empty;
    expect(newDealer.discardedGlobalEvents).is.empty;
  });

  it('serialize/deserialize - empty', () => {
    const dealer = new GlobalEventDealer(
      [new SponsoredProjects(), new SuccessfulOrganisms(), new ScientificCommunity()],
      [new GlobalDustStorm(), new WarOnEarth()]);

    const jsonString = JSON.stringify(dealer.serialize());
    const json = JSON.parse(jsonString) as GlobalEventDealer;
    const newDealer = GlobalEventDealer.deserialize(json);

    const cardName = (e: IGlobalEvent) => e.name;
    expect(newDealer.globalEventsDeck.map(cardName)).deep.eq([
      GlobalEventName.SPONSORED_PROJECTS,
      GlobalEventName.SUCCESSFUL_ORGANISMS,
      GlobalEventName.SCIENTIFIC_COMMUNITY]);
    expect(newDealer.discardedGlobalEvents.map(cardName)).deep.eq([
      GlobalEventName.GLOBAL_DUST_STORM, GlobalEventName.WAR_ON_EARTH,
    ]);
  });
});
