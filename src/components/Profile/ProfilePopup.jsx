import React from "react";
import "./ProfilePopup.css";
import { getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";

class ProfilePopup extends React.Component {
    constructor(props) {
        super(props);
        this.fileInputRef = React.createRef();
    }

    handleChangePhoto = () => {
        this.fileInputRef.current.click();
    }

    onFileChange = async (event) => {
        const file = event.target.files[0];
        const userId = this.props.userData.id;
        const previousPhotoName = this.props.userData.picture_url;

        if (!userId) {
            return;
        }

        if (!file) return;

        // Validate that the image is JPG or PNG
        const validFormats = ['image/jpeg', 'image/png'];
        if (!validFormats.includes(file.type)) {
            alert("Solo se permiten imágenes en formato .JPEG o .PNG");
            return;
        }

        // Validar file size
        const maxSize = 3 * 1024 * 1024;
        if (file.size > maxSize) {
            alert("El tamaño de la imagen debe ser menor a 3 MB");
            return;
        }

        const storage = getStorage();

        this.props.setLoadingProfilePicture(true);

        // If there is a previous photo, delete it
        if (previousPhotoName) {
            const previousPhotoRef = ref(storage, `images/${userId}/${previousPhotoName}`);
            try {
                await deleteObject(previousPhotoRef);
                // Empty picture url in the database
                await this.props.updatePictureUrl('');
            } catch (error) {
                console.log("No se pudo borrar la foto anterior:", error);
                this.props.setLoadingProfilePicture(false);
            }
        }

        const uuid = crypto.randomUUID();
        const newFileName = `${uuid}.${file.name.split('.').pop()}`;
        const newStorageRef = ref(storage, `images/${userId}/${newFileName}`);

        try {
            await uploadBytes(newStorageRef, file);
             // Fill picture url in the database
            await this.props.updatePictureUrl(newFileName);
            this.props.downloadProfilePictureWithName(newFileName);
        } catch (error) {
            console.error("Error al subir la imagen:", error);
            this.props.setLoadingProfilePicture(false);
        }
    };

    render() {
        return (
            <div className="profile-popup">
                <button className="popup-option" onClick={this.handleChangePhoto}>
                    Cambiar foto de perfil
                </button>
                <button className="popup-option" onClick={this.props.onLogout}>
                    Cerrar sesión
                </button>
                <input
                    ref={this.fileInputRef}
                    type="file"
                    accept="image/jpeg, image/png"
                    style={{ display: 'none' }}
                    onChange={this.onFileChange}
                />
            </div>
        );
    }
}

export default ProfilePopup;
