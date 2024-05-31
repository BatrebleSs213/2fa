import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";

export default function Enable2fa(props) {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(null);
  const [secret, setSecret] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    axios
      .post(
        "/generate-2fa-secret",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200 && !response.data.twofaEnabled) {
          const { secret, qrImageDataUrl } = response.data;
          setSecret({ secret, qrImageDataUrl });
          setMessage(null);
        }
      })
      .catch((error) => {
        if (error.response.status === 400 && error.response.data.twofaEnabled) {
          navigate("/profile");
        } else {
          setSecret(null);
          setMessage("Ошибка");
        }
      });
  }, [navigate]);

  function onClick(event) {
    event.preventDefault();
    axios
      .post(
        "/verify-otp",
        {
          token: otp,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200 && response.data.twofaEnabled) {
          navigate("/disable-2fa");
        }
      })
      .catch((error) => {
        if (
          error.response.status === 400 &&
          !error.response.data.twofaEnabled
        ) {
          setMessage("Неудачное подтверждение ОТР: Недействительный жетон");
        } else {
          setMessage("Ошибка");
        }
      });
  }

  return (
    <Card>
      {secret && (
        <>
          <h2>Включить 2ФА</h2>

          <div className="twofa_instructions">
            Отсканируйте QR-код или вручную введите секрет в{" "}
            <a
              target="_blank"
              href="https://gauth.apps.gbraad.nl/"
            >
              OTP Аутентификатор
            </a>{" "}
            и затем введите одноразовый пароль для включения Двухфакторной Аутентификации
          </div>

          <div className="twofa_secret">
            <img src={secret.qrImageDataUrl} />

            <p>
              Секрет: <b>{secret.secret}</b>
            </p>
          </div>

          <form>
            <div className="form_field_container">
              <label>OTP</label>
              <input type="number" onChange={(e) => setOtp(e.target.value)} />
            </div>

            <button type="submit" onClick={onClick}>
              Включить 2ФА
            </button>
          </form>
        </>
      )}

      <Link to={"/profile"}>Вернуться в профиль</Link>

      {message && <div>{message}</div>}
    </Card>
  );
}
