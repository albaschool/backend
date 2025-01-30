export interface CreateSchedulePayload {
  userId: string;
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
