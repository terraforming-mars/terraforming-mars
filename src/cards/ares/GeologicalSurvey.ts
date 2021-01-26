import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ISpace} from '../../boards/ISpace';
import {SpaceBonus} from '../../SpaceBonus';
import {SpaceType} from '../../SpaceType';
import {Resources} from '../../Resources';
import {GainResources} from '../../deferredActions/GainResources';
import {Phase} from '../../Phase';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class GeologicalSurvey extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.GEOLOGICAL_SURVEY,
      tags: [Tags.SCIENCE],
      cost: 8,

      metadata: {
        cardNumber: 'A09',
        requirements: CardRequirements.builder((b) => b.greeneries(5).any().max()),
        renderData: CardRenderer.builder((b) => {
          b.effect('When placing a tile grants you any steel, titanium, or heat, you gain one additional of each of those resources that you gain.', (eb) => {
            eb.emptyTile().startEffect;
            eb.plus().steel(1).titanium(1).heat(1);
          });
        }),
        description: 'Requires 5 or fewer greeneries on Mars.',
      },
    });
  }

  private hasAdjacencyBonus(player: Player, space: ISpace, bonus: SpaceBonus) {
    return player.game.board.getAdjacentSpaces(space).some((adj) => adj.adjacency?.bonus.includes(bonus));
  }

  public onTilePlaced(player: Player, space: ISpace) {
    if (player.game.phase === Phase.SOLAR || player.id !== space.player?.id) {
      return;
    }

    // Steel, Titanium and Heat
    ([[Resources.STEEL, SpaceBonus.STEEL], [Resources.TITANIUM, SpaceBonus.TITANIUM], [Resources.HEAT, SpaceBonus.HEAT]] as [Resources, SpaceBonus][]).forEach(([resource, bonus]) => {
      if ((resource === Resources.STEEL && space.spaceType !== SpaceType.COLONY) ||
          space.bonus.includes(bonus) ||
          this.hasAdjacencyBonus(player, space, bonus)) {
        player.game.defer(new GainResources(
          player,
          resource,
          {
            logMessage: '${0} gained a bonus ${1} because of ${2}',
            logBuilder: (b) => b.player(player).string(resource).cardName(this.name),
          }));
      }
    });
  }

  public play() {
    return undefined;
  }
}
