"""Cliente de prueba: queda escuchando 90 segundos y loguea todo lo que llega."""
import json
import sys
import threading
import time
import urllib.request

import websocket

ANIMAL = sys.argv[1] if len(sys.argv) > 1 else "cerdos"
URL = f"ws://localhost:3000/ws?deviceId=test-esp32&animal={ANIMAL}"


def on_message(ws, msg):
    print(f"[RECV] {msg}")


def on_open(ws):
    print(f"[OPEN] conectado a {URL}")


def on_close(ws, code, reason):
    print(f"[CLOSE] code={code} reason={reason}")


def on_error(ws, err):
    print(f"[ERROR] {err}")


if __name__ == "__main__":
    print(f"[CLIENT] animal={ANIMAL} escuchando 80s...")
    ws = websocket.WebSocketApp(
        URL,
        on_open=on_open,
        on_message=on_message,
        on_close=on_close,
        on_error=on_error,
    )
    # Cierra automaticamente despues de 80 segundos (Windows no tiene SIGALRM)
    timer = threading.Timer(80.0, ws.close)
    timer.daemon = True
    timer.start()
    ws.run_forever()
