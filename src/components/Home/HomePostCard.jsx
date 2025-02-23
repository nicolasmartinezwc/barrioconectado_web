import React from "react";
import "./Home.css";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import heart from "../../assets/heart.png";
import heartFill from "../../assets/heart_fill.png";
import pencil from "../../assets/pencil_rectangle.png";
import { doc, setDoc } from "firebase/firestore";
import db from '../Database/Database';
import HomePostComment from "./HomePostComment";
import { collection, getDocs, query, where, updateDoc } from "firebase/firestore";
import InputValidator from "../Validator/InputValidator";
import avatar from '../../assets/avatar.png';

class HomePostCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profilePictureURL: avatar,
            liked: this.userLikesPhoto(),
            comments: [],
            errorMessage: '',
            comment: '',
            isLoadingComments: false
        }
    }

    componentDidMount() {
        this.downloadProfilePictureIfNeeded();
        if (this.props.isStandalone) {
            this.fetchComments();
        }
    }

    fetchComments = async () => {
        const { post } = this.props;
        this.setState({ isLoadingComments: true });
        try {
            const commentsQuery = query(
                collection(db, "comments"),
                where("post", "==", post.id)
            );
            const querySnapshot = await getDocs(commentsQuery);
            const comments = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            this.setState({ comments });
            this.setState({ isLoadingComments: false });
        } catch (error) {
            this.setState({ isLoadingComments: false });
            console.error("Error al obtener comentarios:", error);
        }
    };

    isLoggedInUserCard = () => {
        const userId = this.props.userData.id;
        return userId == this.props.post.owner;
    }

    downloadProfilePictureIfNeeded = () => {
        if (this.isLoggedInUserCard()) {
            return;
        }
        this.downloadProfilePicture();
    }

    downloadProfilePicture = async () => {
        const userId = this.props.post.owner;
        const picture_url = this.props.post.owner_picture_url;
        if (!picture_url || picture_url.length === 0) {
            this.setState({ profilePictureURL: avatar });
            return;
        }
        try {
            const storage = getStorage();
            const profilePictureRef = ref(
                storage,
                `images/${userId}/${picture_url}`
            );
            const url = await getDownloadURL(profilePictureRef);
            this.setState({ profilePictureURL: url });
        } catch (error) {
            console.error("Error al descargar la imagen de perfil:", error);
            this.setState({ profilePictureURL: avatar });
        }
    };

    getDate = () => {
        const date = new Date(this.props.post.created_at * 1000);
        const dateString = date.toLocaleDateString();
        return `${dateString}`;
    };

    userLikesPhoto = () => {
        return this.props.post.liked_by.includes(this.props.post.owner);
    }


    handleLike = async () => {
        const { post, userData, updatePost } = this.props;
        const userId = userData.id;
        if (!userId || !post) {
            console.error("User or post data is missing.");
            return;
        }
        const userLikes = post.liked_by.includes(userId);
        let updatedLikedBy = [...post.liked_by];
        this.setState({ liked: !userLikes });
        try {
            if (userLikes) {
                updatedLikedBy = updatedLikedBy.filter(id => id !== userId);
            } else {
                updatedLikedBy.push(userId);
            }
            const postRef = doc(db, "posts", post.id);
            await setDoc(
                postRef,
                {
                    liked_by: updatedLikedBy,
                    amount_of_likes: updatedLikedBy.length,
                },
                { merge: true }
            );
            updatePost({
                ...post,
                liked_by: updatedLikedBy,
                amount_of_likes: updatedLikedBy.length,
            });
        } catch (error) {
            console.error("Error toggling like:", error);
            this.setState({ liked: userLikes }); // Revert local state in case of error
        }
    };

    handleCommentChanged = (event) => {
        this.setState({ comment: event.target.value });
    }

    handleAddComment = () => {
        this.setState({ errorMessage: '' });
        const validationResult = InputValidator.validateComment(this.state.comment);
        if (validationResult.valid) {
            this.createComment(this.state.comment);
        } else {
            this.setState({ errorMessage: validationResult.message });
        }
        this.setState({ comment: '' });
    }

    createComment = async (comment) => {
        const { userData, post } = this.props;
        if (!userData || !post) {
            console.error("User data or post data is missing.");
            return;
        }
        try {
            const uuid = crypto.randomUUID();
            const currentTimeInterval = new Date().getTime() / 1000;
            const commentData = {
                id: uuid,
                text: comment,
                post: post.id,
                owner: userData.id,
                owner_name: userData.first_name + " " + userData.last_name,
                created_at: currentTimeInterval,
                amount_of_likes: 0,
                liked_by: [],
                owner_picture_url: userData.picture_url
            };

            const newCommentRef = doc(collection(db, "comments"), uuid);
            await setDoc(newCommentRef, commentData);

            const newAmmountOfComments = post.amount_of_comments + 1;

            const postRef = doc(db, "posts", post.id);
            await updateDoc(postRef, {
                amount_of_comments: newAmmountOfComments,
            });

            this.props.updatePost({
                ...post,
                amount_of_comments: newAmmountOfComments,
            });
            this.fetchComments();
        } catch (error) {
            print(error);
            this.setState({ errorMessage: 'Ocurrió un error al publicar el comentario.' });
        }
    };

    renderComments = () => {
        const { comments, isLoadingComments } = this.state;
        const { profilePictureDownloadURL, profilePictureURL } = this.props;

        const imageUrl = this.isLoggedInUserCard()
            ? profilePictureDownloadURL
            : profilePictureURL;


        if (isLoadingComments) {
            return <div className="spinner"></div>
        }

        if (comments.length === 0) {
            return <div>Aún no hay comentarios en este post.</div>;
        }

        return (
            <>
                <span>Comentarios:</span>
                {comments.map((comment, index) => (
                    <div key={index}>
                        <HomePostComment comment={comment} />
                    </div>
                ))}
            </>
        );
    };

    render() {
        const { profilePictureURL, liked, errorMessage, comment, comments } = this.state;
        const { profilePictureDownloadURL, post } = this.props;

        const imageUrl = this.isLoggedInUserCard()
            ? profilePictureDownloadURL
            : profilePictureURL;

        return (
            <div
                className="home-post-card"
            >
                <p className="home-post-card-text">{post.text}</p>
                <div className="home-post-card-row">
                    <img
                        className="home-post-card-profile-picture"
                        src={imageUrl}
                        alt="Perfil"
                    />
                    <p className="home-post-card-owner-text">
                        Escrito por {post.owner_name} el {this.getDate()}
                    </p>
                    <div
                        className="home-post-card-button"
                        onClick={this.handleLike}
                        style={{
                            cursor: "pointer"
                        }}
                    >
                        {post.amount_of_likes}
                        <img
                            className="home-post-card-icon"
                            src={liked ? heartFill : heart}
                            alt="likes"
                            style={{
                                filter: liked ? "invert(23%) sepia(85%) saturate(1766%) hue-rotate(344deg) brightness(114%) contrast(108%)" : "invert(93%) sepia(4%) saturate(124%) hue-rotate(316deg) brightness(93%) contrast(92%)"
                            }}
                        />

                    </div>
                    <div className="home-post-card-button">
                        {post.amount_of_comments}
                        <img
                            className="home-post-card-icon"
                            src={pencil}
                            alt="comments"
                            style={{
                                filter: "invert(93%) sepia(4%) saturate(124%) hue-rotate(316deg) brightness(93%) contrast(92%)"
                            }}
                        />
                        {!this.props.isStandalone && (
                            <button
                                onClick={() => this.props.handleCardClick(post)}
                                className="home-post-card-see-comments-button"
                            >
                                Ver comentarios
                            </button>
                        )}
                    </div>
                </div>
                {this.props.isStandalone &&
                    <div className="home-post-card-footer">
                        <br />
                        {this.renderComments()}
                        <textarea
                            value={comment}
                            onChange={this.handleCommentChanged}
                            className="add-post-input"
                            rows="4"
                            placeholder="Escribe un comentario..."
                        ></textarea>
                        <span
                            id="add-event-form-error-message-span"
                            hidden={errorMessage.length == 0}
                        >
                            {errorMessage}
                        </span>
                        <button
                            className="home-post-card-add-comment-button"
                            onClick={this.handleAddComment}
                        >
                            Agregar comentario
                        </button>
                        <button
                            className="home-post-card-back-button"
                            onClick={this.props.handleBackFromStandaloneCard}
                        >
                            Volver
                        </button>
                    </div>
                }
            </div>
        );
    }

}

export default HomePostCard;