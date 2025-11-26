import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {IPlayer} from '@/server/IPlayer';
import {OrOptions} from '@/server/inputs/OrOptions';
import {PlayerInput} from '@/server/PlayerInput';
import {CardName} from '@/common/cards/CardName';
import {SelectOption} from '@/server/inputs/SelectOption';
import {CardResource} from '@/common/CardResource';
import {RemoveAnyPlants} from '@/server/deferredActions/RemoveAnyPlants';
import {RemoveResourcesFromCard} from '@/server/deferredActions/RemoveResourcesFromCard';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {all, digit} from '@/server/cards/Options';

export class Virus extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.VIRUS,
      tags: [Tag.MICROBE],
      cost: 1,

      metadata: {
        cardNumber: '050',
        renderData: CardRenderer.builder((b) => {
          b.minus().resource(CardResource.ANIMAL, {amount: 2, all, digit}).nbsp;
          b.or().nbsp.minus().plants(5, {all, digit});
        }),
        description: 'Remove up to 2 animals or 5 plants from any player.',
      },
    });
  }
  public override bespokePlay(player: IPlayer): PlayerInput | undefined {
    if (player.game.isSoloMode()) {
      // TODO(kberg): Special case for Mons Insurance owner.
      player.game.someoneHasRemovedOtherPlayersPlants = true;
      return undefined;
    }

    const orOptionsAnimals = new RemoveResourcesFromCard(player, CardResource.ANIMAL, 2, {mandatory: false, log: true}).execute() as OrOptions;
    const removeAnimals = orOptionsAnimals !== undefined ?
      orOptionsAnimals.options[0] :
      undefined;

    const orOptionsPlants = new RemoveAnyPlants(player, 5).execute();
    const removePlants = orOptionsPlants !== undefined ?
      orOptionsPlants.options.slice(0, -1) :
      undefined;

    // If no other player has resources to remove
    // assume player will remove nothing from themselves
    if (removeAnimals === undefined && removePlants === undefined) {
      player.game.log('There was nobody to steal plants or animals from.');
      return undefined;
    }

    const orOptions = new OrOptions();
    if (removeAnimals !== undefined) {
      orOptions.options.push(removeAnimals);
    }
    if (removePlants !== undefined) {
      orOptions.options.push(...removePlants);
    }
    orOptions.options.push(new SelectOption('Skip removal'));

    return orOptions;
  }
}
