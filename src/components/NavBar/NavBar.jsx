import { Link } from 'react-router-dom';
import { AuthedUserContext } from '../../App';
import { useContext } from 'react';

const NavBar = ({ handleSignout }) => {
  const user = useContext(AuthedUserContext);
  return (
    <>
      {user ? (
        <nav>
            <h2>Welcome, {user.username}</h2>
            <div className='navbar'>
              <Link to="/">Dashboard</Link> || 
              <Link to="/posts">Posts</Link> || 
              <Link to="/posts/new">New Post</Link> || 
              <Link to="" onClick={handleSignout}>
                Sign Out
              </Link>
            </div>
        </nav>
      ) : (
        <nav>
          <ul>
            <li>
              <Link to="/signin">Sign In</Link>
            </li>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
};
export default NavBar;
