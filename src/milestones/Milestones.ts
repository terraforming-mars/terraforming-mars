import { Terraformer } from "./Terraformer";
import { Mayor } from "./Mayor";
import { Gardener } from "./Gardener";
import { Builder } from "./Builder";
import { Planner } from "./Planner";
import { IMilestone } from "./IMilestone";
import { Hoverlord } from './Hoverlord';

export const ORIGINAL_MILESTONES: Array<IMilestone> = [
    new Terraformer(),
    new Mayor(),
    new Gardener(),
    new Builder(),
    new Planner(),
    new Hoverlord()
]