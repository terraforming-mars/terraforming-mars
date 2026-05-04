import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {PlaceCityTile} from '../../deferredActions/PlaceCityTile';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {message} from '../../logs/MessageBuilder';
import {LoseProduction} from '../../deferredActions/LoseProduction';
import {Resource} from '../../../common/Resource';
import {MarsBoard} from '../../boards/MarsBoard';

export class NoctisCity extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.NOCTIS_CITY,
      tags: [Tag.CITY, Tag.BUILDING],
      cost: 18,

      behavior: {
        production: {megacredits: 3},
      },

      metadata: {
        cardNumber: '017',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().megacredits(3);
          }).nbsp.city().asterix();
        }),
        description: 'Decrease your energy production 1 step and increase your M€ production 3 steps. Place a city tile ON THE RESERVED AREA, disregarding normal placement restrictions.',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    const noctisCitySpaceId = player.game.board.noctisCitySpaceId;
    if (noctisCitySpaceId !== undefined) {
      // Noctis reserved space has no energy production bonus; player must already have >= 1.
      return player.production.energy >= 1;
    }
    const availableSpaces = player.game.board.getAvailableSpacesForCity(player);
    if (availableSpaces.length === 0) return false;
    return MarsBoard.hasEnergyCoverage(player, availableSpaces);
  }

  public override bespokePlay(player: IPlayer) {
    const noctisCitySpaceId = player.game.board.noctisCitySpaceId;
    if (noctisCitySpaceId !== undefined) {
      const space = player.game.board.getSpaceOrThrow(noctisCitySpaceId);
      player.game.addCity(player, space);
      player.production.add(Resource.ENERGY, -1, {log: true});
    } else {
      const spaces = MarsBoard.filterForEnergy(player, player.game.board.getAvailableSpacesForCity(player));
      player.game.defer(
        new PlaceCityTile(player, {
          title: message('Select space for ${0}', (b) => b.card(this)),
          spaces,
        }),
      ).andThen(() => {
        player.game.defer(new LoseProduction(player, Resource.ENERGY, {count: 1}));
      });
    }
    return undefined;
  }
}
