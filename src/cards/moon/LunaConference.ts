import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardRenderer} from '../render/CardRenderer';
import {PartyName} from '../../common/turmoil/PartyName';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {TileType} from '../../common/TileType';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {Size} from '../../common/cards/render/Size';
import {Resources} from '../../common/Resources';
import {all} from '../Options';

export class LunaConference extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNA_CONFERENCE,
      cardType: CardType.EVENT,
      tags: [Tags.SCIENCE, Tags.MOON],
      cost: 5,
      requirements: CardRequirements.builder((b) => b.party(PartyName.SCIENTISTS)),

      metadata: {
        description: 'Requires that Scientists are ruling or that you have 2 delegates there. ' +
        'Gain 2 M€ per road tile on the Moon. Gain 2M€ per colony tile on the Moon.',
        cardNumber: 'M58',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(2).slash().moonRoad({size: Size.SMALL, all}).br;
          b.megacredits(2).slash().moonColony({size: Size.SMALL, all}).br;
        }),
      },
    });
  }

  public play(player: Player) {
    const moonRoadCount = MoonExpansion.spaces(player.game, TileType.MOON_ROAD, {surfaceOnly: true}).length;
    const moonColonyCount = MoonExpansion.spaces(player.game, TileType.MOON_COLONY, {surfaceOnly: true}).length;
    player.addResource(Resources.MEGACREDITS, (moonRoadCount + moonColonyCount) * 2, {log: true});

    return undefined;
  }
}
