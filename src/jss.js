import jss from 'jss';
import preset from 'jss-preset-default';

jss.setup(preset());

const styles = {
  calendar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  month: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  horizontal: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
};

const { classes } = jss.createStyleSheet(styles).attach();

export default classes;