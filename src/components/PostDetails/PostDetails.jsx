import { AuthedUserContext } from '../../App';
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import * as postService from '../../services/postService';

const PostDetails = (props) => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const user = useContext(AuthedUserContext);

    useEffect(() => {
        const fetchPost = async () => {
            const postData = await postService.show(postId);
            console.log('postData', postData);
            setPost(postData);
        };
        fetchPost();
    }, [postId]);

    if (!post) return <main>Loading...</main>;

    return (
        <main>
            <header>
                <p>{post.category.toUpperCase()}</p>
                <h1>{post.title}</h1>
                <p>
                    {post.author.username} posted on 
                    {new Date(post.createdAt).toLocaleDateString()}
                </p>
            </header>
            <p>{post.text}</p>
            {post.author._id === user._id && (
                <>
                    <Link to={`/posts/${postId}/edit`}>EDIT</Link>
                    <button onClick={() => props.handleDeletePost(postId)}>DELETE</button>
                </>
            )}
        </main>
    );
};

export default PostDetails;