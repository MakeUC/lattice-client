import { Profile } from "./profile"

export interface Notification {
  id: string
  from: string
  to: string
  read: boolean
}

export interface NotificationDetails {
  notification: Notification
  to: Profile
}

export interface Subscription {
  id: string
  hackerId: string
  subscription: PushSubscription
}