import { CardName } from '../../../common/cards/CardName';
import { CardType } from '../../../common/cards/CardType';
import { Player } from '../../Player';
import { PlayerInput } from '../../PlayerInput';
import { Card } from '../Card';
import { CardRenderer } from '../render/CardRenderer';
import { LeaderCard } from './LeaderCard';

// import {SpaceBonus} from '../../../common/boards/SpaceBonus';
// import {MultiSet} from 'mnemonist';

export class Jansson extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.JANSSON,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L10',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().emptyTile().wild(1).asterix();
        }),
        description: 'Once per game, gain all placement bonuses under your tiles on Mars.',
      },
    });
  }

  public isDisabled = false;

  public override play() {
    return undefined;
  }

  public canAct(): boolean {
    return this.isDisabled === false;
  }

  public action(player: Player): PlayerInput | undefined {
		const spaces = player.game.board.spaces.filter((space) => space.tile !== undefined && space.player === player);
		spaces.forEach((space) => {
			player.game.grantSpaceBonuses(player, space);
		});

		this.isDisabled = true;

		return undefined;
  }
}

