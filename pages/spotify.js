import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const CLIENT_ID = "ea86301d3ebe48559a512fce57194689";
  const REDIRECT_URI = "https://spotify-playlists-alpha.vercel.app/spotify";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);
  }, []);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  const [playlisthKey, setPlaylisthKey] = useState("");
  const [playlists, setPlaylists] = useState([]);

  const searchPlaylists = async (e) => {
    e.preventDefault();

    const { data } = await axios.get(
      "https://api.spotify.com/v1/playlists/" + playlisthKey,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setPlaylists(data.tracks.items);
  };

  const renderPlaylists = () => {
    return playlists.map((playlists, i) => (
      <tr key={playlists.track.id}>
        <td>
          <span>{i + 1}</span>
        </td>
        <td>
          <span>{playlists.track.name}</span>
        </td>
        {playlists.track.artists.map((artist) => (
          <td key={artist.id}>
            <span>{artist.name}</span>
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Spotify React</h1>
        {!token ? (
          <a
            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
          >
            Login to Spotify
          </a>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
      </header>
      <main>
        <form onSubmit={searchPlaylists}>
          <input
            type="text"
            onChange={(e) => setPlaylisthKey(e.target.value)}
          />
          <button type={"submit"}>Playlist</button>
        </form>

        <table id="spotify">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Artist</th>
              <th>Artist 2</th>
              <th>Artist 3</th>
              <th>Artist 4</th>
              <th>Artist 5</th>
              <th>Artist 6</th>
            </tr>
          </thead>
          <tbody>{renderPlaylists()}</tbody>
        </table>
      </main>
    </div>
  );
}

export default App;
