import React, { useState } from "react";
import "./styles.css";

const SliderComponent = () => {
  const [rideHeight, setRideHeight] = useState(-0.4);
  const [frontCaster, setFrontCaster] = useState(4.65);
  const [frontCamber, setFrontCamber] = useState(90);
  const [rearCamber, setRearCamber] = useState(90);
  const [rearToe, setRearToe] = useState(0);
  const [frontToe, setFrontToe] = useState(0);
  const [tireWidth, setTireWidth] = useState("185");
  const [tireSidewall, setTireSidewall] = useState("60");
  const [tireRadius, setTireRadius] = useState("14");
  const [wheelWidth, setWheelWidth] = useState("6");
  const [wheelDiameter, setWheelDiameter] = useState("14");
  const [wheelOffset, setWheelOffset] = useState("45");

  return (
    <div id="sliderContainer">
      <div className="slider-item">
        <label htmlFor="rideHeightSlider">Ride Height</label>
        <input
          id="rideHeightSlider"
          type="range"
          min="-0.9"
          max="0.3"
          value={rideHeight}
          step="0.1"
          onChange={(e) => setRideHeight(parseFloat(e.target.value))}
        />
      </div>
      <div className="slider-item">
        <label htmlFor="frontCasterSlider">Front Caster</label>
        <input
          id="frontCasterSlider"
          type="range"
          min="4.55"
          max="4.95"
          value={frontCaster}
          step="0.1"
          onChange={(e) => setFrontCaster(parseFloat(e.target.value))}
        />
      </div>
      <div className="slider-item">
        <label htmlFor="frontCamberSlider">Front Camber</label>
        <input
          id="frontCamberSlider"
          type="range"
          min="70"
          max="90"
          value={frontCamber}
          step="0.1"
          onChange={(e) => setFrontCamber(parseFloat(e.target.value))}
        />
      </div>
      <div className="slider-item">
        <label htmlFor="rearCamberSlider">Rear Camber</label>
        <input
          id="rearCamberSlider"
          type="range"
          min="70"
          max="90"
          value={rearCamber}
          step="0.1"
          onChange={(e) => setRearCamber(parseFloat(e.target.value))}
        />
      </div>
      <div className="slider-item">
        <label htmlFor="rearToeSlider">Rear Toe</label>
        <input
          id="rearToeSlider"
          type="range"
          min="-3"
          max="3"
          value={rearToe}
          step="0.1"
          onChange={(e) => setRearToe(parseFloat(e.target.value))}
        />
      </div>
      <div className="slider-item">
        <label htmlFor="frontToeSlider">Front Toe</label>
        <input
          id="frontToeSlider"
          type="range"
          min="-3"
          max="3"
          value={frontToe}
          step="0.1"
          onChange={(e) => setFrontToe(parseFloat(e.target.value))}
        />
      </div>
      <div className="input-group">
        <div className="input-item">
          <label htmlFor="tireWidth">Tire Width</label>
          <input
            id="tireWidth"
            type="number"
            min="0"
            placeholder="Width (mm)"
            value={tireWidth}
            onChange={(e) => setTireWidth(e.target.value)}
          />
        </div>
        <div className="input-item">
          <label htmlFor="tireSidewall">Tire Sidewall</label>
          <input
            id="tireSidewall"
            type="number"
            min="0"
            placeholder="Sidewall (%)"
            value={tireSidewall}
            onChange={(e) => setTireSidewall(e.target.value)}
          />
        </div>
        <div className="input-item">
          <label htmlFor="tireRadius">Tire Radius</label>
          <input
            id="tireRadius"
            type="number"
            min="0"
            placeholder="Radius (in)"
            value={tireRadius}
            onChange={(e) => setTireRadius(e.target.value)}
          />
        </div>
      </div>
      <div className="input-group">
        <div className="input-item">
          <label htmlFor="wheelWidth">Wheel Width</label>
          <input
            id="wheelWidth"
            type="number"
            min="0"
            placeholder="Width (in)"
            value={wheelWidth}
            onChange={(e) => setWheelWidth(e.target.value)}
          />
        </div>
        <div className="input-item">
          <label htmlFor="wheelDiameter">Wheel Diameter</label>
          <input
            id="wheelDiameter"
            type="number"
            min="0"
            placeholder="Diameter (in)"
            value={wheelDiameter}
            onChange={(e) => setWheelDiameter(e.target.value)}
          />
        </div>
        <div className="input-item">
          <label htmlFor="wheelOffset">Wheel Offset</label>
          <input
            id="wheelOffset"
            type="number"
            min="0"
            placeholder="Offset (mm)"
            value={wheelOffset}
            onChange={(e) => setWheelOffset(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default SliderComponent;
