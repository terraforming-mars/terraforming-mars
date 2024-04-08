import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {OrOptions} from '../../inputs/OrOptions';
import {PlayerInput} from '../../PlayerInput';
import {CardName} from '../../../common/cards/CardName';
import {SelectOption} from '../../inputs/SelectOption';
import {CardResource} from '../../../common/CardResource';
import {RemoveAnyPlants} from '../../deferredActions/RemoveAnyPlants';
import {RemoveResourcesFromCard} from '../../deferredActions/RemoveResourcesFromCard';
import {CardRenderer} from '../render/CardRenderer';
import {all, digit} from '../Options';

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
          b.minus().animals(2, {all, digit}).nbsp;
          b.or().nbsp.minus().plants(5, {all, digit});
        }),
        description: 'Remove up to 2 animals or 5 plants from any player.',
      },
    });
  }
  public override bespokePlay(player: IPlayer): PlayerInput | undefined {
    if (player.game.isSoloMode()) {
      player.game.someoneHasRemovedOtherPlayersPlants = true;
      return undefined;
    }

    const orOptionsAnimals = new RemoveResourcesFromCard(player, CardResource.ANIMAL, 2, {mandatory: false}).execute() as OrOptions;
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
