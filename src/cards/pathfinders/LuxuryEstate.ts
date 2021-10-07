import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';
import {Tags} from '../Tags';
import {CardRequirements} from '../CardRequirements';
import {TileType} from '../../TileType';

export class LuxuryEstate extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.LUXURY_ESTATE,
      cost: 12,
      tags: [Tags.EARTH, Tags.MARS, Tags.BUILDING],
      requirements: CardRequirements.builder((b) => b.oxygen(7)),

      metadata: {
        cardNumber: 'Pf21',
        renderData: CardRenderer.builder((b) => {
          b.titanium(1).slash().city().plus().greenery();
        }),
        description: 'Oxygen must be 7% or greater. Gain 1 titanium for each city tile and greenery tile you own.',
      },
    });
  }

  public play(player: Player) {
    const count = player.getCitiesCount() + player.game.getSpaceCount(TileType.GREENERY, player);
    player.addResource(Resources.TITANIUM, count, {log: true});
    return undefined;
  }
}

