import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { setSelected } from './CalendarActions';
import { filterDate, whichMonth, whichDay, isToday, filterDataAttr } from '../methods';

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.handleClickEvent = this.handleClickEvent.bind(this);
    this.state = {
      selected: {},
    };
  }
  handleClickEvent(e) {
    e.preventDefault();
    const { target, type } = e;
    const { multipleSelect, dispatch, enableTouchTap, onClick } = this.props;
    const date = target.getAttribute('data-date');

    if ((enableTouchTap && type === 'click') || (!enableTouchTap && type !== 'click')) return;

    dispatch(setSelected({ date, multipleSelect }));
    if (typeof onClick === 'function') {
      onClick({ date, target });
    }
  }
  render() {
    const onClick = {};
    const {
      defaultStyle,
      month, year,
      enableTouchTap,
      defaultSelectedToday,
      classNameOf, selected, calendarArray, dateEvents,
    } = this.props;

    if (enableTouchTap) {
      onClick.onTouchTap = this.handleClickEvent;
    } else {
      onClick.onClick = this.handleClickEvent;
    }
    return (
      <div className={classNames(defaultStyle.root, classNameOf.calendar)}>
        <h3
          data-year={year}
          data-month={month + 1}
          className={classNameOf.title}
        >
          <span>{`${year}-${month + 1}`}</span>
        </h3>
        {calendarArray.map((horizontal, index) => (
          <section
            key={index}
            className={classNames(defaultStyle.horizontal, classNameOf.week)}
          >
            {horizontal.map((vertical) => {
              const date = filterDate(vertical.date);
              const dateEvent = dateEvents[vertical.date];
              const data = dateEvent ? filterDataAttr(dateEvent.dataAttr) : {};
              data['data-day'] = date.day;
              data['data-date'] = vertical.date;
              data['data-weekDay'] = vertical.weekDay;
              data['data-which-month'] = whichMonth({ date: vertical.date, refer: `${year}-${month + 1}` });
              data['data-which-day'] = whichDay(vertical.date);
              data['data-is-today'] = isToday(vertical.date) || undefined;
              data['data-selected'] = (defaultSelectedToday && Object.getOwnPropertyNames(selected).length === 0 && isToday(vertical.date)) || selected[vertical.date];
              return (
                <a
                  {...data}
                  {...onClick}
                  key={vertical.date}
                  href={`#${vertical.date}`}
                  className={classNames(defaultStyle.vertical, classNameOf.day)}
                >
                  <span>
                    {date.day}
                  </span>
                </a>
              );
            })}
          </section>
        ))}
      </div>
    );
  }
}

Calendar.defaultProps = {
  defaultStyle: {},
  dateEvents: {},
  calendarArray: [],
  classNameOf: {},
  selected: {},
  onClick: () => {},
  defaultSelectedToday: true,
  enableTouchTap: false,
  multipleSelect: false,
};

Calendar.propTypes = {
  defaultStyle: PropTypes.objectOf(PropTypes.string),
  dateEvents: PropTypes.objectOf(PropTypes.shape({
    date: PropTypes.string,
    onClick: PropTypes.func,
    dataAttr: PropTypes.object,
  })),
  calendarArray: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string.isRequired,
    weekDay: PropTypes.number.isRequired,
  }))),
  classNameOf: PropTypes.shape({
    calendar: PropTypes.string,
    title: PropTypes.string,
    week: PropTypes.string,
    day: PropTypes.string,
  }),
  dispatch: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  selected: PropTypes.objectOf(PropTypes.bool),
  defaultSelectedToday: PropTypes.bool,
  enableTouchTap: PropTypes.bool,
  multipleSelect: PropTypes.bool,
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
};

export default connect(state => ({
  ...state.calendar,
  selected: state.selected,
  dateEvents: state.dateEvents,
}))(Calendar);