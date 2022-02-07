import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {ISpace} from '../../boards/ISpace';
import {CardName} from '../../common/cards/CardName';
import {Resources} from '../../common/Resources';
import {Priority} from '../../deferredActions/DeferredAction';
import {GainResources} from '../../deferredActions/GainResources';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {all, max} from '../Options';
import {Board} from '../../boards/Board';

export class ArcticAlgae extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.ARCTIC_ALGAE,
      tags: [Tags.PLANT],
      cost: 12,

      requirements: CardRequirements.builder((b) => b.temperature(-12, {max})),
      metadata: {
        description: 'It must be -12 C or colder to play. Gain 1 plant.',
        cardNumber: '023',
        renderData: CardRenderer.builder((b) => {
          b.effect('When anyone places an ocean tile, gain 2 plants.', (be) => be.oceans(1, {all}).startEffect.plants(2)).br;
          b.plants(1);
        }),
      },
    });
  }

  public onTilePlaced(cardOwner: Player, activePlayer: Player, space: ISpace) {
    if (Board.isUncoveredOceanSpace(space)) {
      cardOwner.game.defer(
        new GainResources(cardOwner, Resources.PLANTS, {
          count: 2,
          cb: () => activePlayer.game.log(
            '${0} gained 2 ${1} from ${2}',
            (b) => b.player(cardOwner).string(Resources.PLANTS).cardName(this.name)),
        }),
        cardOwner.id !== activePlayer.id ? Priority.OPPONENT_TRIGGER : undefined,
      );
    }
  }

  public play(player: Player) {
    player.plants++;
    return undefined;
  }
}
