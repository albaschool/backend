export const restaurantAndCafeEdu = [
  "메뉴 및 레시피",
  "주문 접수 및 POS 시스템 사용법",
  "음료/음식 제조 과정",
  "주방 기구 사용법 및 안전 수칙",
  "위생 관리 지침",
  "테이블 서빙 요령",
  "고객 응대 매뉴얼",
  "매장 청소 및 정리 방법",
];

export const defaultContent = "교육내용을 입력해 주세요.";
export enum StoreType {
  RetaurantAndCafe = "음식점/카페",
  ConvenienceAndMart = "편의점/마트",
  SalesAndService = "판매/서비스",
  Entertainment = "여가/엔터테인먼트",
  Academy = "교육/학원",
}

export const convenienceAndMartEdu = [
  "POS 시스템 사용법",
  "상품 진열 및 재고 관리 방법",
  "연령 제한 상품 판매 규정",
  "택배 및 공과금 수납 절차",
  "폐기 상품 처리 방법",
  "매장 청소 및 위생 관리 지침",
  "도난 방지 및 긴급 상황 대처 요령",
];

export const salesAndServiceEdu = [
  "상품 지식 및 설명 방법",
  "고객 응대 및 상담 기술",
  "재고 관리 및 발주 시스템",
  "결제 시스템 사용법",
  "고객 불만 처리 절차",
  "매장 디스플레이 방법",
  "프로모션 및 할인 정책",
];

export const entertainmentEdu = [
  "시설 이용 안내 및 규칙",
  "티켓 발권 및 예약 시스템 사용법",
  "안전 관리 및 긴급 상황 대처 방법",
  "장비 사용법",
  "고객 안내 및 서비스 제공 요령",
  "청소 및 위생 관리 지침",
  "이벤트 및 프로모션 안내",
];

export const academyEdu = [
  "수업 보조 및 학생 관리 방법",
  "교육 자료 준비 및 관리 요령",
  "출석 체크 및 학사 관리 시스템 사용법",
  "학부모 응대 요령",
  "교육 기자재 사용법",
  "긴급 상황 (안전사고 등) 대처 방법",
  "개인정보 보호 및 보안 규정",
];

export interface CreateEducationPagePayload {
  id: string;
  title: string;
  content: string;
  storeId: string;
}
