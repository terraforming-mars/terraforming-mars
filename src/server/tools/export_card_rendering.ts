require('dotenv').config();
import * as fs from 'fs';

import {ALL_MODULE_MANIFESTS} from '../cards/AllManifests';
import {CardManifest, GlobalEventManifest, ModuleManifest} from '../cards/ModuleManifest';
import {ICard, isIActionCard} from '../cards/ICard';
import {Expansion, GameModule} from '../../common/cards/GameModule';
import {IGlobalEvent} from '../turmoil/globalEvents/IGlobalEvent';
import {IClientGlobalEvent} from '../../common/turmoil/IClientGlobalEvent';
import {ClientCard} from '../../common/cards/ClientCard';
import {isICorporationCard} from '../cards/corporation/ICorporationCard';
import {isPreludeCard} from '../cards/prelude/IPreludeCard';
import {IColonyMetadata} from '../../common/colonies/IColonyMetadata';
import {Units} from '../../common/Units';
import {ALL_COLONIES_TILES, getColonyModule} from '../colonies/ColonyManifest';
import {milestoneManifest} from '../milestones/Milestones';
import {awardManifest} from '../awards/Awards';
import {awardNames} from '../../common/ma/AwardName';
import {milestoneNames} from '../../common/ma/MilestoneName';
import {ClientAward, ClientMilestone} from '../../common/ma/ClientMilestoneAward';
import {CardType} from '../../common/cards/CardType';
import {OneOrArray} from '../../common/utils/types';
import {globalInitialize} from '../globalInitialize';

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

  private static processCard(module: GameModule, card: ICard, compatibility: undefined | OneOrArray<Expansion>) {
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
      productionBox: Units.isUnits(production) ? production : Units.EMPTY, // Dynamic units aren't used on on the client side.
      resourceType: card.resourceType,
      startingMegaCredits: startingMegaCredits,
      cardCost: cardCost,
      compatibility: [],
      hasAction: isIActionCard(card),
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

class MilestoneProcessor {
  public static json: Array<ClientMilestone> = [];
  public static makeJson() {
    milestoneNames.forEach((name) => {
      MilestoneProcessor.json.push({
        name,
        description: milestoneManifest.createOrThrow(name).description,
        requirements: milestoneManifest.all[name].compatibility,
      });
    });
  }
}

class AwardProcessor {
  public static json: Array<ClientAward> = [];
  public static makeJson() {
    awardNames.forEach((name) => {
      AwardProcessor.json.push({
        name,
        description: awardManifest.createOrThrow(name).description,
        requirements: awardManifest.all[name].compatibility,
      });
    });
  }
}

if (!fs.existsSync('src/genfiles')) {
  fs.mkdirSync('src/genfiles');
}

globalInitialize();
CardProcessor.makeJson();
GlobalEventProcessor.makeJson();
ColoniesProcessor.makeJson();
MilestoneProcessor.makeJson();
AwardProcessor.makeJson();

fs.writeFileSync('src/genfiles/cards.json', JSON.stringify(CardProcessor.json, null, 2));
fs.writeFileSync('src/genfiles/events.json', JSON.stringify(GlobalEventProcessor.json, null, 2));
fs.writeFileSync('src/genfiles/colonies.json', JSON.stringify(ColoniesProcessor.json, null, 2));
fs.writeFileSync('src/genfiles/milestones.json', JSON.stringify(MilestoneProcessor.json, null, 2));
fs.writeFileSync('src/genfiles/awards.json', JSON.stringify(AwardProcessor.json, null, 2));
