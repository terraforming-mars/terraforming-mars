require('dotenv').config();
import * as fs from 'fs';

import {ALL_CARD_MANIFESTS} from '../cards/AllCards';
import {CardManifest} from '../cards/CardManifest';
import {ICard} from '../cards/ICard';
import {Deck} from '../Deck';
import {GameModule} from '../common/cards/GameModule';
import {IGlobalEvent} from '../turmoil/globalEvents/IGlobalEvent';
import {ALL_EVENTS} from '../turmoil/globalEvents/GlobalEventDealer';
import {IClientGlobalEvent} from '../common/turmoil/IClientGlobalEvent';

class ProjectCardProcessor {
  public static json: Array<any> = [];
  public static makeJson() {
    ALL_CARD_MANIFESTS.forEach(this.processManifest);
  }

  private static processManifest(manifest: CardManifest) {
    for (const deck of [manifest.projectCards, manifest.corporationCards, manifest.preludeCards, manifest.standardActions, manifest.standardProjects]) {
      ProjectCardProcessor.processDeck(manifest.module, deck);
    }
  }

  private static processDeck(module: GameModule, deck: Deck<ICard>) {
    deck.factories.forEach((factory) => {
      ProjectCardProcessor.processCard(module, new factory.Factory());
    });
  }

  private static processCard(module: GameModule, card: ICard) {
    const vizCardData = {
      module: module,
      name: card.name,
      tags: card.tags,
      cardDiscount: card.cardDiscount,
      resourceType: card.resourceType,
      cost: card.cost,
      cardType: card.cardType,
      requirements: card.requirements,
      metadata: card.metadata,
      warning: card.warning,
    };

    ProjectCardProcessor.json.push(vizCardData);
  }
}

class GlobalEventProcessor {
  public static json: Array<any> = [];
  public static makeJson() {
    ALL_EVENTS.forEach((Factory) => {
      const globalEvent = new Factory();
      GlobalEventProcessor.processGlobalEvent(globalEvent);
    });
  }

  private static processGlobalEvent(globalEvent: IGlobalEvent) {
    const vizCardData: IClientGlobalEvent = {
      name: globalEvent.name,
      description: globalEvent.description,
      revealedDelegate: globalEvent.revealedDelegate,
      currentDelegate: globalEvent.currentDelegate,
      renderData: globalEvent.renderData,
    };

    GlobalEventProcessor.json.push(vizCardData);
  }
}

if (!fs.existsSync('src/genfiles')) {
  fs.mkdirSync('src/genfiles');
}

ProjectCardProcessor.makeJson();
GlobalEventProcessor.makeJson();

fs.writeFileSync('src/genfiles/cards.json', JSON.stringify(ProjectCardProcessor.json, null, 2));
fs.writeFileSync('src/genfiles/events.json', JSON.stringify(GlobalEventProcessor.json, null, 2));
