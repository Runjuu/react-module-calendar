import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';
import Month from './Month';
import classes from './jss';
import { calendarState } from './';

const Calendar = ({ onClick, classNames, dateFormat, monthFormat }) => (
  <div className={`${classes.calendar} ${classNames.calendar || ''}`}>
    {calendarState.calendar.map(month => (
      <Month
        key={month[0][0]}
        month={month}
        onClick={onClick}
        classNames={classNames}
        dateFormat={dateFormat}
        monthFormat={monthFormat}
      />
    ))}
  </div>
);

Calendar.propTypes = {
  classNames: PropTypes.objectOf(PropTypes.string),
  onClick: PropTypes.func,
  dateFormat: PropTypes.string,
  monthFormat: PropTypes.string,
};

Calendar.defaultProps = {
  onClick: undefined,
  classNames: {},
  dateFormat: 'DD',
  monthFormat: 'YYYY-MM',
};

export default observer(Calendar);
