import axios from 'axios'
import mydata, {categories, tags} from '../../data'

function ax() {
    axios.post('http://localhost:3001/test', {
        data: {
            tosend: mydata
        }
    }).then(ful => ful.data, rej => console.log(rej))
    .then(dat => console.log(dat))
}

export default ax