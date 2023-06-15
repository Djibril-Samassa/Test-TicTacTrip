import React from "react";
import Style from "./Accueil.module.css";
import { useEffect, useState } from "react";
import SearchBar from "../Composants/SearchBar";

export default function Accueil() {
  return (
    <div>
      <SearchBar />
    </div>
  );
}
