import {IPlayer} from '../IPlayer';
import {selectCardOrOption} from '../inputs/SelectCard';
import {CardResource} from '../../common/CardResource';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';
import {PlayerInput} from '../PlayerInput';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {UnderworldExpansion} from '../underworld/UnderworldExpansion';
import {SelectResource} from '../inputs/SelectResource';
import {message} from '../logs/MessageBuilder';

export class GainAnyResourceButScienceDeferred extends DeferredAction {
  constructor(player: IPlayer) {
    super(player, Priority.GAIN_RESOURCE_OR_PRODUCTION);
  }

  public override execute(): PlayerInput | undefined {
    const orOptions = new OrOptions().setTitle('Select one option');

    const cards = this.player.getResourceCards(undefined).filter((card) => card.resourceType !== CardResource.SCIENCE);
    if (cards.length > 0) {
      orOptions.options.push(selectCardOrOption(cards, {
        title: 'Gain 1 card resource',
        buttonLabel: 'Add resource',
        singleTitle: (card) => message('Add resource to ${0}', (b) => b.card(card)),
        onSelect: (card) => {
          this.player.addResourceTo(card, {log: true});
          return undefined;
        },
      }));
    }
    orOptions.options.push(new SelectResource('Gain 1 standard resource')
      .andThen((resource) => {
        this.player.stock.add(resource, 1, {log: true});
        return undefined;
      }));
    orOptions.options.push(new SelectOption('Gain 1 corruption')
      .andThen(() => {
        UnderworldExpansion.gainCorruption(this.player, 1, {log: true});
        return undefined;
      }));

    return orOptions;
  }
}
