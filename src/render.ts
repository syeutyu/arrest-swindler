export function renderWarningCount(prefix: string, count: number) {
  const message = count === 0 ? `${prefix}에 검색 결과가 없습니다.` : `🚨 ${prefix} 신고 사례가 ${count}건 있습니다! 조심하세요 🚨`;

  return message;
}
