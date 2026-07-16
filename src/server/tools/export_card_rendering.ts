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
import {ColonyMetadata} from '../../common/colonies/ColonyMetadata';
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
    if (this.errors.length > 0) {
      console.error(
        'The following cards have methods which must be replaced.');
      console.error(this.errors);
      console.error(
        'See more at https://github.com/terraforming-mars/terraforming-mars/wiki/API-Changes-2025%E2%80%9006');
      throw new Error('The ICard and ICorporationCard APIs have changed. Read above.');
    }
  }

  private static errors: Array<string> = [];
  private static validate(card: ICard, methodName: string) {
    if (Object.keys(card).includes(methodName)) {
      this.errors.push(`${card.name}: ${methodName}`);
    }
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
    if (card.type === CardType.PROXY) {
      return;
    }

    this.validate(card, 'onCardPlayedFromAnyPlayer');
    this.validate(card, 'onIncreaseTerraformRating');
    this.validate(card, 'onIdentification');
    this.validate(card, 'onColonyAdded');
    if (isICorporationCard(card)) {
      this.validate(card, 'onCardPlayed');
    }

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
  public static json: Array<ColonyMetadata> = [];
  public static makeJson() {
    ALL_COLONIES_TILES.forEach((entry) => {
      const colony = new entry.Factory();
      ColoniesProcessor.processColony(colony.metadata);
    });
  }

  private static processColony(metadata: ColonyMetadata) {
    // This seems extraneous but it prevents extra fields from creeping
    // into the JSON. Could do some other form, but this works and matches
    // the patterns above.
    const clientMetadata: ColonyMetadata = {
      module: getColonyModule(metadata.name),
      name: metadata.name,
      cardResource: metadata.cardResource,
      build: metadata.build,
      trade: metadata.trade,
      colony: metadata.colony,
      shouldIncreaseTrack: metadata.shouldIncreaseTrack,
      expansion: metadata.expansion,
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
