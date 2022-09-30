import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {ISpace} from '../../boards/ISpace';
import {SelectSpace} from '../../inputs/SelectSpace';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {Priority} from '../../deferredActions/DeferredAction';
import {GainProduction} from '../../deferredActions/GainProduction';
import {LoseProduction} from '../../deferredActions/LoseProduction';
import {Board} from '../../boards/Board';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class ImmigrantCity extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.IMMIGRANT_CITY,
      tags: [Tag.CITY, Tag.BUILDING],
      cost: 13,

      metadata: {
        cardNumber: '200',
        renderData: CardRenderer.builder((b) => {
          b.effect('When a City tile is placed, including this, increase your M€ production 1 step.', (eb) => {
            eb.city({all}).startEffect.production((pb) => pb.megacredits(1));
          }).br;
          b.production((pb) => pb.minus().energy(1).megacredits(-2)).city();
        }),
        description: 'Decrease your energy production 1 step and decrease your M€ production 2 steps. Place a City tile.',
      },
    });
  }

  public override bespokeCanPlay(player: Player): boolean {
    const hasEnergyProduction = player.production.energy >= 1;
    const canPlaceCityOnMars = player.game.board.getAvailableSpacesForCity(player).length > 0;
    const canDecreaseMcProduction = player.production.megacredits >= -4 || player.isCorporation(CardName.THARSIS_REPUBLIC);

    return hasEnergyProduction && canDecreaseMcProduction && canPlaceCityOnMars;
  }

  public onTilePlaced(cardOwner: Player, activePlayer: Player, space: ISpace) {
    if (Board.isCitySpace(space)) {
      cardOwner.game.defer(
        new GainProduction(cardOwner, Resources.MEGACREDITS),
        cardOwner.id !== activePlayer.id ? Priority.OPPONENT_TRIGGER : undefined,
      );
    }
  }

  public override bespokePlay(player: Player) {
    return new SelectSpace('Select space for city tile', player.game.board.getAvailableSpacesForCity(player), (space: ISpace) => {
      player.game.addCityTile(player, space.id);
      player.game.defer(new LoseProduction(player, Resources.ENERGY, {count: 1}));
      player.game.defer(new LoseProduction(player, Resources.MEGACREDITS, {count: 2}));
      return undefined;
    });
  }
}
