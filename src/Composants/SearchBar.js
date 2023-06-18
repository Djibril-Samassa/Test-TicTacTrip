import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./SearchBar.module.css";
import Select from "react-select";
import { Icon } from "@iconify/react";

export default function SearchBar() {
  const [accommodation, setAccommodation] = useState(false);
  const [travelOption, setTravelOption] = useState({});

  // style à appliquer sur les input de texte (S    pécifique à React Select)
  const TextInputStyle = {
    control: (base) => ({
      ...base,
      border: 0,
      boxShadow: "none",
    }),
  };

  const options = {
    travelWay: [
      { value: "Aller", label: "Aller" },
      { value: "Aller-retour", label: "Aller-retour" },
    ],
  };

  // Les villes les plus populaires
  const [popularCities, setPopularCities] = useState([]);

  useEffect(() => {
    GetPopularCities()
  }, []);

  // Récuperer les villes les plus populaires
  const GetPopularCities = () => {
    axios.get("https://api.comparatrip.eu/cities/popular/5").then((res) => {
      setPopularCities(res.data);
    });
  };

  return (
    <div>
      {/* Informations sur le type de trajet */}
      <div>
        <Select
          placeholder="Aller"
          className={Style.textInput}
          options={options.travelWay}
          components={{ IndicatorSeparator: () => null }}
          styles={TextInputStyle}
        />

        {/* <Select
          placeholder="Aller"
          className={Style.textInput}
          options={options}
          components={{ IndicatorSeparator: () => null }}
          styles={TextInputStyle}
        /> */}
      </div>
      {/* Informations sur les dates et destinations du trajet */}
      <div>
        {/* Input avec une icone */}
        <div className={Style.inputWithIcon}>
          <Icon icon="game-icons:position-marker" className={Style.inputIcon} />
          <input
            type="text"
            className={Style.inputField}
            placeholder="From: City, Station or Airport"
          />
        </div>

        {/* Input avec une icone */}
        <div className={Style.inputWithIcon}>
          <Icon icon="game-icons:position-marker" className={Style.inputIcon} />
          <input
            type="text"
            className={Style.inputField}
            placeholder="To: City, Station or Airport"
          />
        </div>
      </div>
      {/* Activer affichage d'hébergement */}
      <div></div>
    </div>
  );
}
