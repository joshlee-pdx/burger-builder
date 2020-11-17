import React, {Component} from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxiliary/Auxiliary';


const withErrorHandler = (WrappedComponent, axios) => {
  return class extends Component {
    constructor(props){
      super(props)

      this.state = {
        error: null,
        requestInterceptor: null,
        responseInterceptor: null
      }

      this.requestInterceptor = axios.interceptors.request.use(request => {
        this.setState({error: null});
        return request;
      });

      this.responseInterceptor = axios.interceptors.response.use(response => response, error => {
        this.setState({error:error});
      });
    }


    componentWillUnmount(){
      //console.log('Will Unmount', this.requestInterceptor, this.responseInterceptor);
      // Deallocate interceptors once no longer in use
      axios.interceptors.request.eject(this.requestInterceptor);
      axios.interceptors.response.eject(this.responseInterceptor);
    }

    errorConfirmedHandler = () =>{
      this.setState({error:null});
    }

    render() {
      return (
        <Aux>
          <Modal 
            show={this.state.error}
            modalClosed={this.errorConfirmedHandler}>
            {this.state.error ? this.state.error.message : null}
          </Modal>
          <WrappedComponent {...this.props} />
        </Aux>
      )
    }
  }
}

export default withErrorHandler;