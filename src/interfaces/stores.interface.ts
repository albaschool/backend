export interface CreateStorePayload {
  ownerId: string;
  title: string;
  location: string;
  contact: string;
  password: string;
  openTime: string;
  closeTime: string;
  salt: string;
  bizRegistrationNum: string;
}

export interface UpdateStorePayload {
  title: string;
  location: string;
  contact: string;
  password: string;
  openTime: string;
  closeTime: string;
  salt: string;
}

export interface AddStoreMemberPayload {
  password: string;
}
