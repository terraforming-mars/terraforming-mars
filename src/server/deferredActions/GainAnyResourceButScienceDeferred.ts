import {IPlayer} from '@/server/IPlayer';
import {SelectCard} from '@/server/inputs/SelectCard';
import {CardResource} from '@/common/CardResource';
import {DeferredAction} from '@/server/deferredActions/DeferredAction';
import {Priority} from '@/server/deferredActions/Priority';
import {PlayerInput} from '@/server/PlayerInput';
import {Units} from '@/common/Units';
import {OrOptions} from '@/server/inputs/OrOptions';
import {SelectOption} from '@/server/inputs/SelectOption';
import {UnderworldExpansion} from '@/server/underworld/UnderworldExpansion';
import {SelectResource} from '@/server/inputs/SelectResource';

export class GainAnyResourceButScienceDeferred extends DeferredAction {
  constructor(player: IPlayer) {
    super(player, Priority.GAIN_RESOURCE_OR_PRODUCTION);
  }

  public override execute(): PlayerInput | undefined {
    const orOptions = new OrOptions().setTitle('Select one option');

    const cards = this.player.getResourceCards(undefined).filter((card) => card.resourceType !== CardResource.SCIENCE);
    if (cards.length > 0) {
      orOptions.options.push(new SelectCard('Gain 1 card resource', undefined, cards)
        .andThen(([card]) => {
          this.player.addResourceTo(card, {log: true});
          return undefined;
        }));
    }
    orOptions.options.push(new SelectResource('Gain 1 standard resource')
      .andThen((resource) => {
        this.player.stock.add(Units.ResourceMap[resource], 1, {log: true});
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
