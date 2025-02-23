import React from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import avatar from '../../assets/avatar.png';

class HomePostComment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            profilePictureURL: avatar
        }
    }

    componentDidMount() {
        this.downloadProfilePicture();
    }

    downloadProfilePicture = async () => {
        const userId = this.props.comment.owner;
        const picture_url = this.props.comment.owner_picture_url;
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
                    <img
                        className="home-comment-profile-picture"
                        src={profilePictureURL}
                        alt="Perfil"
                    />
                    <p className="home-comment-owner-text">
                        Escrito por {this.props.comment.owner_name} el {this.getDate()}
                    </p>
                </div>
            </div>
        )
    };
}

export default HomePostComment;