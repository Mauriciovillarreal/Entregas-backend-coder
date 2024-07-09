import { Link } from 'react-router-dom';
import "./LoginWidget.css";

const LoginWidget = () => {
  return (
    <div>
        <Link to='/login'>
            <img src="../img/user.png" className='loginAcces' alt="" />
        </Link>
    </div>
  )
}

export default LoginWidget