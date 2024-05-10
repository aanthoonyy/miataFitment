import React from 'react';
import './App.css';

const App = () => {
  return (
    <div id="sliderContainer">
      <Slider
        label="Ride Height"
        id="rideHeightSlider"
        min={-0.9}
        max={0.3}
        step={0.1}
        defaultValue={-0.4}
      />
      <Slider
        label="Front Caster"
        id="frontCasterSlider"
        min={4.55}
        max={4.95}
        step={0.1}
        defaultValue={4.65}
      />
      <Slider
        label="Front Camber"
        id="frontCamberSlider"
        min={70}
        max={90}
        step={0.1}
        defaultValue={90}
      />
      <Slider
        label="Rear Camber"
        id="rearCamberSlider"
        min={70}
        max={90}
        step={0.1}
        defaultValue={90}
      />
      <Slider
        label="Rear Toe"
        id="rearToeSlider"
        min={-3}
        max={3}
        step={0.1}
        defaultValue={0}
      />
      <Slider
        label="Front Toe"
        id="frontToeSlider"
        min={-3}
        max={3}
        step={0.1}
        defaultValue={0}
      />
      <InputGroup
        label="Tire"
        inputs={[
          { id: 'tireWidth', placeholder: 'Width (mm)', min: 0 },
          { id: 'tireSidewall', placeholder: 'Sidewall (mm)', min: 0 },
          { id: 'tireRadius', placeholder: 'Radius (in)', min: 0 },
        ]}
      />
      <InputGroup
        label="Wheel"
        inputs={[
          { id: 'wheelWidth', placeholder: 'Width (in)', min: 0 },
          { id: 'wheelDiameter', placeholder: 'Diameter (in)', min: 0 },
          { id: 'wheelOffset', placeholder: 'Offset (mm)', min: 0 },
        ]}
      />
    </div>
  );
};

const Slider = ({ label, id, min, max, step, defaultValue }) => (
  <div className="slider-item">
    <label htmlFor={id}>{label}</label>
    <input id={id} type="range" min={min} max={max} step={step} defaultValue={defaultValue} />
  </div>
);

const InputGroup = ({ label, inputs }) => (
  <div>
    <label>{label}</label>
    <div className="input-group">
      {inputs.map((input) => (
        <div className="input-item" key={input.id}>
          <input
            id={input.id}
            type="number"
            min={input.min}
            placeholder={input.placeholder}
          />
        </div>
      ))}
    </div>
  </div>
);

export default App;
