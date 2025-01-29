export const defaultContent = "교육내용을 입력해 주세요.";
export interface CreateEducationPagePayload {
  id: string;
  title: string;
  content: string;
  storeId: string;
}

export interface CreateEducationPayload {
  title: string;
  content: string;
  img?: Buffer;
  mimeType?: string;
}

export interface UpdateEducationPayload extends Partial<CreateEducationPayload> {
  deleteImg: boolean;
}
