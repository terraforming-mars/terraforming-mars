import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {GlobalDustStorm} from '../../../src/server/turmoil/globalEvents/GlobalDustStorm';
import {GlobalEventDealer, getGlobalEventByName} from '../../../src/server/turmoil/globalEvents/GlobalEventDealer';
import {GlobalEventName} from '../../../src/common/turmoil/globalEvents/GlobalEventName';
import {IGlobalEvent} from '../../../src/server/turmoil/globalEvents/IGlobalEvent';
import {ScientificCommunity} from '../../../src/server/turmoil/globalEvents/ScientificCommunity';
import {SerializedGlobalEventDealer} from '../../../src/server/turmoil/globalEvents/SerializedGlobalEventDealer';
import {SponsoredProjects} from '../../../src/server/turmoil/globalEvents/SponsoredProjects';
import {SuccessfulOrganisms} from '../../../src/server/turmoil/globalEvents/SuccessfulOrganisms';
import {WarOnEarth} from '../../../src/server/turmoil/globalEvents/WarOnEarth';
import {testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('GlobalEventDealer', () => {
  it('serialize/deserialize - empty', () => {
    const dealer = new GlobalEventDealer([], []);

    const jsonString = JSON.stringify(dealer.serialize());
    const json = JSON.parse(jsonString) as SerializedGlobalEventDealer;
    const newDealer = GlobalEventDealer.deserialize(json);

    expect(newDealer.globalEventsDeck).is.empty;
    expect(newDealer.discardedGlobalEvents).is.empty;
  });

  it('serialize/deserialize - empty', () => {
    const dealer = new GlobalEventDealer(
      [new SponsoredProjects(), new SuccessfulOrganisms(), new ScientificCommunity()],
      [new GlobalDustStorm(), new WarOnEarth()]);

    const jsonString = JSON.stringify(dealer.serialize());
    const json = JSON.parse(jsonString) as SerializedGlobalEventDealer;
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

  it('getGlobalEventByName can retrieve all cards', () => {
    const gameOptions = testGameOptions({
      preludeExtension: true,
      venusNextExtension: true,
      coloniesExtension: true,
      turmoilExtension: true,
      aresExtension: true,
      communityCardsOption: true,
      removeNegativeGlobalEventsOption: false,
    });
    const player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player, gameOptions);
    const dealer = GlobalEventDealer.newInstance(game);
    for (const card of dealer.globalEventsDeck) {
      expect(getGlobalEventByName(card.name), card.name + ' cannot be retrieved, card is probably missing from ALL_EVENTS').to.deep.eq(card);
    }
  });
});
