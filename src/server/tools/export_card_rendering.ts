require('dotenv').config();
import * as fs from 'fs';

import {ALL_MODULE_MANIFESTS} from '../cards/AllCards';
import {CardManifest, GlobalEventManifest, ModuleManifest} from '../cards/ModuleManifest';
import {ICard} from '../cards/ICard';
import {GameModule} from '../../common/cards/GameModule';
import {IGlobalEvent} from '../turmoil/globalEvents/IGlobalEvent';
import {IClientGlobalEvent} from '../../common/turmoil/IClientGlobalEvent';
import {ClientCard} from '../../common/cards/ClientCard';
import {isICorporationCard} from '../cards/corporation/ICorporationCard';
import {isPreludeCard} from '../cards/prelude/IPreludeCard';
import {IColonyMetadata} from '../../common/colonies/IColonyMetadata';
import {Units} from '../../common/Units';
import {ALL_COLONIES_TILES, getColonyModule} from '../colonies/ColonyManifest';
import {ALL_MILESTONES} from '../milestones/Milestones';
import {ALL_AWARDS} from '../awards/Awards';
import {MilestoneAwardMetadata} from '../../common/ma/MilestoneAwardMetadata';
import {AwardName} from '../../common/ma/AwardName';
import {MilestoneName} from '../../common/ma/MilestoneName';
import {CardType} from '../../common/cards/CardType';
import {OneOrArray} from '../../common/utils/types';
import {initializeGlobalEventDealer} from '../turmoil/globalEvents/GlobalEventDealer';

class CardProcessor {
  public static json: Array<ClientCard> = [];
  public static makeJson() {
    ALL_MODULE_MANIFESTS.forEach(this.processManifest);
  }

  private static processManifest(manifest: ModuleManifest) {
    CardProcessor.processDeck(manifest.module, manifest.projectCards);
    CardProcessor.processDeck(manifest.module, manifest.corporationCards);
    CardProcessor.processDeck(manifest.module, manifest.preludeCards);
    CardProcessor.processDeck(manifest.module, manifest.ceoCards);
    CardProcessor.processDeck(manifest.module, manifest.standardActions);
    CardProcessor.processDeck(manifest.module, manifest.standardProjects);
  }

  private static processDeck(module: GameModule, cardManifest: CardManifest<ICard>) {
    for (const factory of CardManifest.values(cardManifest)) {
      CardProcessor.processCard(module, new factory.Factory(), factory.compatibility);
    }
  }

  private static processCard(module: GameModule, card: ICard, compatibility: undefined | OneOrArray<GameModule>) {
    if (card.type === CardType.PROXY) return;
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
      type: card.type,
      requirements: card.requirements ?? [],
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
    CardProcessor.json.push(clientCard);
  }
}

class GlobalEventProcessor {
  public static json: Array<IClientGlobalEvent> = [];
  public static makeJson() {
    ALL_MODULE_MANIFESTS.forEach(this.processManifest);
  }

  private static processManifest(manifest: ModuleManifest) {
    for (const cf of GlobalEventManifest.values(manifest.globalEvents)) {
      GlobalEventProcessor.processGlobalEvent(manifest.module, new cf.Factory());
    }
  }

  private static processGlobalEvent(module: GameModule, globalEvent: IGlobalEvent) {
    const event: IClientGlobalEvent = {
      module: module,
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
      description: metadata.description,
      buildType: metadata.buildType,
      buildQuantity: metadata.buildQuantity,
      buildResource: metadata.buildResource,
      cardResource: metadata.cardResource,
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

class MAProcessor {
  public static json: Array<MilestoneAwardMetadata> = [];
  public static makeJson() {
    ALL_MILESTONES.forEach((entry) => {
      MAProcessor.processEntry(entry);
    });

    ALL_AWARDS.forEach((entry) => {
      MAProcessor.processEntry(entry);
    });
  }

  private static processEntry(metadata: {name: MilestoneName | AwardName, description: string}) {
    MAProcessor.json.push({
      name: metadata.name,
      description: metadata.description,
    });
  }
}

if (!fs.existsSync('src/genfiles')) {
  fs.mkdirSync('src/genfiles');
}

initializeGlobalEventDealer(ALL_MODULE_MANIFESTS);
CardProcessor.makeJson();
GlobalEventProcessor.makeJson();
ColoniesProcessor.makeJson();
MAProcessor.makeJson();

fs.writeFileSync('src/genfiles/cards.json', JSON.stringify(CardProcessor.json, null, 2));
fs.writeFileSync('src/genfiles/events.json', JSON.stringify(GlobalEventProcessor.json, null, 2));
fs.writeFileSync('src/genfiles/colonies.json', JSON.stringify(ColoniesProcessor.json, null, 2));
fs.writeFileSync('src/genfiles/ma.json', JSON.stringify(MAProcessor.json, null, 2));
