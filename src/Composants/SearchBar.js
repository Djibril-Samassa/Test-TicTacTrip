import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./SearchBar.module.css";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Icon } from "@iconify/react";
import BootstrapSwitchButton from "bootstrap-switch-button-react";

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
      padding: "0.2em",
      margin: "0px 10px",
      minWidth: "20vw",
    }),
  };

  const options = {
    travelWay: [
      { value: "aller", label: "Aller" },
      { value: "aller-retour", label: "Aller-retour" },
    ],
    traveller: [
      { value: "adulte", label: "Adulte" },
      { value: "enfant", label: "Enfant" },
    ],
  };

  const [accommodation, setAccommodation] = useState(false);
  const [travelOption, setTravelOption] = useState({
    travelWay: "",
  });

  // => On enregistre la ville de départ et d'arrivée
  // => L'objet entier on ne sait jamais s'il y a d'autres champs dont on aura besoin
  const [choosenCities, setChoosenCities] = useState({
    start: {},
    finish: {},
  });

  // La liste affiché dans la Select List => Soit les villes populaires, soit la liste des villes par lettre
  const [startCities, setStartCities] = useState([]);
  const [finishCities, setFinishCities] = useState([]);

  // Les dates d'aller et de retour
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    GetPopularCities("start");
  }, []);

  // Récuperer les villes les plus populaires
  // De départ ou d'arrivée avec une condition qui vérifie
  const GetPopularCities = (event, end) => {
    const startCity = end?.unique_name;
    console.log(startCity);
    if (event === "start") {
      axios.get("https://api.comparatrip.eu/cities/popular/5").then((res) => {
        // Ce sera les propositions par défaut
        setStartCities(res.data);
      });
    } else if (event === "finish") {
      axios
        .get(`https://api.comparatrip.eu/cities/popular/from/${startCity}/5`)
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

  return (
    <div className={Style.container}>
      {/* Informations sur le type de trajet */}
      <div className={Style.flexRow}>
        <Select
          defaultValue={options.travelWay[0]}
          className={Style.textInput}
          options={options.travelWay}
          components={{ IndicatorSeparator: () => null }}
          styles={TextInputStyle}
          onChange={(option) => {
            setTravelOption({ ...travelOption, travelWay: option.value });
          }}
          onKeyDown={(e) => {
            e.preventDefault();
          }}
        />

        <Select
          defaultValue={options.traveller[0]}
          className={Style.textInput}
          options={options.traveller}
          components={{ IndicatorSeparator: () => null }}
          styles={TextInputStyle}
        />
      </div>

      {/* Informations sur les dates et destinations du trajet */}
      <div className={Style.flexRow}>
        {/* Ville aller */}
        <Select
          onKeyDown={(e) => {
            SearchCityByName(e, "start");
          }}
          type="text"
          className={Style.inputField}
          placeholder="Depuis: ville, station ou aéroport"
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
            GetPopularCities("finish", option);
          }}
        />

        {/* Afiiché la ville retour si l'utilisateur a choisi aller-retour */}
        {travelOption.travelWay === "aller-retour" ? (
          <Select
            type="text"
            className={Style.inputField}
            placeholder="Vers: ville, station ou aéroport"
            styles={TextInputStyle2}
            options={finishCities}
            // Renseigner ce qui sera affiché dans la select liste si le nom de clé n'est pas "label"
            getOptionLabel={(option) => option.local_name}
            // Renseigner ce qui sera affiché dans la select liste si le nom de clé n'est pas "value"
            getOptionValue={(option) => option.local_name}
          />
        ) : null}

        {/* Afficher la sélection de dates */}
        <div className={Style.DatePickerComponent}>
          <div className={Style.dateInput}>
            <Icon
              className={Style.icone}
              icon="majesticons:calendar"
              color="#89898a"
              width="30"
              height="30"
            />
            <DatePicker
              placeholderText="+ Ajouter date aller"
              className={Style.datePicker}
              // Permettre la sélection que depuis le calendrier et pas manuellement
              onKeyDown={(e) => {
                e.preventDefault();
              }}
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
            />
          </div>
          {travelOption.travelWay === "aller-retour" ? (
            <>
              <span>|</span>
              <div className={Style.dateInput}>
                <DatePicker
                  placeholderText="+ Ajouter date retour"
                  className={Style.datePicker}
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                />
              </div>
            </>
          ) : null}
        </div>

        <input
          className={Style.recherche}
          type="submit"
          onClick={(e) => {
            e.preventDefault();
          }}
          value={"Chercher"}
        />
      </div>

      {/* Activer affichage d'hébergement */}
      <div>
        <input
          type="checkbox"
          className="custom-control-input"
          id="customSwitches"
          readOnly
        />
        <label for="swicth">Trouver mon hébergement</label>
      </div>
    </div>
  );
}
