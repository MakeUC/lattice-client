import { Omit } from "@material-ui/core";

export interface Profile {
  id: string
  name: string
  skills: Array<string>
  idea: string
  lookingFor: string[]
  started: boolean
  completed: boolean
  visible: boolean
  completedTours?: string[]
}

export interface ScoredProfile extends Profile {
  score?: number
}

export interface HydratedProfile extends Omit<ScoredProfile, 'skills' | 'lookingFor'> {
  skills: Array<Skill>
  lookingFor: Array<Skill>
}

export interface Skill {
  title: string
  icon: string
}
