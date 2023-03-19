import React, { useState, useEffect } from "react";

/** Currently on HIATUS */
export default function AudioImport() {
  const clickImportAudio = () => {

  }

  //Adds audio file into the database
  const addAudio = (e : React.ChangeEvent<HTMLInputElement>) => {
  }

  return (
    <div>
      <button onClick={clickImportAudio}>Import Audio</button>
      <input type="file" onChange={addAudio}/>
    </div>
  );
}