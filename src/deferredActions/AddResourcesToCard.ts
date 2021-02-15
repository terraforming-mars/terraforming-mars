import {Player} from '../Player';
import {SelectCard} from '../inputs/SelectCard';
import {ResourceType} from '../ResourceType';
import {ICard} from '../cards/ICard';
import {LogHelper} from '../LogHelper';
import {Tags} from '../cards/Tags';
import {DeferredAction, Priority} from './DeferredAction';
import {LogBuilder} from '../LogBuilder';

export namespace AddResourcesToCard {
  export interface Options {
    count?: number;
    restrictedTag?: Tags;
    title?: string;
    filter?: (card: ICard) => boolean;
    logMessage?: string;
    logBuilder?: (builder: LogBuilder) => void;
  }
}

export class AddResourcesToCard implements DeferredAction {
  public priority = Priority.GAIN_RESOURCE_OR_PRODUCTION;
  constructor(
        public player: Player,
        public resourceType: ResourceType | undefined,
        public options: AddResourcesToCard.Options = {},
  ) {}

  public execute() {
    const count = this.options.count || 1;
    const title = this.options.title ||
      'Select card to add ' + count + ' ' + (this.resourceType || 'resources') + '(s)';
    let resourceCards = this.player.getResourceCards(this.resourceType);

    if (this.options.restrictedTag !== undefined) {
      resourceCards = resourceCards.filter((card) => card.tags.includes(this.options.restrictedTag!));
    }
    if (this.options.filter !== undefined) {
      resourceCards = resourceCards.filter(this.options.filter);
    }

    if (resourceCards.length === 0) {
      return undefined;
    }

    if (resourceCards.length === 1) {
      this.player.addResourceTo(resourceCards[0], count);
      LogHelper.logAddResource(this.player, resourceCards[0], count);
      return undefined;
    }

    return new SelectCard(
      title,
      'Add resource(s)',
      resourceCards,
      (foundCards: Array<ICard>) => {
        this.player.addResourceTo(foundCards[0], count);
        LogHelper.logAddResource(this.player, foundCards[0], count);
        return undefined;
      },
    );
  }
}
