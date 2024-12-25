import fetch from '../component/fetch';

export async function getLLMResponse(question) {
    return fetch({
        url: '/api/voice/response',
        method: 'post',
        data: { "question": question }
    });
    // mock api: {"code":200,"message": "ok","data": {"feedback": "i am a chatbot"}}
    // return {"feedback": "i am a chatbot"}
}
// 获取问题列表，目前还没有被调用
export function getQuesList() {
    // return fetch({
    //     url: '/api/quesList',
    //     method: 'get'
    // });
    return { "questions": [{ "question": "高血压饮食需要注意什么", "answer": "您好，高血压饮食建议少盐、多蔬果，适量全谷物和低脂蛋白，避免加工食品和高糖饮料，保持均衡即可。" }] }
    // mock api: {"code":200,"message": "ok","data": {"questions": [{"question": "aaa", "answer": "aaa"}]}}
}