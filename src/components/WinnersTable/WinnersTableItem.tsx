import React from 'react';
import ColoredCar from '../CarsListItem/ColoredCar';

interface IProps {
  number: number;
  color: string;
  name: string;
  wins: number;
  time: number;
}

const WinnersTableItem = ({ number, color, name, wins, time }: IProps) => {
  return (
    <tr>
      <th>{number}</th>
      <td>{ColoredCar(color)}</td>
      <td>{name}</td>
      <td>{wins}</td>
      <td>{time}</td>
    </tr>
  );
};

export default WinnersTableItem;
