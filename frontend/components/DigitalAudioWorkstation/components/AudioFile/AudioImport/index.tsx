import React, { useState, useEffect } from "react";
import { addAudioFile } from "../../../adapter";

const AudioImport = () => {
  const clickImportAudio = () => {

  }

  //Adds audio file into the database
  const addAudio = (e : React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addAudioFile(e.target.files[0]);
    }
  }

  return (
    <div>
      <button onClick={clickImportAudio}>Import Audio</button>
      <input type="file" onChange={addAudio}/>
    </div>
  );
}