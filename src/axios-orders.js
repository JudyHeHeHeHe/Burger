import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://react-my-burger-a65a5.firebaseio.com/'
});

export default instance;