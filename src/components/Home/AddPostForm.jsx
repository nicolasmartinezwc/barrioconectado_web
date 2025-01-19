import React from "react";
import "./Home.css";
import InputValidator from "../Validator/InputValidator";
import { getAuth } from "firebase/auth";
import db from '../Database/Database';
import { doc, setDoc } from "firebase/firestore";

class AddPostForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            post: '',
            errorMessage: ''
        }
    }

    handleCreatePost = () => {
        this.setState({ errorMessage: '' });
        const validationResult = InputValidator.validatePost(this.state.post);
        if(validationResult.valid) {
            this.createPost();
        } else {
            this.setState({ errorMessage: validationResult.message });
        }
    };

    createPost = async () => {
        const { post } = this.state;
        try {
            const auth = getAuth();
            const userId = auth.currentUser?.uid;
            const userData = this.props.userData;
            if (!userId || !userData) {
                throw new Error("Ocurrió un error al obtener la sesión");
            }
            const uuid = crypto.randomUUID();
            const currentTimeInterval = new Date().getTime() / 1000;
            const postRef = doc(db, "posts", uuid);
            await setDoc(postRef, {
                amount_of_comments: 0,
                amount_of_likes: 0,
                created_at: currentTimeInterval,
                text: post,
                id: uuid,
                liked_by: [],
                neighbourhood: userData.neighbourhood,
                owner: userId,
                owner_name: userData.first_name + " " + userData.last_name,
                owner_picture_url: userData.picture_url
            });
            this.props.handleBackFromForm();
            this.props.fetchPosts();
        } catch (error) {
            this.setState({ errorMessage: error.message });
        }
    }

    handlePostChanged = (event) => {
        this.setState({ post: event.target.value });
    }

    render() {
        const { post, errorMessage } = this.state;

        return (
            <div className="home-container">
                <div className="add-post-form-container">
                    <span className="add-post-form-title">Crea un nuevo posteo</span>
                    <span className="add-post-form-subtitle">Será visible para todos los miembros de tu mismo barrio!</span>

                    <textarea
                        value={post}
                        onChange={this.handlePostChanged}
                        className="add-comment-input"
                        rows="2" 
                        placeholder="Escribe tu post..."
                    ></textarea>

                    <span
                        id="add-announcement-form-error-message-span"
                        hidden={errorMessage.length == 0}
                    >
                        {errorMessage}
                    </span>

                    <div className="home-form-buttons-container">
                        <button
                            className="home-form-back-button"
                            onClick={this.props.handleBackFromForm}
                        >
                            Volver
                        </button>
                        <button
                            className="home-form-finish-button"
                            onClick={this.handleCreatePost}
                        >
                            Crear post
                        </button>
                    </div>
                </div>
            </div>
        )
    };
}

export default AddPostForm;