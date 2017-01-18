import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Calendar from '../Calendar/';

const MultipleCalendar = ({ listOfCalendar, classNameOf, defaultStyle, ...props }) => (
  <div className={classNames(defaultStyle.root, classNameOf.root)}>
    {listOfCalendar.map(month => (
      <Calendar
        {...props}
        {...month.calendar}
        key={month.monthWithYear}
        classNameOf={classNameOf}
        defaultStyle={defaultStyle}
      />
    ))}
  </div>
);

MultipleCalendar.propTypes = {
  defaultStyle: PropTypes.objectOf(PropTypes.string).isRequired,
  listOfCalendar: PropTypes.arrayOf(PropTypes.shape({
    monthWithYear: PropTypes.string,
    calendar: PropTypes.shape({
      calendarArray: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({
        date: PropTypes.string.isRequired,
        weekDay: PropTypes.number.isRequired,
      }))),
      month: PropTypes.number,
      year: PropTypes.number,
    }),
  })).isRequired,
  events: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string,
    onClick: PropTypes.func,
    dataAttr: PropTypes.object,
  })),
  multipleSelect: PropTypes.bool,
  classNameOf: PropTypes.shape({
    root: PropTypes.string,
  }),
};

MultipleCalendar.defaultProps = {
  events: [],
  classNameOf: {},
  multipleSelect: false,
};

export default connect(state => ({ ...state.multipleCalendar }))(MultipleCalendar);
