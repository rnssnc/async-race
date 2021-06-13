import React from 'react';
import { CarsWinnersOrderBy, CarsWinnersSortBy, TWinner } from '../../services/CarService';
import WinnersTableItem from './WinnersTableItem';

interface IProps {
  winners: TWinner[];
  sortOrder: CarsWinnersOrderBy;
  sortBy: CarsWinnersSortBy;
  onWinsClick: () => void;
  onTimeClick: () => void;
}

enum SORT_SYMBOLS {
  sortable = '⇅',
  ASC = '▼',
  DESC = '▲',
}

export default class WinnersTable extends React.Component<IProps, {}> {
  render() {
    const { winners, sortBy, sortOrder, onTimeClick, onWinsClick } = this.props;

    const isSortBywins = sortBy === CarsWinnersSortBy.wins;
    const orderBySymbol =
      sortOrder === CarsWinnersOrderBy.ASC ? SORT_SYMBOLS.ASC : SORT_SYMBOLS.DESC;

    const items = winners.map((winner, index) => {
      const { id, ...winnerProps } = winner;
      return <WinnersTableItem key={id} number={index + 1} {...winnerProps} />;
    });

    return (
      <table className="table table-striped table-dark mt-4">
        <thead>
          <tr>
            <th scope="col">№</th>
            <th scope="col">Car</th>
            <th scope="col">Name</th>
            <th scope="col" style={{ cursor: 'pointer' }} onClick={onWinsClick}>
              Wins {isSortBywins ? orderBySymbol : SORT_SYMBOLS.sortable}
            </th>
            <th scope="col" style={{ cursor: 'pointer' }} onClick={onTimeClick}>
              Best time (s) {isSortBywins ? SORT_SYMBOLS.sortable : orderBySymbol}
            </th>
          </tr>
        </thead>
        <tbody>{items}</tbody>
      </table>
    );
  }
}