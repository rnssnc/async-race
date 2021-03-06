import React from 'react';
import { RaceStatus } from '../../services/CarService';

interface IProps {
  defaultState: IState;
  onItemSubmit(value: string, color: string): void;
  raceStatus: RaceStatus;
}

interface IState {
  value: string;
  color: string;
}

export default class CarCreateForm extends React.Component<IProps, {}> {
  state: IState = {
    value: '',
    color: '',
  };

  render() {
    const isInputEmpty = Boolean(!this.state.value);

    const isRaceStatusReady = this.props.raceStatus === RaceStatus.ready;

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
          value={this.state.value}
        ></input>
        <input
          type="color"
          className="form-control form-control-color"
          onChange={this.onColorChange}
          value={this.state.color}
        ></input>
        <button className={className} disabled={isInputEmpty || !isRaceStatusReady}>
          Create
        </button>
      </form>
    );
  }

  componentDidMount() {
    const { value, color } = this.props.defaultState;

    this.setState({
      value,
      color,
    });
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
