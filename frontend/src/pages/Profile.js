import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_API_URL } from "../env";
import Logout from "../components/Logout";
import { Link } from "react-router-dom";
import Card from "../components/Card";

export default function Profile(props) {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    axios
      .get("/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data.user);
          setMessage(null);
        }
      })
      .catch((error) => {
        setUser(null);
        setMessage("Ошибка");
      });
  }, []);

  return (
    <Card>
      <h2>Профиль</h2>

      {user && (
        <table>
          {Object.entries(user).map(([k, v]) => (
            <tr>
              <th>{String(k)}</th>
              <td>{String(v)}</td>
            </tr>
          ))}
        </table>
      )}

      {message && <div>{message}</div>}

      {user && user.twofaEnabled ? (
        <Link to={"/disable-2fa"}>Выключить 2ФА</Link>
      ) : (
        <Link to={"/enable-2fa"}>Включить 2ФА</Link>
      )}

      <Logout />
    </Card>
  );
}
