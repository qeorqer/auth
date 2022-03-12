export type userType = {
  email: string
  password: string
  isActivated: boolean
  activationLink: string
}

export type tokenType = {
  tokenId: string
  userId: string
  expireAt: Date
}
