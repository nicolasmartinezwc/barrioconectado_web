import React from "react";
import HomeViewModel from "./HomeViewModel.js";
import "./Home.css";
import rays from "../../assets/rays.png";
import flag from "../../assets/flag_fill.png";
import shoppingCart from "../../assets/shopping_cart.png";
import HomePostCard from "./HomePostCard.jsx";
import AddPostForm from "./AddPostForm.jsx";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editDescription: false,
      description: this.props.userData.description,
      errorMessage: '',
      showError: false,
      posts: [],
      isLoading: false,
      showAddPostForm: false,
      neighbourhoodData: null,
      isLoadingNeighbourhoodData: false,
      standaloneCardId: null
    }
    this.viewModel = new HomeViewModel(this.props.userData);
  }

  async componentDidMount() {
    this.fetchPosts();
    this.fetchNeighbourhoodData();
  }

  fetchPosts = async () => {
    this.setState({ isLoading: true });
    const posts = await this.viewModel.fetchPosts();
    this.setState({ isLoading: false });
    this.setState({ posts: posts });
  }

  fetchNeighbourhoodData = async () => {
    this.setState({ isLoadingNeighbourhoodData: true });
    const neighbourhoodData = await this.viewModel.fetchNeighbourhoodData();
    this.setState({ isLoadingNeighbourhoodData: false });
    this.setState({ neighbourhoodData: neighbourhoodData });
  }

  toggleEditDescription = () => {
    const newValue = !this.state.editDescription
    this.setState({ editDescription: newValue });
  }

  handleEditDescription = async () => {
    this.toggleEditDescription();
    const validationResult = this.viewModel.validateDescription(this.state.description);
    if (validationResult.valid) {
      const userId = this.props.userData.id;
      try {
        await this.viewModel.editDescription(this.state.description, userId);
        this.props.updateDescriptionState(this.state.description);
      } catch (error) {
        this.showError(error.errorMessage);
      }
    } else {
      this.showError(validationResult.message);
    }
  };

  updatePost = (updatedPost) => {
    this.setState(prevState => {
      const updatedPosts = prevState.posts.map(post =>
        post.id === updatedPost.id ? updatedPost : post
      );
      return { posts: updatedPosts };
    });
  };

  handleBackFromForm = () => {
    this.setState({ showAddPostForm: false });
  }

  handleDescriptionChanged = (event) => {
    this.setState({ description: event.target.value });
  }

  showError = (message) => {
    this.setState({ errorMessage: message, showError: true });

    setTimeout(() => {
      this.setState({ showError: false, errorMessage: '' });
    }, 3000);
  };

  handleAddPostButton = () => {
    this.setState({ showAddPostForm: true });
  }

  handleCardClick = (post) => {
    this.setState({ standaloneCardId: post.id });
  };

  handleBackFromStandaloneCard = () => {
    this.setState({ standaloneCardId: null });
  }

  render() {
    const { neighbourhoodData, isLoadingNeighbourhoodData, showAddPostForm, posts, isLoading, showError, errorMessage, description, editDescription, standaloneCardId } = this.state;

    const standaloneCard = posts.find(post => post.id === standaloneCardId)

    return (
      <div>
        <div className="home-header">
          <div className="home-description-container">
            {
              editDescription ?
                <input
                  className="home-description-input"
                  value={description}
                  onChange={this.handleDescriptionChanged}
                  type="text"
                />
                :
                <p className="home-description">{this.props.userData.description ? this.props.userData.description : "Escribe una descripción de tu perfil"}</p>
            }
            {editDescription ?
              <div>
                <button
                  onClick={this.handleEditDescription}
                  style={{
                    marginRight: "10px"
                  }}
                >
                  Aceptar
                </button>
                <button
                  onClick={this.toggleEditDescription}
                >
                  Cancelar
                </button>
              </div> :
              <button
                onClick={this.toggleEditDescription}
              >
                Editar
              </button>
            }
          </div>

          <div className="home-cards-container">
            <div className="home-card">
              <div
                className="home-card-image-container"
                style={{
                  backgroundColor: "#fae0cf",
                }}
              >
                <img
                  src={rays}
                  alt="Eventos"
                  className="home-card-image"
                  style={{
                    filter: "invert(79%) sepia(10%) saturate(2123%) hue-rotate(323deg) brightness(97%) contrast(93%)"
                  }}
                />
              </div>
              <p>Mira los últimos eventos por tu barrio.</p>
            </div>
            <div className="home-card">
              <div
                className="home-card-image-container"
                style={{
                  backgroundColor: "#fbc781",
                }}
              >
                <img
                  src={flag}
                  alt="Alertas"
                  className="home-card-image"
                  style={{
                    filter: "invert(94%) sepia(24%) saturate(654%) hue-rotate(2deg) brightness(97%) contrast(104%)"
                  }}
                />
              </div>
              <p>Está al tanto de las emergencias vecinales.</p>
            </div>
            <div className="home-card">
              <div
                className="home-card-image-container"
                style={{
                  backgroundColor: "#eafbf1",
                }}
              >
                <img
                  src={shoppingCart}
                  alt="Anuncios"
                  className="home-card-image"
                  style={{
                    filter: "invert(72%) sepia(28%) saturate(518%) hue-rotate(107deg) brightness(89%) contrast(94%)"
                  }}
                />
              </div>
              <p>Vende o regala artículos que ya no utilices.</p>
            </div>
          </div>
        </div>
        {
          showAddPostForm ?
            <AddPostForm
              handleBackFromForm={this.handleBackFromForm}
              fetchPosts={this.fetchPosts}
              userData={this.props.userData}
            />
            :
            <div className="test-container">
              {isLoading || isLoadingNeighbourhoodData ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                </div>
              ) : (
                posts.length > 0 ? (
                  <div className="home-container">
                    {standaloneCard ? (
                      <HomePostCard
                        post={standaloneCard}
                        userData={this.props.userData}
                        profilePictureDownloadURL={this.props.profilePictureDownloadURL}
                        updatePost={this.updatePost}
                        isStandalone={true}
                        handleBackFromStandaloneCard={this.handleBackFromStandaloneCard}
                      />
                    ) : (
                      <>
                        <p className="home-container-latest-posts-text">
                          Últimos posteos en {neighbourhoodData?.name}, {neighbourhoodData?.province}:
                        </p>
                        {posts.map((post, index) => (
                          <div
                            key={index}
                            style={{ marginBottom: index !== posts.length - 1 ? "0px" : "30px" }}
                          >
                            <HomePostCard
                              post={post}
                              userData={this.props.userData}
                              profilePictureDownloadURL={this.props.profilePictureDownloadURL}
                              updatePost={this.updatePost}
                              handleCardClick={this.handleCardClick}
                            />
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                ) : (
                  <div className="empty-content">
                    <p>No hay posteos aún... Se el primero en publicar uno!</p>
                  </div>
                )
              )}
            </div>
        }

        {
          !standaloneCard && !showAddPostForm &&
          <button className="floating-button" onClick={this.handleAddPostButton}>
            Agregar post
          </button>
        }

        {
          showError && (
            <div className="error-message-container">
              <p>{errorMessage}</p>
            </div>
          )
        }
      </div >
    );
  }
}

export default Home;
