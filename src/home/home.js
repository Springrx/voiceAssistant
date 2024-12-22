import React, { useState, useRef, useEffect } from "react";
import { Play, PauseOne } from '@icon-park/react';
import { tipOnHome, introOnHome } from '../component/config';
import { message } from 'antd';
import './home.css';
import { microphone, stopIcon, avatar } from '../svg';
import { getLLMResponse } from './service';
import Tips from "./tips";

function VoiceAssistant() {
  const [recordingState, setRecordingState] = useState("idle"); // "idle", "recording", "paused"
  const [audioBlob, setAudioBlob] = useState(null); // 用于存储录音数据
  const [resFromLLM, setResFromLLM] = useState(''); // 用于存储需要语音合成的数据
  const mediaRecorderRef = useRef(null); // 录音器的引用
  const audioChunksRef = useRef([]); // 存储音频片段
  const synth = window.speechSynthesis; // 语音合成实例
  const handleTipButtonClick = (value) => {
    setResFromLLM(value); // 点击问题列表后语音说出问题的答案
  };

  useEffect(() => {
    if (resFromLLM !== '') {
      // 语音合成
      const utterance = new SpeechSynthesisUtterance(resFromLLM);
      utterance.onend = () => {
        console.log("播放完毕");
        setResFromLLM(''); // 语音播放完毕后清空resFromLLM
      };
      synth.speak(utterance);
    }
  }, [resFromLLM, synth]);
  // 获取用户麦克风权限并开始录音
  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true }) // 获取麦克风权限
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data); // 存储音频数据
        };

        mediaRecorderRef.current.onstop = () => {
          // 合并所有音频片段
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          setAudioBlob(audioBlob); // 录音完成后存储音频数据
          audioChunksRef.current = []; // 重置音频片段
        };

        mediaRecorderRef.current.start(); // 开始录音
        setRecordingState("recording");
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };

  // 停止录音后开始上传音频到后端
  const stopRecording = async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); // 停止录音
      setRecordingState("idle");
      if (audioBlob) {
        const answer = await uploadQuesToBackend(audioBlob); // 上传音频到后端
        setResFromLLM(answer);
      }else{
        message.error('未监测到录音，请重试');
      }
    }
  };

  // 上传音频文件到后端
  const uploadQuesToBackend = async (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "audio.wav"); // 将音频文件添加到 formData 中
    console.log("Uploading audio file to backend...");
    try {
      const feedback = getLLMResponse(formData); // 上传音频文件到后端
      return feedback.feedback;     
    } catch (error) {
      console.error("Error uploading audio file:", error);
    }
  };

  // 暂停录音
  const pauseRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.pause();
      setRecordingState("paused");
    }
  };

  // 恢复录音
  const resumeRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.resume();
      setRecordingState("recording");
    }
  };

  return (
    <div className="container">
      <div className="imagePlaceholder">
        {avatar}
      </div>

      <div className="feedback">
        {introOnHome}
        {tipOnHome}
      </div>

      <div className="microphone" style={{ justifyContent: recordingState === "idle" ? 'center' : 'space-between' }}>
        {recordingState === "idle" && (
          <div style={{ justifySelf: 'center' }} onClick={startRecording}>{microphone}</div>
        )}
        {recordingState === "recording" && (
          <>
            <PauseOne onClick={pauseRecording} theme="filled" size="60" fill="#333333" />
            <div onClick={stopRecording}>
              {stopIcon}
            </div>
          </>
        )}
        {recordingState === "paused" && (
          <>
            <Play onClick={resumeRecording} theme="filled" size="60" fill="#333333" />
            <div onClick={stopRecording}>
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