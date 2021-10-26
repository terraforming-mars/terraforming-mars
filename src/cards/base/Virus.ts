import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {OrOptions} from '../../inputs/OrOptions';
import {PlayerInput} from '../../PlayerInput';
import {CardName} from '../../CardName';
import {SelectOption} from '../../inputs/SelectOption';
import {ResourceType} from '../../ResourceType';
import {RemoveAnyPlants} from '../../deferredActions/RemoveAnyPlants';
import {RemoveResourcesFromCard} from '../../deferredActions/RemoveResourcesFromCard';
import {CardRenderer} from '../render/CardRenderer';
import {all, digit} from '../Options';

export class Virus extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.VIRUS,
      tags: [Tags.MICROBE],
      cost: 1,

      metadata: {
        cardNumber: '050',
        renderData: CardRenderer.builder((b) => {
          b.minus().animals(2, {all, digit}).nbsp;
          b.or().nbsp.minus().plants(5, {all, digit});
        }),
        description: 'Remove up to 2 Animals or 5 Plants from any player.',
      },
    });
  }
  public play(player: Player): PlayerInput | undefined {
    if (player.game.getPlayers().length === 1) {
      player.game.someoneHasRemovedOtherPlayersPlants = true;
      return undefined;
    }

    const orOptionsAnimals = (new RemoveResourcesFromCard(player, ResourceType.ANIMAL, 2, false, false)).execute() as OrOptions;
    const removeAnimals = orOptionsAnimals !== undefined ?
      orOptionsAnimals.options[0] :
      undefined;

    const orOptionsPlants = (new RemoveAnyPlants(player, 5)).execute() as OrOptions;
    const removePlants = orOptionsPlants !== undefined ?
      orOptionsPlants.options.slice(0, -1) :
      undefined;

    // If no other player has resources to remove
    // assume player will remove nothing from themselves
    if (removeAnimals === undefined && removePlants === undefined) {
      return undefined;
    }

    const orOptions = new OrOptions();
    if (removeAnimals !== undefined) {
      orOptions.options.push(removeAnimals);
    }
    if (removePlants !== undefined) {
      orOptions.options.push(...removePlants);
    }
    orOptions.options.push(new SelectOption('Skip removal', 'Confirm', () => {
      return undefined;
    }));

    return orOptions;
  }
}
