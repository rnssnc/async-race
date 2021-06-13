import React from 'react';
import { TCar } from '../../services/CarService';

interface IProps {
  defaultState: {
    value: string;
    color: string;
  };
  currentCar: TCar | null;
  value: string;
  color: string;
  onItemSubmit(value: string, color: string): void;
}

interface IState {
  currentCar: TCar | null;
  value: string;
  color: string;
}

export default class CarForm extends React.Component<IProps, {}> {
  state: IState = {
    currentCar: null,
    value: '',
    color: '',
  };

  componentDidUpdate(_prevProps: IProps) {
    if (_prevProps.currentCar !== this.props.currentCar) {
      this.setState({
        currentCar: this.props.currentCar,
        value: this.props.value,
        color: this.props.color,
      });
    }
  }

  render() {
    const { value, color, currentCar } = this.state;
    const isCurrentCarExist = Boolean(!currentCar);

    const className = 'btn btn-primary';

    return (
      <form
        className="car-add-form d-flex justify-content-center align-items-center"
        onSubmit={this.onSubmit}
      >
        <input
          type="text"
          className="form-control"
          placeholder="Car name"
          onChange={this.onLabelChange}
          value={value}
          disabled={isCurrentCarExist}
        ></input>
        <input
          type="color"
          className="form-control form-control-color"
          onChange={this.onColorChange}
          value={color || '#ffffff'}
          disabled={isCurrentCarExist}
        ></input>
        <button className={className} disabled={isCurrentCarExist}>
          Update
        </button>
      </form>
    );
  }

  onLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      value: e.target.value,
    });
  };

  onColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      color: e.target.value,
    });
  };

  onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    this.props.onItemSubmit(this.state.value, this.state.color);

    this.setState({
      value: this.props.defaultState.value,
      color: this.props.defaultState.color,
    });
  };
}
