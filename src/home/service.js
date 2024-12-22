import fetch from '../component/fetch';

export function getLLMResponse(question) {
    // return fetch({
    //     url: '/api/llmResponse',
    //     method: 'post',
    //     data: { "question": question }
    // });
    // mock api: {"code":200,"message": "ok","data": {"feedback": "i am a chatbot"}}
    return {"feedback": "i am a chatbot"}
}
// 获取问题列表
export function getQuesList() {
    // return fetch({
    //     url: '/api/quesList',
    //     method: 'get'
    // });
    return {"questions": [{"question": "aaa", "answer": "aaa"}]}
    // mock api: {"code":200,"message": "ok","data": {"questions": [{"question": "aaa", "answer": "aaa"}]}}
}