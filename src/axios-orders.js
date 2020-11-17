import axios from 'axios';

// Create an instance of axios with a baseURL so that
// we have more flexibility over using a global baseURL and a different URL
const instance = axios.create({
  baseURL: 'https://reactburgerbuilder-cb5d3.firebaseio.com/'
});

export default instance;