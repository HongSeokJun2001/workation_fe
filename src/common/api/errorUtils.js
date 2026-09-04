// axios 에러 응답이 문자열이 아닌 경우(서버 예외의 기본 JSON 응답 등)에도
// alert/화면에 "[object Object]"가 표시되지 않도록 항상 문자열 메시지로 변환한다.
export function extractErrorMessage(error, fallback) {
    const data = error?.response?.data;

    if (typeof data === "string" && data.trim() !== "") {
        return data;
    }

    if (data && typeof data === "object") {
        if (typeof data.message === "string" && data.message.trim() !== "") {
            return data.message;
        }
        if (typeof data.error === "string" && data.error.trim() !== "") {
            return data.error;
        }
    }

    return fallback;
}
