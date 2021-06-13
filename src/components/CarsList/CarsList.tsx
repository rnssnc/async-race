import React from 'react';
import { RaceStatus, TCar } from '../../services/CarService';
import CarsListItem from '../CarsListItem/CarsListItem';

interface IProps {
  cars: TCar[];
  raceStatus: RaceStatus;
  onSelect(car: TCar): void;
  onRemove(id: number): void;
  onEngineStart(id: number): void;
  onEngineStop(id: number): void;
}

export default class CarsList extends React.Component<IProps, {}> {
  render() {
    const { cars, raceStatus, onSelect, onRemove, onEngineStart, onEngineStop } = this.props;

    const elements = cars.map((item) => {
      const { id, ...itemProps } = item;

      return (
        <li className="list-group-item" key={id}>
          <CarsListItem
            {...itemProps}
            raceStatus={raceStatus}
            onSelect={() => onSelect(item)}
            onRemove={() => onRemove(id)}
            onEngineStart={() => onEngineStart(id)}
            onEngineStop={() => onEngineStop(id)}
          />
        </li>
      );
    });

    return <ul className="list-group cars-list py-5">{elements}</ul>;
  }
}
