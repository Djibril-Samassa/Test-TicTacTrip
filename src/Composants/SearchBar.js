import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./SearchBar.module.css";
import Select from "react-select";
import { Icon } from "@iconify/react";

export default function SearchBar() {
  // style à appliquer sur les input de texte (Spécifique à React Select)
  const TextInputStyle = {
    control: (base) => ({
      ...base,
      border: 0,
      boxShadow: "none",
    }),
  };

  const TextInputStyle2 = {
    control: (base) => ({
      ...base,
      border: "none",
      boxShadow: "none",
      backgroundColor: "#F1F2F6",
      color: "#a0a8c2",
    }),
  };

  const options = {
    travelWay: [
      { value: "Aller", label: "Aller" },
      { value: "Aller-retour", label: "Aller-retour" },
    ],
  };

  const [accommodation, setAccommodation] = useState(false);
  const [travelOption, setTravelOption] = useState({});

  // => On enregistre la ville de départ et d'arrivée
  // => L'objet entier on ne sait jamais s'il y a d'autres champs dont on aura besoin
  const [choosenCities, setChoosenCities] = useState({
    start: {},
    finish: {},
  });

  // La liste affiché dans la Select List => Soit les villes populaires, soit la liste des villes par lettre
  const [startCities, setStartCities] = useState([]);
  const [finishCities, setFinishCities] = useState([]);

  useEffect(() => {
    GetPopularCities("start");
  }, []);

  // Récuperer les villes les plus populaires
  // De départ ou d'arrivée avec une condition qui vérifie
  const GetPopularCities = (event) => {
    if (event === "start") {
      axios.get("https://api.comparatrip.eu/cities/popular/5").then((res) => {
        // Ce sera les propositions par défaut
        setStartCities(res.data);
      });
    } else if (event === "finish") {
      axios
        .get(
          `https://api.comparatrip.eu/cities/popular/from/${choosenCities.start.unique_name}/5`
        )
        .then((res) => {
          // Ce sera les propositions par défaut
          setFinishCities(res.data);
        });
    } else {
      alert("Un problème est survenu");
    }
  };

  // Recherchez ville par le nom
  const SearchCityByName = (e, event) => {
    const name = e.target.value;
    if (event === "start") {
      axios
        .get(`https://api.comparatrip.eu/cities/autocomplete/?q=${name}`)
        .then((res) => {
          // On propose les villes de cette liste sur la SelectList
          setStartCities(res.data);
        });
    } else if (event === "finish") {
      axios
        .get(`https://api.comparatrip.eu/cities/autocomplete/?q=${name}`)
        .then((res) => {
          // On propose les villes de cette liste sur la SelectList
          setFinishCities(res.data);
        });
    } else {
      alert("Une erreur est survenue");
    }
  };

  // Quand une ville de départ est sélectionnée, on récupère la liste des villes d'arrivée les plus populaires depuis ces villes
  useEffect(() => {
    console.log(choosenCities.start);
    if (choosenCities.start.unique_name) {
      GetPopularCities("finish");
    } else {
    }
  }, [choosenCities]);

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
        <Select
          onKeyDown={(e) => {
            SearchCityByName(e, "start");
          }}
          type="text"
          className={Style.inputField}
          placeholder="From: City, Station or Airport"
          styles={TextInputStyle2}
          options={startCities}
          // Renseigner ce qui sera affiché dans la select liste si le nom de clé n'est pas "label"
          getOptionLabel={(option) => option.local_name}
          // Renseigner ce qui sera affiché dans la select liste si le nom de clé n'est pas "value"
          getOptionValue={(option) => option.local_name}
          // On enregistre la ville sélectionné dans la variable choosenCities
          onChange={async (option) => {
            // Quand une ville de départ est selectionnée on l'enregistre
            await setChoosenCities({ ...choosenCities, start: option });
          }}
        />

        <Select
          type="text"
          className={Style.inputField}
          placeholder="To: City, Station or Airport"
          styles={TextInputStyle2}
          options={finishCities}
          // Renseigner ce qui sera affiché dans la select liste si le nom de clé n'est pas "label"
          getOptionLabel={(option) => option.local_name}
          // Renseigner ce qui sera affiché dans la select liste si le nom de clé n'est pas "value"
          getOptionValue={(option) => option.local_name}
        />
      </div>
      {/* Activer affichage d'hébergement */}
      <div></div>
    </div>
  );
}
