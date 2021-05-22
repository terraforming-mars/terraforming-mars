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
import {PartyName} from '../../turmoil/parties/PartyName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {TurmoilPolicy} from '../../turmoil/TurmoilPolicy';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {BoardType} from '../../boards/BoardType';

export class GeologicalSurvey extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.GEOLOGICAL_SURVEY,
      tags: [Tags.SCIENCE],
      cost: 8,

      requirements: CardRequirements.builder((b) => b.greeneries(5).any().max()),
      metadata: {
        cardNumber: 'A09',
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

  private anyAdjacentSpaceGivesBonus(player: Player, space: ISpace, bonus: SpaceBonus): boolean {
    return player.game.board.getAdjacentSpaces(space).some((adj) => adj.adjacency?.bonus.includes(bonus));
  }

  public onTilePlaced(cardOwner: Player, activePlayer: Player, space: ISpace, boardType: BoardType) {
    // Adjacency bonuses are only available on Mars.
    if (boardType !== BoardType.MARS) {
      return;
    }
    if (cardOwner.game.phase === Phase.SOLAR || cardOwner.id !== activePlayer.id) {
      return;
    }

    // Steel, Titanium and Heat
    ([[Resources.STEEL, SpaceBonus.STEEL], [Resources.TITANIUM, SpaceBonus.TITANIUM], [Resources.HEAT, SpaceBonus.HEAT]] as [Resources, SpaceBonus][]).forEach(([resource, bonus]) => {
      if ((resource === Resources.STEEL && space.spaceType !== SpaceType.COLONY && PartyHooks.shouldApplyPolicy(cardOwner.game, PartyName.MARS, TurmoilPolicy. MARS_FIRST_DEFAULT_POLICY)) ||
          space.bonus.includes(bonus) ||
          this.anyAdjacentSpaceGivesBonus(cardOwner, space, bonus)) {
        cardOwner.game.defer(new GainResources(
          cardOwner,
          resource,
          {
            cb: () => activePlayer.game.log(
              '${0} gained a bonus ${1} because of ${2}',
              (b) => b.player(cardOwner).string(resource).cardName(this.name)),
          }));
      }
    });
  }

  public play() {
    return undefined;
  }
}
