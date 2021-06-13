import React from 'react';

import './Pagination.sass';

interface IProps {
  page: number;
  pageCount: number;
  isLocked: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
}

const Pagination = ({ page, pageCount, isLocked, onNextPage, onPrevPage }: IProps) => {
  const isFirstPage = page <= 1 ? true : false;
  const isLastPage = page >= pageCount ? true : false;

  return (
    <div className="pagination d-flex align-items-center">
      <div className="pagination__buttons-wrapper d-flex">
        <button className="btn btn-primary" onClick={onNextPage} disabled={isLastPage || isLocked}>
          Next
        </button>
        <button className="btn btn-primary" onClick={onPrevPage} disabled={isFirstPage || isLocked}>
          Previous
        </button>
      </div>
      <span className="pagination__caption">
        Page: <span className="pagination__page-number">{page}</span>
      </span>
    </div>
  );
};

export default Pagination;
