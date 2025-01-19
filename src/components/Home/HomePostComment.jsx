import React from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

class HomePostComment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            profilePictureURL: null
        }
    }

    componentDidMount() {
        this.downloadProfilePicture();
    }

    downloadProfilePicture = async () => {
        const userId = this.props.comment.owner;
        const picture_url = this.props.comment.owner_picture_url;
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
            this.setState({ profilePictureURL: null });
        }
    };

    getDate = () => {
        const date = new Date(this.props.comment.created_at * 1000);
        const dateString = date.toLocaleDateString();
        return `${dateString}`;
    };

    render() {
        const { profilePictureURL } = this.state;
        return (
            <div className="home-comment-container">
                <p className="home-comment-text">
                    {this.props.comment.text}
                </p>
                <div className="home-comment-row">
                    {!profilePictureURL ? (
                        <div className="spinner"></div>
                    ) : (
                        <img
                            className="home-comment-profile-picture"
                            src={profilePictureURL}
                            alt="Perfil"
                        />
                    )}
                    <p className="home-comment-owner-text">
                        Escrito por {this.props.comment.owner_name} el {this.getDate()}
                    </p>

                    FALTA EL LIKE
                </div>
            </div>
        )
    };
}

export default HomePostComment;