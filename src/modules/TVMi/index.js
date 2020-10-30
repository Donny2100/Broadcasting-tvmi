import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as loginActions from '../../common/reducers/app.actions';

import TVMiScreen from './TVMiScreen';

function mapStateToProps(state, props) {
  return {
    appdata: state.appdata,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(loginActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TVMiScreen);
