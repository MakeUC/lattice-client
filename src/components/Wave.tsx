import React from "react";

const Wave = () => {
  return <div className="waveWrapper waveAnimation">
  <div className="waveWrapperInner bgTop">
    <div 
      className="wave waveTop" 
      style={{ 
        backgroundImage:`url(${'https://assets.revolutionuc.com/website-images/2021/waves/waves1_blue.png'})`}}></div>
  </div>
  <div className="waveWrapperInner bgMiddle">
    <div 
    className="wave waveMiddle" 
    style={{
      backgroundImage:`url(${'https://assets.revolutionuc.com/website-images/2021/waves/waves2_purple.png'})`}}></div>
  </div>
  <div className="waveWrapperInner bgBottom">
    <div 
    className="wave waveBottom" 
    style={{
      backgroundImage:`url(${'https://assets.revolutionuc.com/website-images/2021/waves/waves3_teal.png'})`}}></div>
  </div>
</div>
};

export default Wave;
