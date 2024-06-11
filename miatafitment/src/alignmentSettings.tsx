import React, { useState, useEffect } from "react";
import "../src/assets/CSS/alignmentSettings.css";

type AlignmentSettingsProps = {
  updateModel: (model: any) => void;
};

const AlignmentSettings = ({ updateModel }: AlignmentSettingsProps) => {
  const [frontCamber, setFrontCamber] = useState(0);
  const [rearCamber, setRearCamber] = useState(0);
  const [frontCaster, setFrontCaster] = useState(0);
  const [frontToe, setFrontToe] = useState(0);
  const [rearToe, setRearToe] = useState(0);

  useEffect(() => {
    updateModel({
      frontCamber,
      rearCamber,
      frontCaster,
      frontToe,
      rearToe,
    });
  }, [frontCamber, rearCamber, frontCaster, frontToe, rearToe, updateModel]);

  return (
    <div id="sliderContainer" style={{ width: "300px" }}>
      <div className="input-group">
        <div className="input-item">
          <div className="label-value">
            <label htmlFor="frontCamber">Front Camber</label>
            <span>{frontCamber}°</span>
          </div>
          <input
            id="frontCamber"
            type="range"
            min="-10"
            max="10"
            step="0.1"
            value={frontCamber}
            onChange={(e) => setFrontCamber(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-item">
          <div className="label-value">
            <label htmlFor="rearCamber">Rear Camber</label>
            <span>{rearCamber}°</span>
          </div>
          <input
            id="rearCamber"
            type="range"
            min="-10"
            max="10"
            step="0.1"
            value={rearCamber}
            onChange={(e) => setRearCamber(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-item">
          <div className="label-value">
            <label htmlFor="frontCaster">Front Caster</label>
            <span>{frontCaster}°</span>
          </div>
          <input
            id="frontCaster"
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={frontCaster}
            onChange={(e) => setFrontCaster(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-item">
          <div className="label-value">
            <label htmlFor="frontToe">Front Toe</label>
            <span>{frontToe} mm</span>
          </div>
          <input
            id="frontToe"
            type="range"
            min="-10"
            max="10"
            step="0.1"
            value={frontToe}
            onChange={(e) => setFrontToe(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-item">
          <div className="label-value">
            <label htmlFor="rearToe">Rear Toe</label>
            <span>{rearToe} mm</span>
          </div>
          <input
            id="rearToe"
            type="range"
            min="-10"
            max="10"
            step="0.1"
            value={rearToe}
            onChange={(e) => setRearToe(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default AlignmentSettings;
