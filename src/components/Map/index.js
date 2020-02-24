import React, { Component, Fragment } from "react";
import { View, Image, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getPixelSize } from "../../utils";
import Geocoder from "react-native-geocoding";

import Search from "../Search";
import Directions from "../Directions/index";
import marckImage from "../../assets/marker.png";
import { Key } from "../key";

import {
  Back,
  RequestButton,
  RequestButtonText,
  LocationBox,
  LocationText,
  LocationTimeBox,
  LocationTimeText,
  LocationTimeTextSmall
} from "./styles";

Geocoder.init(key);

export default class Map extends Component {
  state = {
    botao: true,
    region: null,
    contador: 0,
    contadors: 0,
    waypoints: [],
    duration: null,
    location: null,
    pesquisa: false,
    rotas: false,
    melhorRota: false,
    destination: null,
    add_rota: [],
    botaoCaucularRota: false,
    botaoReiniciar: false
  };

  async componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        const response = await Geocoder.from({ latitude, longitude });
        const address = response.results[0].formatted_address;
        const location = address.substring(0, address.indexOf(","));

        this.setState({
          location,
          region: {
            latitude,
            longitude,
            latitudeDelta: 0.0143,
            longitudeDelta: 0.0134
          }
        });
      }, //sucesso
      () => {}, //erro
      {
        timeout: 2000,
        enableHighAccuracy: true,
        maximumAge: 1000
      }
    );
  }

  handleLocationSelected = (data, { geometry }) => {
    const {
      location: { lat: latitude, lng: longitude }
    } = geometry;

    if (this.state.add_rota != null) {
      this.setState({
        botaoCaucularRota: true
      });
    }

    {
      this.setState({
        botao: true,
        pesquisa: false,
        add_rota: [
          ...this.state.add_rota,
          {
            latitude,
            longitude,
            title: data.structured_formatting.main_text
          }
        ],
        waypoints: [...this.state.waypoints, { latitude, longitude }]
      });
    }
  };

  rotaMaisProxima = () => {
    this.setState({
      rotas: false,
      melhorRota: true,
      botaoReiniciar: true,
      botaoCaucularRota: false,
      botao: false
    });
  };

  addRota = () => {
    this.setState({
      pesquisa: true,
      botao: false,
      contador: this.state.contador + 1,
      rotas: true
    });
  };

  reiniciar = () => {
    this.setState({
      botao: true,
      contador: 0,
      melhorRota: false,
      botaoReiniciar: false,
      add_rota: [],
      waypoints: [],
      destination: null
    });
  };

  render() {
    const {
      botao,
      region,
      duration,
      rotas,
      contador,
      melhorRota,
      location,
      pesquisa,
      botaoCaucularRota,
      botaoReiniciar
    } = this.state;

    console.log(this.state.waypoints);

    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          region={region}
          showsUserLocation
          loadingEnabled
          ref={el => (this.MapView = el)}
        >
          {rotas &&
            this.state.add_rota.map(rota => (
              <Fragment>
                <Directions
                  origin={region}
                  destination={rota}
                  onReady={result => {
                    this.setState({ duration: Math.floor(result.duration) });
                    this.MapView.fitToCoordinates(result.coordinates, {
                      edgePadding: {
                        right: getPixelSize(50),
                        left: getPixelSize(50),
                        top: getPixelSize(50),
                        bottom: getPixelSize(350)
                      }
                    });
                  }}
                />
                <Marker
                  coordinate={rota}
                  anchor={{ x: 0, y: 0 }}
                  image={marckImage}
                >
                  <LocationBox>
                    <LocationText>{rota.title}</LocationText>
                  </LocationBox>
                </Marker>

                <Marker coordinate={region} anchor={{ x: 0, y: 0 }}>
                  <LocationBox>
                    <LocationTimeBox>
                      <LocationTimeText>{duration}</LocationTimeText>
                      <LocationTimeTextSmall>Min</LocationTimeTextSmall>
                    </LocationTimeBox>
                    <LocationText>{location}</LocationText>
                  </LocationBox>
                </Marker>
              </Fragment>
            ))}
          {melhorRota &&
            this.state.add_rota.map((rota, index) => (
              <Fragment>
                <Directions
                  origin={region}
                  destination={region}
                  waypoints={this.state.waypoints}
                  onReady={result => {
                    this.setState({ duration: Math.floor(result.duration) });
                    this.MapView.fitToCoordinates(result.coordinates, {
                      edgePadding: {
                        right: getPixelSize(50),
                        left: getPixelSize(50),
                        top: getPixelSize(50),
                        bottom: getPixelSize(350)
                      }
                    });
                  }}
                />
                <Marker
                  coordinate={rota}
                  anchor={{ x: 0, y: 0 }}
                  image={marckImage}
                >
                  <LocationBox>
                    <LocationText>{rota.title}</LocationText>
                  </LocationBox>
                </Marker>

                <Marker coordinate={region} anchor={{ x: 0, y: 0 }}>
                  <LocationBox>
                    <LocationTimeBox>
                      <LocationTimeText>{duration}</LocationTimeText>
                      <LocationTimeTextSmall>Min</LocationTimeTextSmall>
                    </LocationTimeBox>
                    <LocationText>{location}</LocationText>
                  </LocationBox>
                </Marker>
              </Fragment>
            ))}
        </MapView>

        {pesquisa ? (
          <Search onLocationSelected={this.handleLocationSelected} />
        ) : (
          <MapView />
        )}

        {botao && (
          <RequestButton onPress={this.addRota}>
            <RequestButtonText>Adicionar Rota</RequestButtonText>
          </RequestButton>
        )}
        {botaoCaucularRota && (
          <RequestButton onPress={this.rotaMaisProxima}>
            <RequestButtonText>Direcionar Rota Mais Proxima</RequestButtonText>
          </RequestButton>
        )}
        {botaoReiniciar && (
          <Fragment>
            <RequestButton onPress={this.reiniciar}>
              <RequestButtonText>Reiniciar</RequestButtonText>
            </RequestButton>
          </Fragment>
        )}
      </View>
    );
  }
}
