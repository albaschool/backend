export interface CreateStorePayload {
  ownerId: string;
  title: string;
  location: string;
  contact: string;
  password: string;
  openTime: string;
  closeTime: string;
}

export interface UpdateStorePayload {
  title: string;
  location: string;
  contact: string;
  password: string;
  openTime: string;
  closeTime: string;
}
