"""Cliente de prueba: conecta al WS del backend y loguea todo lo que llega."""
import json
import sys
import threading
import time
import urllib.request

import websocket

URL = "ws://localhost:3000/ws?deviceId=test-esp32&animal=cerdos"


def feeder_thread():
    """En el segundo 3, dispara un POST /api/feed/cerdos para forzar un broadcast."""
    time.sleep(3)
    try:
        req = urllib.request.Request(
            "http://localhost:3000/api/feed/cerdos",
            data=b'{"amount": 5}',
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req) as r:
            print(f"[POST] status={r.status} body={r.read().decode()}")
    except Exception as e:
        print(f"[POST] error: {e}")


def on_message(ws, msg):
    print(f"[RECV] {msg}")


def on_open(ws):
    print(f"[OPEN] conectado a {URL}")


def on_close(ws, code, reason):
    print(f"[CLOSE] code={code} reason={reason}")


def on_error(ws, err):
    print(f"[ERROR] {err}")


if __name__ == "__main__":
    threading.Thread(target=feeder_thread, daemon=True).start()
    ws = websocket.WebSocketApp(
        URL,
        on_open=on_open,
        on_message=on_message,
        on_close=on_close,
        on_error=on_error,
    )
    print("[CLIENT] arrancando, esperare 6 segundos...")
    ws.run_forever()
