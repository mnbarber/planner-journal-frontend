import { useState, createContext, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import PostList from './components/PostList/PostList';
import PostDetails from './components/PostDetails/PostDetails';
import PostForm from './components/PostForm/PostForm';
import SignupForm from './components/SignupForm/SignupForm';
import SigninForm from './components/SigninForm/SigninForm';
import * as authService from './services/authService'; // import the authservice
import * as postService from './services/postService';

export const AuthedUserContext = createContext(null);

const App = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(authService.getUser()); // using the method from authservice
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchAllPosts = async () => {
      const postsData = await postService.index();
      setPosts(postsData);
    };
    if (user) fetchAllPosts();
  }, [user]);

  const handleAddPost = async (postFormData) => {
    const newPost = await postService.create(postFormData);
    setPosts([newPost, ...posts]);
    navigate('/posts');
  };

  const handleDeletePost = async (postId) => {
    const deletedPost = await postService.deletePost(postId);
    setPosts(posts.filter((post) => post._id !== deletedPost._id));
    navigate('/posts');
  };

  const handleUpdatePost = async (postId, postFormData) => {
    const updatedPost = await postService.update(postId, postFormData);
    setPosts(posts.map((post) => (postId === post._id ? updatedPost : post)));
    navigate(`/posts/${postId}`);
  };

  const handleSignout = () => {
    authService.signout();
    setUser(null);
  };

  return (
    <>
      <AuthedUserContext.Provider value={user}>
        <NavBar user={user} handleSignout={handleSignout} />
        <Routes>
          {user ? (
            <>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/posts" element={<PostList posts={posts} />} />
            <Route path="/posts/:postId" element={<PostDetails handleDeletePost={handleDeletePost} />} />
            <Route path="/posts/new" element={<PostForm handleAddPost={handleAddPost} />} />
            <Route path="/posts/:postId/edit" element={<PostForm handleUpdatePost={handleUpdatePost} />} />
            </>
          ) : (
            <Route path="/" element={<Landing />} />
          )}
          <Route path="/signup" element={<SignupForm setUser={setUser} />} />
          <Route path="/signin" element={<SigninForm setUser={setUser} />} />
        </Routes>
      </AuthedUserContext.Provider>
    </>
  );
};

export default App;
