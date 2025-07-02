import {allGlobalEventNames, getGlobalEventOrThrow} from '@/client/turmoil/ClientGlobalEventManifest';
import {getCards} from '@/client/cards/ClientCardManifest';
import {allColonyNames} from '@/client/colonies/ClientColonyManifest';
import {CardComponent} from '@/common/cards/render/CardComponent';
import {isIDescription} from '@/common/cards/render/ICardRenderDescription';
import {isICardRenderCorpBoxAction, isICardRenderCorpBoxEffect, isICardRenderCorpBoxEffectAction, isICardRenderEffect, isICardRenderItem, isICardRenderProductionBox, isICardRenderRoot} from '@/common/cards/render/Types';
import {CardRenderItemType} from '@/common/cards/render/CardRenderItemType';
import {translateText} from '@/client/directives/i18n';
import {getAward, getMilestone} from '../../MilestoneAwardManifest';
import {copyAndClear} from '@/common/utils/utils';
import {awardNames} from '@/common/ma/AwardName';
import {milestoneNames} from '@/common/ma/MilestoneName';

export class SearchIndex {
  private searchIndex: Map<string, Array<string>>;
  private entries: Array<string>;

  private constructor() {
    this.searchIndex = new Map();
    this.entries = [];
  }

  public static create() {
    const instance = new SearchIndex();
    instance.build();
    return instance;
  }

  build() {
    for (const card of getCards(() => true)) {
      this.add(card.name);
      const metadata = card.metadata;
      const description = metadata.description;
      if (description !== undefined) {
        const text = isIDescription(description) ? description.text : description;
        this.add(text);
      }
      if (metadata.renderData) {
        this.process(metadata.renderData);
      }
      this.store('card', card.name);
    }

    for (const colonyName of allColonyNames()) {
      this.add(colonyName);
      this.store('colony', colonyName);
    }

    for (const globalEventName of allGlobalEventNames()) {
      const globalEvent = getGlobalEventOrThrow(globalEventName);
      this.add(globalEvent.name);
      this.add(globalEvent.description);
      this.process(globalEvent.renderData);
      this.store('globalEvent', globalEvent.name);
    }

    for (const milestoneName of milestoneNames) {
      this.add(milestoneName);
      this.add(getMilestone(milestoneName).description);
      this.store('ma', milestoneName);
    }

    for (const awardName of awardNames) {
      this.add(awardName);
      this.add(getAward(awardName).description);
      this.store('ma', awardName);
    }
  }

  public matches(text: string, type: string, name: string) {
    const normalized = this.normalize(text);
    const entries = this.searchIndex.get(`${type}:${name}`);
    return entries?.some((entry) => entry.includes(normalized)) ?? false;
  }

  private process(component: CardComponent) {
    if (isICardRenderItem(component)) {
      if (component.type === CardRenderItemType.TEXT && component.text !== undefined) {
        this.add(component.text);
      }
    } else if (
      isICardRenderRoot(component) ||
      isICardRenderCorpBoxEffect(component) ||
        isICardRenderCorpBoxAction(component) ||
        isICardRenderCorpBoxEffectAction(component) ||
        isICardRenderEffect(component) ||
        isICardRenderProductionBox(component)) {
      component.rows.forEach((row) => {
        row.forEach((item) => {
          if (typeof(item) === 'string') {
            this.add(item);
          } else if (item !== undefined) {
            this.process(item);
          }
        });
      });
    }
  }

  private add(text: string) {
    this.entries.push(this.normalize(text));
  }

  private normalize(text: string): string {
    return translateText(text).toLocaleUpperCase();
  }

  private store(type: string, name: string) {
    this.searchIndex.set(`${type}:${name}`, copyAndClear(this.entries));
  }
}
