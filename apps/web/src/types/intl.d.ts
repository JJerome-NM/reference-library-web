import en from "../../messages/en"

type Messages = typeof en

declare global {
  type IntlMessages = Messages
}
