import React from "react";
import "./ChooseNeighbourhood.css";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import Loading from '../Loading/Loading.jsx';

class ChooseNeighbourhood extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            provinces: [],
            loading: true,
            selectedProvince: '',
            neighbourhoods: [],
            selectedNeighbourhood: '',
        };
    }

    async componentDidMount() {
        await this.fetchProvinces();
    }

    fetchProvinces = async () => {
        const provincesURL = "https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre&max=5000";
        try {
            const response = await fetch(provincesURL);
            if (!response.ok) {
                throw new Error("Error al obtener las provincias");
            }
            const data = await response.json();
            const provinces = data.provincias || [];
            provinces.sort((a, b) => a.nombre.localeCompare(b.nombre));
            this.setState({ provinces, loading: false });
        } catch (error) {
            console.error("Error al cargar provincias:", error);
            this.setState({ loading: false });
        }
    };

    fetchNeighbourhoods = async (provinceId) => {
        const neighbourhoodsURL = `https://apis.datos.gob.ar/georef/api/municipios?campos=id,nombre&max=5000&provincia=${provinceId}`;
        try {
            const response = await fetch(neighbourhoodsURL);
            if (!response.ok) {
                throw new Error("Error al obtener los barrios");
            }
            const data = await response.json();
            const neighbourhoods = data.municipios || [];
            neighbourhoods.sort((a, b) => a.nombre.localeCompare(b.nombre));
            this.setState({ neighbourhoods });
        } catch (error) {
            console.error("Error al cargar barrios:", error);
            this.setState({ neighbourhoods: [] });
        }
    };

    handleLogout = () => {
        signOut(auth)
            .then(() => {
                this.setState({ user: null });
            })
            .catch((error) => {
                console.error("Error al cerrar sesión:", error);
            });
    };

    handleProvinceChanged = async (event) => {
        const selectedProvince = event.target.value;
        this.setState({ selectedProvince, neighbourhoods: [] });
        if (selectedProvince) {
            await this.fetchNeighbourhoods(selectedProvince);
        }
    };

    handleNeighbourhoodChanged = (event) => {
        this.setState({ selectedNeighbourhood: event.target.value });
    };

    handleContinueButton = async () => {
        const { selectedNeighbourhood, selectedProvince } = this.state;
        if (!selectedNeighbourhood) {
            return;
        }
        const provinceName = this.state.provinces.find(province => province.id === selectedProvince).nombre;
        const newNeighbourhoodName = this.state.neighbourhoods.find(neighbourhood => neighbourhood.id === selectedNeighbourhood).nombre;
        this.props.updateNeighbourhood(selectedNeighbourhood, newNeighbourhoodName, selectedProvince, provinceName);
    };
    

    render() {
        const { provinces, selectedProvince, neighbourhoods, selectedNeighbourhood, loading } = this.state;

        if (loading) {
            return (
                <div>
                    <Loading />
                </div>
            );
        }

        return (
            <div className="choose-neighbourhood-main-content">
                <div className="choose-neighbourhood-card">
                    <p className="choose-neighbourhood-title">Es hora de elegir tu barrio</p>

                    <div className="choose-neighbourhood-section">
                        <div className="choose-neighbourhood-section-input-container">
                            <p>Selecciona una provincia</p>
                            <select
                                className="add-announcement-input"
                                value={selectedProvince}
                                onChange={this.handleProvinceChanged}
                            >
                                <option value="">Seleccione una provincia</option>
                                {provinces.map((province) => (
                                    <option key={province.id} value={province.id}>
                                        {province.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="choose-neighbourhood-section">
                        <div className="choose-neighbourhood-section-input-container">
                            <p>Selecciona el barrio</p>
                            <select
                                className="add-announcement-input"
                                value={selectedNeighbourhood}
                                onChange={this.handleNeighbourhoodChanged}
                                disabled={!neighbourhoods.length}
                            >
                                <option value="">Seleccione un barrio</option>
                                {neighbourhoods.map((neighbourhood) => (
                                    <option key={neighbourhood.id} value={neighbourhood.id}>
                                        {neighbourhood.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <button 
                        className="choose-neighbourhood-continue-button"
                        onClick={this.handleContinueButton}
                        >
                            Continuar
                        </button>
                    </div>
                </div>

                <div>
                    <button
                        className="onboarding-logout-button"
                        onClick={this.handleLogout}
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
        );
    }
}

export default ChooseNeighbourhood;
