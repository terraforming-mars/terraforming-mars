import { IMilestone } from "../milestones/IMilestone";

export interface IMilestoneScore {
    playerName: string;
    playerScore: number;
}

export interface ClaimedMilestoneModel {
    milestone: IMilestone;
    player_name: string;
    player_color: string;
    scores: Array<IMilestoneScore>;
}
