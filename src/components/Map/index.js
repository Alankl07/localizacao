import React, { Component, Fragment } from "react";
import { View, Image, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getPixelSize } from "../../utils";
import Geocoder from "react-native-geocoding";

import Search from "../Search";
import Directions from "../Directions/index";
import marckImage from "../../assets/marker.png";
import backImage from "../../assets/back.png";

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

Geocoder.init("AIzaSyA0g97OgHoAdXUHROlDmJ_LIJtZH6gMI2E");

export default class Map extends Component {
  state = {
    botao: true,
    region: null,
    contador: 0,
    duration: null,
    location: null,
    pesquisa: false,
    pesquisa_1: false,
    pesquisa_2: false,
    pesquisa_3: false,
    pesquisa_4: false,
    destination: null,
    add_rota: [],
    destination_1: null,
    destination_2: null,
    destination_3: null,
    destination_4: null,
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

    this.setState({
      botao: true,
      pesquisa: false,
      destination: {
        latitude,
        longitude,
        title: data.structured_formatting.main_text
      }
    });
  };

  handleLocationSelected_1 = (data, { geometry }) => {
    const {
      location: { lat: latitude, lng: longitude }
    } = geometry;

    var duracao = this.state.duration;
    var localizacao = this.state.destination;
    var array = this.state.add_rota;
    array.push(duracao, localizacao);
    this.setState({
      add_rota: array,
      botao: true,
      pesquisa_1: false,
      destination_1: {
        latitude,
        longitude,
        title: data.structured_formatting.main_text
      }
    });
  };

  handleLocationSelected_2 = (data, { geometry }) => {
    const {
      location: { lat: latitude, lng: longitude }
    } = geometry;

    var duracao = this.state.duration;
    var localizacao = this.state.destination_1;
    var array = this.state.add_rota;
    array.push(duracao, localizacao);

    this.setState({
      add_rota: array,
      botao: true,
      pesquisa_2: false,
      destination_2: {
        latitude,
        longitude,
        title: data.structured_formatting.main_text
      }
    });
  };

  handleLocationSelected_3 = (data, { geometry }) => {
    const {
      location: { lat: latitude, lng: longitude }
    } = geometry;

    var duracao = this.state.duration;
    var localizacao = this.state.destination_2;
    var array = this.state.add_rota;
    array.push(duracao, localizacao);

    this.setState({
      add_rota: array,
      botao: true,
      pesquisa_3: false,
      destination_3: {
        latitude,
        longitude,
        title: data.structured_formatting.main_text
      }
    });
  };

  handleLocationSelected_4 = (data, { geometry }) => {
    const {
      location: { lat: latitude, lng: longitude }
    } = geometry;

    var duracao = this.state.duration;
    var localizacao = this.state.destination_3;
    var array = this.state.add_rota;
    array.push(duracao, localizacao);

    this.setState({
      add_rota: array,
      botaoCaucularRota: true,
      botao: false,
      pesquisa_4: false,
      destination_4: {
        latitude,
        longitude,
        title: data.structured_formatting.main_text
      }
    });
  };

  addRota = () => {
    if (this.state.contador == 0) {
      this.setState({
        pesquisa: true,
        botao: false,
        contador: this.state.contador + 1
      });
    } else if (this.state.contador == 1) {
      this.setState({
        pesquisa_1: true,
        botao: false,
        contador: this.state.contador + 1
      });
    } else if (this.state.contador == 2) {
      this.setState({
        pesquisa_2: true,
        botao: false,
        contador: this.state.contador + 1
      });
    } else if (this.state.contador == 3) {
      this.setState({
        pesquisa_3: true,
        botao: false,
        contador: this.state.contador + 1
      });
    } else if (this.state.contador == 4) {
      this.setState({
        pesquisa_4: true,
        botao: false
      });
    }
  };

  rotaMaisProxima = () => {
    var duracao = this.state.duration;
    if (duracao != null) {
      var localizacao = this.state.destination_4;
      var array = this.state.add_rota;
      array.push(duracao, localizacao);
    }

    var vetor = this.state.add_rota;
    var menor = vetor[0];
    for (var i = 0; i < vetor.length; i++) {
      if (vetor[i] < menor) {
        menor = vetor[i];
      }
    }

    if (menor == vetor[0]) {
      this.setState({
        duration: menor,
        destination_1: null,
        destination_2: null,
        destination_3: null,
        destination_4: null,
        botaoCaucularRota: false,
        botaoReiniciar: true
      });
    } else if (menor == vetor[2]) {
      this.setState({
        duration: menor,
        destination: null,
        destination_2: null,
        destination_3: null,
        destination_4: null,
        botaoCaucularRota: false,
        botaoReiniciar: true
      });
    } else if (menor == vetor[4]) {
      this.setState({
        duration: menor,
        destination: null,
        destination_1: null,
        destination_3: null,
        destination_4: null,
        botaoCaucularRota: false,
        botaoReiniciar: true
      });
    } else if (menor == vetor[6]) {
      this.setState({
        duration: menor,
        destination: null,
        destination_1: null,
        destination_2: null,
        destination_4: null,
        botaoCaucularRota: false,
        botaoReiniciar: true
      });
    } else if (menor == vetor[8]) {
      this.setState({
        duration: menor,
        destination: null,
        destination_1: null,
        destination_2: null,
        destination_3: null,
        botaoCaucularRota: false,
        botaoReiniciar: true
      });
    }
    console.log("+====================================================");
    console.log(vetor[0]);
    console.log(vetor[2]);
    console.log(vetor[4]);
    console.log(vetor[6]);
    console.log(vetor[8]);
  };

  reiniciar = () => {
    this.setState({
      botao: true,
      contador: 0,
      botaoReiniciar: false,
      add_rota: [],
      destination: null,
      destination_1: null,
      destination_2: null,
      destination_3: null,
      destination_4: null
    });
  };

  render() {
    const {
      botao,
      region,
      duration,
      location,
      pesquisa,
      pesquisa_1,
      pesquisa_2,
      pesquisa_3,
      pesquisa_4,
      destination,
      destination_1,
      destination_2,
      destination_3,
      destination_4,
      botaoCaucularRota,
      botaoReiniciar,
      contador
    } = this.state;

    console.log(this.state.add_rota);

    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          region={region}
          showsUserLocation
          loadingEnabled
          ref={el => (this.MapView = el)}
        >
          {destination && (
            <Fragment>
              <Directions
                origin={region}
                destination={destination}
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
                coordinate={destination}
                anchor={{ x: 0, y: 0 }}
                image={marckImage}
              >
                <LocationBox>
                  <LocationText>{destination.title}</LocationText>
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
          )}

          {destination_1 && (
            <Fragment>
              <Directions
                origin={region}
                destination={destination_1}
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
                coordinate={destination_1}
                anchor={{ x: 0, y: 0 }}
                image={marckImage}
              >
                <LocationBox>
                  <LocationText>{destination_1.title}</LocationText>
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
          )}

          {destination_2 && (
            <Fragment>
              <Directions
                origin={region}
                destination={destination_2}
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
                coordinate={destination_2}
                anchor={{ x: 0, y: 0 }}
                image={marckImage}
              >
                <LocationBox>
                  <LocationText>{destination_2.title}</LocationText>
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
          )}

          {destination_3 && (
            <Fragment>
              <Directions
                origin={region}
                destination={destination_3}
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
                coordinate={destination_3}
                anchor={{ x: 0, y: 0 }}
                image={marckImage}
              >
                <LocationBox>
                  <LocationText>{destination_3.title}</LocationText>
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
          )}

          {destination_4 && (
            <Fragment>
              <Directions
                origin={region}
                destination={destination_4}
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
                coordinate={destination_4}
                anchor={{ x: 0, y: 0 }}
                image={marckImage}
              >
                <LocationBox>
                  <LocationText>{destination_4.title}</LocationText>
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
          )}
        </MapView>

        {pesquisa ? (
          <Search onLocationSelected={this.handleLocationSelected} />
        ) : (
          <MapView />
        )}

        {pesquisa_1 ? (
          <Search onLocationSelected={this.handleLocationSelected_1} />
        ) : (
          <MapView />
        )}

        {pesquisa_2 ? (
          <Search onLocationSelected={this.handleLocationSelected_2} />
        ) : (
          <MapView />
        )}

        {pesquisa_3 ? (
          <Search onLocationSelected={this.handleLocationSelected_3} />
        ) : (
          <MapView />
        )}

        {pesquisa_4 ? (
          <Search onLocationSelected={this.handleLocationSelected_4} />
        ) : (
          <MapView />
        )}

        {botao && (
          <RequestButton>
            <RequestButtonText onPress={this.addRota}>
              Adicionar Rota
            </RequestButtonText>
          </RequestButton>
        )}
        {botaoCaucularRota && (
          <RequestButton>
            <RequestButtonText onPress={this.rotaMaisProxima}>
              Direcionar Rota Mais Proxima
            </RequestButtonText>
          </RequestButton>
        )}
        {botaoReiniciar && (
          <Fragment>
            <RequestButton>
              <RequestButtonText onPress={this.reiniciar}>
                Reiniciar
              </RequestButtonText>
            </RequestButton>
          </Fragment>
        )}
      </View>
    );
  }
}
