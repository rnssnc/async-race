import React from 'react';
import ErrorBoundry from '../ErrorBoundry/ErrorBoundry';
import CarService, {
  TWinner,
  CarsWinnersOrderBy,
  CarsWinnersSortBy,
  IServiceCarWinner,
} from '../../services/CarService';
import WinnersTable from '../WinnersTable/WinnersTable';
import Pagination from '../Pagination/Pagination';

type TState = {
  winners: TWinner[] | null;
  totalPagesCount: number;
  totalWinnersCount: number;
  page: number;
  sortOrder: CarsWinnersOrderBy;
  sortBy: CarsWinnersSortBy;
};

interface IProps {
  isVisible: boolean;
}

export default class WinnersPage extends React.Component<IProps, {}> {
  readonly WINNERS_PER_PAGE = 10;

  state: TState = {
    winners: null,
    totalPagesCount: 0,
    totalWinnersCount: 0,
    page: 1,
    sortOrder: CarsWinnersOrderBy.ASC,
    sortBy: CarsWinnersSortBy.id,
  };

  componentDidUpdate = (_prevProps: IProps, _prevState: TState) => {
    if (_prevState.sortBy !== this.state.sortBy || _prevState.sortOrder !== this.state.sortOrder)
      this.getWinnersToState();

    if (_prevProps.isVisible !== this.props.isVisible) {
      if (this.props.isVisible === true) this.getWinnersToState();
    }
  };

  componentDidMount = () => {
    this.getWinnersToState();
  };

  render() {
    const { page, totalWinnersCount, totalPagesCount, winners, sortOrder, sortBy } = this.state;

    const { isVisible } = this.props;

    const content =
      winners === null ? (
        'No winners found :( Try to make a race first!'
      ) : (
        <WinnersTable
          onTimeClick={this.onTimeFieldClick}
          onWinsClick={this.onWinsFieldClick}
          sortOrder={sortOrder}
          sortBy={sortBy}
          winners={winners}
        />
      );

    return (
      <ErrorBoundry>
        <section className={`section winners-section pt-4 ${isVisible ? '' : 'page--hidden'}`}>
          <div className="winners-section__heading-pagination-wrapper d-flex align-items-center">
            <h2 className="mb-0">Winners{totalWinnersCount > 0 ? `(${totalWinnersCount})` : ''}</h2>
            <Pagination
              isLocked={false}
              page={page}
              pageCount={totalPagesCount}
              onNextPage={() => this.getWinnersToState(this.state.page + 1)}
              onPrevPage={() => this.getWinnersToState(this.state.page - 1)}
            />
          </div>
          {content}
        </section>
      </ErrorBoundry>
    );
  }

  onTimeFieldClick = () => {
    this.setState(({ sortBy, sortOrder }: TState) => {
      if (sortBy === CarsWinnersSortBy.time) {
        return { sortOrder: this.switchSortOrder(sortOrder) };
      } else return { sortBy: CarsWinnersSortBy.time };
    });
  };

  private switchSortOrder(sortOrder: CarsWinnersOrderBy) {
    return sortOrder === CarsWinnersOrderBy.ASC ? CarsWinnersOrderBy.DESC : CarsWinnersOrderBy.ASC;
  }

  onWinsFieldClick = () => {
    this.setState(({ sortBy, sortOrder }: TState) => {
      if (sortBy === CarsWinnersSortBy.wins) {
        return { sortOrder: this.switchSortOrder(sortOrder) };
      }
      return { sortBy: CarsWinnersSortBy.wins };
    });
  };

  getWinnersToState = (page = this.state.page, limit = this.WINNERS_PER_PAGE) => {
    const { sortOrder, sortBy } = this.state;

    CarService.getWinners({
      page,
      limit,
      sort: sortBy,
      order: sortOrder,
    }).then((data: { items: IServiceCarWinner[]; count: number }) => {
      const winners: TWinner[] = [];

      if (data.items.length === 0 && this.state.page !== 1) this.getWinnersToState(1);

      const getCarPromises = data.items.map((item) =>
        CarService.getCar(item.id).then((car) =>
          winners.push({
            id: item.id,
            color: car.color,
            name: car.name,
            time: item.time,
            wins: item.wins,
          }),
        ),
      );

      Promise.all(getCarPromises).then(() => {
        this.setState({
          winners,
          totalWinnersCount: data.count,
          totalPagesCount: Math.ceil(data.count / limit),
          page,
        });
      });
    });
  };
}
