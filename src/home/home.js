import React, { useState, useRef, useEffect } from "react";
import { Play, PauseOne } from '@icon-park/react';
import { introOnHome } from '../component/config';
import './home.css';
import { microphone, stopIcon, avatar } from '../svg';
import { getLLMResponse } from './service';
import Tips from "./tips";

function VoiceAssistant() {
  const [recordingState, setRecordingState] = useState("idle"); // "idle", "recording", "paused"
  const recordingStateRef = useRef("idle"); // 即时状态
  const [resFromLLM, setResFromLLM] = useState(''); // 用于存储需要语音合成的数据
  const transcriptionRef = useRef(""); // 用于存储转录后的文本
  const recognitionRef = useRef(null); // 语音识别实例引用
  const synth = window.speechSynthesis; // 语音合成实例
  const isListeningRef = useRef(false); // 是否正在监听
  const handleTipButtonClick = (value) => {
    setResFromLLM(value); // 点击问题列表后语音说出问题的答案
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
      debugger
      let transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join("");
      const realTranscript = transcriptionRef.current + transcript;
      if (recordingStateRef.current === "idle" && realTranscript !== '') {
        console.log("uploadQuesToBackend Transcript:", realTranscript);
        const answer = await uploadQuesToBackend(realTranscript); // 上传文本到后端
        transcriptionRef.current = ""; // 清空转录文本
        isListeningRef.current = false;
        setResFromLLM(answer);
      }
      else {
        transcriptionRef.current = realTranscript; // 累加转录文本
      }
    };

    recognition.onend = async () => {
      console.log('enter onend');
      debugger
      if (recordingStateRef.current === "idle" && transcriptionRef.current !== "") {
        const realTranscript = transcriptionRef.current
        console.log("uploadQuesToBackend Transcript:", realTranscript);
        const answer = await uploadQuesToBackend(realTranscript); // 上传文本到后端
        transcriptionRef.current = ""; // 清空转录文本
        isListeningRef.current = false;
        setResFromLLM(answer);
      }
    }
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
    recognitionRef.current = recognition;
  }, []);

  // 合成语音
  useEffect(() => {
    if (resFromLLM !== '') {
      const utterance = new SpeechSynthesisUtterance(resFromLLM);
      utterance.onend = () => {
        setResFromLLM(''); // 语音播放完毕后清空
      };
      synth.speak(utterance);
    }
  }, [resFromLLM]);
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
    debugger
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
      const feedback = getLLMResponse(transcript); // 调用后端接口获取响应
      return feedback.feedback;
    } catch (error) {
      console.error("Error occur when get LLM response", error);
    }
  };

  return (
    <div className="container">
      <div className="imagePlaceholder">
        {avatar}
      </div>

      <div className="feedback">
        {introOnHome}
      </div>

      <div className="microphone" style={{ justifyContent: recordingState === "idle" ? 'center' : 'space-between' }}>
        {recordingState === "idle" && (
          <div style={{ justifySelf: 'center' }} onClick={startRecognition}>{microphone}</div>
        )}
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
    </div>
  );
}

export default VoiceAssistant;