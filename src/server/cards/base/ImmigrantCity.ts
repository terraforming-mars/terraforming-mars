import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {Space} from '../../boards/Space';
import {SelectSpace} from '../../inputs/SelectSpace';
import {Resource} from '../../../common/Resource';
import {CardName} from '../../../common/cards/CardName';
import {Priority} from '../../deferredActions/Priority';
import {GainProduction} from '../../deferredActions/GainProduction';
import {LoseProduction} from '../../deferredActions/LoseProduction';
import {Board} from '../../boards/Board';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class ImmigrantCity extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.IMMIGRANT_CITY,
      tags: [Tag.CITY, Tag.BUILDING],
      cost: 13,

      metadata: {
        cardNumber: '200',
        renderData: CardRenderer.builder((b) => {
          b.effect('When a city tile is placed, including this, increase your M€ production 1 step.', (eb) => {
            eb.city({all}).startEffect.production((pb) => pb.megacredits(1));
          }).br;
          b.production((pb) => pb.minus().energy(1).megacredits(-2)).city();
        }),
        description: 'Decrease your energy production 1 step and decrease your M€ production 2 steps. Place a city tile.',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    const hasEnergyProduction = player.production.energy >= 1;
    const canPlaceCityOnMars = player.game.board.getAvailableSpacesForCity(player).length > 0;
    const canDecreaseMcProduction = player.production.megacredits >= -4 || player.isCorporation(CardName.THARSIS_REPUBLIC);

    return hasEnergyProduction && canDecreaseMcProduction && canPlaceCityOnMars;
  }

  public onTilePlaced(cardOwner: IPlayer, activePlayer: IPlayer, space: Space) {
    if (Board.isCitySpace(space)) {
      cardOwner.game.defer(
        new GainProduction(cardOwner, Resource.MEGACREDITS),
        cardOwner.id !== activePlayer.id ? Priority.OPPONENT_TRIGGER : undefined,
      );
    }
  }

  public override bespokePlay(player: IPlayer) {
    return new SelectSpace('Select space for city tile', player.game.board.getAvailableSpacesForCity(player))
      .andThen((space) => {
        player.game.addCity(player, space);
        player.game.defer(new LoseProduction(player, Resource.ENERGY, {count: 1}));
        player.game.defer(new LoseProduction(player, Resource.MEGACREDITS, {count: 2}));
        return undefined;
      });
  }
}
