export interface CreateSchedulePayload {
  userId: string;
  storeId: string;
  dayOfWeek: number;
  content: string;
  startTime: string;
  endTime: string;
}

export interface UpdateSchedulePayload {
  dayOfWeek: number;
  content: string;
  startTime: string;
  endTime: string;
}
