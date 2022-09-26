require('dotenv').config();
import * as fs from 'fs';

import {ALL_MODULE_MANIFESTS} from '../cards/AllCards';
import {CardManifest, ModuleManifest} from '../cards/ModuleManifest';
import {ICard} from '../cards/ICard';
import {GameModule} from '../../common/cards/GameModule';
import {IGlobalEvent} from '../turmoil/globalEvents/IGlobalEvent';
import {ALL_EVENTS, getGlobalEventModule} from '../turmoil/globalEvents/GlobalEventDealer';
import {IClientGlobalEvent} from '../../common/turmoil/IClientGlobalEvent';
import {ClientCard} from '../../common/cards/ClientCard';
import {isICorporationCard} from '../cards/corporation/ICorporationCard';
import {isPreludeCard} from '../cards/prelude/IPreludeCard';
import {IColonyMetadata} from '../../common/colonies/IColonyMetadata';
import {Units} from '../../common/Units';
import {ALL_COLONIES_TILES, getColonyModule} from '../colonies/ColonyManifest';

class ProjectCardProcessor {
  public static json: Array<ClientCard> = [];
  public static makeJson() {
    ALL_MODULE_MANIFESTS.forEach(this.processManifest);
  }

  private static processManifest(manifest: ModuleManifest) {
    for (const cardManifest of [manifest.projectCards, manifest.corporationCards, manifest.preludeCards, manifest.standardActions, manifest.standardProjects]) {
      ProjectCardProcessor.processDeck(manifest.module, cardManifest);
    }
  }

  private static processDeck(module: GameModule, cardManifest: CardManifest<ICard>) {
    for (const factory of CardManifest.values(cardManifest)) {
      ProjectCardProcessor.processCard(module, new factory.Factory(), factory.compatibility);
    }
  }

  private static processCard(module: GameModule, card: ICard, compatibility: undefined | GameModule | Array<GameModule>) {
    let startingMegaCredits = undefined;
    let cardCost = undefined;
    if (isPreludeCard(card)) {
      startingMegaCredits = card.startingMegaCredits;
    }
    if (isICorporationCard(card)) {
      startingMegaCredits = card.startingMegaCredits;
      cardCost = card.cardCost;
    }

    const production = card.behavior?.production;
    const clientCard: ClientCard = {
      module: module,
      name: card.name,
      tags: card.tags,
      cardDiscount: card.cardDiscount,
      victoryPoints: card.victoryPoints,
      cost: card.cost,
      cardType: card.cardType,
      requirements: card.requirements,
      metadata: card.metadata,
      warning: card.warning,
      productionBox: Units.isUnits(production) ? Units.of(production) : Units.EMPTY, // Dynamic units aren't used on on the client side.
      resourceType: card.resourceType,
      startingMegaCredits: startingMegaCredits,
      cardCost: cardCost,
      compatibility: [],
    };

    if (Array.isArray(compatibility)) {
      clientCard.compatibility.push(...compatibility);
    } else if (compatibility !== undefined) {
      clientCard.compatibility.push(compatibility);
    }
    ProjectCardProcessor.json.push(clientCard);
  }
}

class GlobalEventProcessor {
  public static json: Array<IClientGlobalEvent> = [];
  public static makeJson() {
    ALL_EVENTS.forEach((Factory) => {
      const globalEvent = new Factory();
      GlobalEventProcessor.processGlobalEvent(globalEvent);
    });
  }

  private static processGlobalEvent(globalEvent: IGlobalEvent) {
    const event: IClientGlobalEvent = {
      module: getGlobalEventModule(globalEvent.name),
      name: globalEvent.name,
      description: globalEvent.description,
      revealedDelegate: globalEvent.revealedDelegate,
      currentDelegate: globalEvent.currentDelegate,
      renderData: globalEvent.renderData,
    };

    GlobalEventProcessor.json.push(event);
  }
}

class ColoniesProcessor {
  public static json: Array<IColonyMetadata> = [];
  public static makeJson() {
    ALL_COLONIES_TILES.forEach((entry) => {
      const colony = new entry.Factory();
      ColoniesProcessor.processColony(colony.metadata);
    });
  }

  private static processColony(metadata: IColonyMetadata) {
    // This seems extraneous but it prevents extra fields from creeping
    // into the JSON. Could do some other form, but this works and matches
    // the patterns above.
    const clientMetadata: IColonyMetadata = {
      module: getColonyModule(metadata.name),
      name: metadata.name,
      buildType: metadata.buildType,
      buildQuantity: metadata.buildQuantity,
      buildResource: metadata.buildResource,
      resourceType: metadata.resourceType,
      tradeType: metadata.tradeType,
      tradeQuantity: metadata.tradeQuantity,
      tradeResource: metadata.tradeResource,
      colonyBonusType: metadata.colonyBonusType,
      colonyBonusQuantity: metadata.colonyBonusQuantity,
      colonyBonusResource: metadata.colonyBonusResource,
      shouldIncreaseTrack: metadata.shouldIncreaseTrack,
    };

    ColoniesProcessor.json.push(clientMetadata);
  }
}

if (!fs.existsSync('src/genfiles')) {
  fs.mkdirSync('src/genfiles');
}

ProjectCardProcessor.makeJson();
GlobalEventProcessor.makeJson();
ColoniesProcessor.makeJson();

fs.writeFileSync('src/genfiles/cards.json', JSON.stringify(ProjectCardProcessor.json, null, 2));
fs.writeFileSync('src/genfiles/events.json', JSON.stringify(GlobalEventProcessor.json, null, 2));
fs.writeFileSync('src/genfiles/colonies.json', JSON.stringify(ColoniesProcessor.json, null, 2));
