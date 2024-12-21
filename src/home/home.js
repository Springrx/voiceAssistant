import React, { useState } from "react";
import { Play, PauseOne } from '@icon-park/react'
import { quesList, tipOnHome, introOnHome } from '../component/config'
import { Button, Popover, Typography } from 'antd';
import './home.css'
import { microphone, stopIcon,avatar } from '../svg'
const { Text } = Typography;
function VoiceAssistant() {
  // 用于管理当前的按钮状态
  const [recordingState, setRecordingState] = useState("idle"); // "idle", "recording", "paused"

  // 开始录音
  const startRecording = () => {
    setRecordingState("recording");
  };

  // 暂停录音
  const pauseRecording = () => {
    setRecordingState("paused");
  };

  // 停止录音
  const stopRecording = () => {
    setRecordingState("idle");
  };
  const handleWeatherClick = () => {
    alert("获取天气信息...");
  };

  const handleDateClick = () => {
    alert("获取日期信息...");
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

      <div className="microphone" style={{justifyContent: recordingState === "idle" ? 'center' : 'space-between'}}>
        {recordingState === "idle" && (
          <div style={{justifySelf:'center'}} onClick={startRecording}>{microphone}</div>
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
              <Play onClick={startRecording} theme="filled" size="60" fill="#333333" />
              <div onClick={stopRecording}>
                {stopIcon}
              </div>         
          </>
        )}
      </div>

      <div className="tips">
        {quesList.map((item, index) => (
          <Popover
            key={index}
            content={item.answer}
            title={item.question}
            trigger="click"
          >
            <Button style={{ marginTop: '10px' }}>{item.question}</Button>
          </Popover>
        ))}
      </div>
    </div>
  );
}

export default VoiceAssistant;