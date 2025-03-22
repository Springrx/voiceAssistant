import React, { useState, useRef, useEffect } from "react";
import { Play, PauseOne } from '@icon-park/react';
import { introOnHome } from '../component/config';
import './home.css';
import { microphone, stopIcon, avatar } from '../svg';
import { getLLMResponse } from './service';
import Tips from "./tips";
import { Spin } from 'antd';

function VoiceAssistant({history, setHistory, speech, setSpeech, speaking, stopSpeaking}) {
  const [recordingState, setRecordingState] = useState("idle"); // 是否正在转录 "idle", "recording", "paused","waiting"(等待大模型回应中)
  const recordingStateRef = useRef("idle"); // 转录的即时状态
  const transcriptionRef = useRef(""); // 用于存储转录后的文本
  const recognitionRef = useRef(null); // 语音识别实例引用
  const isListeningRef = useRef(false); // 是否正在监听
  const [loading, setLoading] = useState(false);
  const handleTipButtonClick = (value) => {
    setSpeech(value); // 点击问题列表后语音说出问题的答案
  };


  // 初始化语音识别
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("SpeechRecognition API is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "zh-CN"; // 设置语言
    recognition.interimResults = false; // 不返回临时结果
    recognition.continuous = true; // 连续识别
    recognition.onresult = async (event) => {
      let transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join("");  // 新识别到的文本
      const realTranscript = transcriptionRef.current + transcript;  // 目前为止识别到的文本
      if (recordingStateRef.current === "idle" && realTranscript !== '') { // 当不再录音，且有识别到的文本时
        console.log("uploadQuesToBackend Transcript:", realTranscript);
        const answer = await uploadQuesToBackend(realTranscript); // 上传文本到后端
        setHistory(history => [...history, realTranscript, answer]); // 添加文本到历史问答
        transcriptionRef.current = ""; // 清空转录文本
        isListeningRef.current = false;
        setSpeech(answer);
      }
      else {
        transcriptionRef.current = realTranscript; // 累加转录文本
      }
    };

    recognition.onend = async () => {
      console.log('enter onend');
      if (recordingStateRef.current === "idle" && transcriptionRef.current !== "") {
        const realTranscript = transcriptionRef.current
        console.log("uploadQuesToBackend Transcript:", realTranscript);
        const answer = await uploadQuesToBackend(realTranscript); // 上传文本到后端
        setHistory(history => [...history, realTranscript, answer]); // 添加文本到历史问答
        transcriptionRef.current = ""; // 清空转录文本
        isListeningRef.current = false;
        setSpeech(answer);
      }
    }
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
    recognitionRef.current = recognition;
  }, []);

  const updateRecordingState = (state) => {
    setRecordingState(state);
    recordingStateRef.current = state; // 同步更新 ref
  };

  // 开始转录
  const startRecognition = () => {
    if (recognitionRef.current) {
      updateRecordingState("recording");
      recognitionRef.current.start();
      isListeningRef.current = true;
    }
  };

  // 暂停转录
  const pauseRecognition = () => {
    if (recognitionRef.current) {
      updateRecordingState("paused");
      recognitionRef.current.stop();
      isListeningRef.current = false;
    }
  };

  // 恢复转录
  const resumeRecognition = () => {
    if (recognitionRef.current) {
      updateRecordingState("recording");
      recognitionRef.current.start();
      isListeningRef.current = true;
    }
  };

  // 停止转录
  const stopRecognition = () => {
    if (recognitionRef.current) {
      if (!isListeningRef.current) {
        recognitionRef.current.start();
      }
      updateRecordingState("idle");
      recognitionRef.current.stop();
    }
  };

  // 上传文本到后端
  const uploadQuesToBackend = async (transcript) => {
    try {
      console.log("transcript", transcript);
      setLoading(true);
      const feedback = await getLLMResponse(transcript); // 调用后端接口获取响应
      console.log("feedback", feedback);
      return feedback.feedback;
    } catch (error) {
      console.error("Error occur when get LLM response", error);
    } finally{
      setLoading(false); 
    }
  };

  //测试按钮
  const testButton = async (text) => {
    try {
      const feedback = await getLLMResponse(text);
      console.log("feedback", feedback);
      setHistory([...history, text, feedback.feedback]);
    } catch (error) {
      console.error("Error occur when get LLM response", error)
    }
  }

  return (
      <div className={`assistant-container ${history.length === 0 ? 'full-width' : 'half-width'}`}>
        <div className="imagePlaceholder">
          {avatar}
        </div>
        {!speaking && <div className="feedback">
          {introOnHome}
        </div>}

        {/* 仅在不进行语音合成时显示交互按钮和提示 */}
        {!speaking ? (
          <>
            <div className="interaction-btn" style={{ justifyContent: recordingState === "idle" ? 'center' : 'space-between' }}>
              {recordingState === "idle" ? (
                loading ? <Spin size="large"/> : (
                  <div style={{ justifySelf: 'center' }} onClick={startRecognition}>{microphone}</div>
                )
              ) : null}
              {recordingState === "recording" && (
                <>
                  <PauseOne onClick={pauseRecognition} theme="filled" size="60" fill="#333333" />
                  <div onClick={stopRecognition}>
                    {stopIcon}
                  </div>
                </>
              )}
              {recordingState === "paused" && (
                <>
                  <Play onClick={resumeRecognition} theme="filled" size="60" fill="#333333" />
                  <div onClick={stopRecognition}>
                    {stopIcon}
                  </div>
                </>
              )}
             
            </div>
            <Tips onButtonClick={handleTipButtonClick} />
          </>
        ) : <>
          <div className="speaking-words">
            {speech}
          </div>
          <div className="interaction-btn" style={{justifyContent: 'center'}}>
              {speaking === true && (
                <div onClick={stopSpeaking}>
                  {stopIcon}
                </div>
              )}
          </div>
        </>}
      </div>
  );
}

function Conversation ({history, setSpeech}) {
  return (
    <div className = "conversation-container">
      {history.map((message, index) => (
        <div key={index} className={index % 2 === 0 ? "message left" : "message right"} onClick = {() => setSpeech(message)}>
          {message}
        </div>
      ))}
    </div>
  )
}

function Home() {
  const [history, setHistory] = useState([])  //聊天记录，voiceassistant改变它，conversation使用它
  const [speech, setSpeech] = useState(''); // 用于存储需要语音合成的数据
  const [speaking, setSpeaking] = useState(false); // AI小助手是否正在语音输出

  const synth = window.speechSynthesis; // 语音合成实例
  // 合成语音
  useEffect(() => {
    if (speech !== '') {
      speechSynthesis.cancel(); // 清除可能正在播放的语音
      const utterance = new SpeechSynthesisUtterance(speech);
      setSpeaking(true);  // 开始语音输出
      utterance.onend = () => {
        setSpeech(''); // 语音播放完毕后清空
        setSpeaking(false);  // 停止语音输出
      };
      synth.speak(utterance);
    }
  }, [speech]);
  // 停止语音输出
  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setSpeaking(false);
    setSpeech('');
  }
  return (
    <div className = "container">      
      <VoiceAssistant      
        history = {history} setHistory = {setHistory} 
        speech = {speech} setSpeech = {setSpeech}
        speaking = {speaking} stopSpeaking = {stopSpeaking}
        />
       {history.length>0&&<Conversation 
        history = {history} 
        setSpeech = {setSpeech}
        />}
    </div>
  )
}

export default Home;