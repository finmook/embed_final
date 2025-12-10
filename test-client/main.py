import paho.mqtt.client as mqtt
from time import sleep
import threading


def on_connect(client, userdata, flags, reason_code, properties):
    print(f"Connected with result code {reason_code}")
    client.subscribe("$SYS/#")


def on_message(client, userdata, msg):
    print(msg.topic + " " + msg.payload.decode())


def publish_loop(client):
    while True:
        sleep(1)
        result = client.publish("@msg/sensor", "12345")
        if result.rc == mqtt.MQTT_ERR_SUCCESS:
            print("published")
        else:
            print("publish failed:", result.rc)


NETPIE_SECRET="pjAUdQWUt399ej2MU7Yp2kaD9WxHHhdq"
NETPIE_USERNAME="LUATY9kAkGBggCJ72wwrPEaaMybcHWco"
NETPIE_CLIENT_ID="cddb1ce8-33ce-46f3-8de3-decc4cee4446"

# from dotenv
# NETPIE_SECRET="CCmPw9nURSUaUCmHKGbVovPgAXJifpXt"
# NETPIE_USERNAME="5XFmmodGWrCygrokBvP45WSC72Dv7JKC"
# NETPIE_CLIENT_ID="f89c20aa-2f02-45a6-96ee-9335ad55475e"

mqttc = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id=NETPIE_CLIENT_ID)
mqttc.username_pw_set(NETPIE_USERNAME, NETPIE_SECRET)
mqttc.on_connect = on_connect
mqttc.on_message = on_message

mqttc.connect("mqtt.netpie.io", 1883, 60)

# start the network loop in a background thread
mqttc.loop_start()

# start your publish loop in another thread
threading.Thread(target=publish_loop, args=(mqttc,), daemon=True).start()

# keep the main thread alive
while True:
    sleep(10)