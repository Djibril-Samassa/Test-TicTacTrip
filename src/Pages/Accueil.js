import React from "react";
import Style from "./Accueil.module.css";
import { useEffect, useState } from "react";
import SearchBar from "../Composants/SearchBar";

// L'accueil ne va contenir pour l'instant que la barre de recherche

export default function Accueil() {
  return (
    <div>
      <SearchBar />
    </div>
  );
}
