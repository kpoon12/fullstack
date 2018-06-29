import random
from flask import Flask, render_template
import time
import socket
import json
import struct

app = Flask(__name__, static_folder='../static/dist', template_folder='../static')

#TEST Commnuication to WELDLOOP
ops = bytearray([0xAA, 0x00])
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.settimeout(5)
s.connect(("10.65.4.142",700))


@app.route('/')
def index():
    return render_template('public/index.html')

@app.route('/app.html')
def index():
    return render_template('public/app.html')

@app.route('/hello') # take note of this decorator syntax, it's a common pattern
def hello():
    # It is good practice to only call a function in your route end-point,
    # rather than have actual implementation code here.
    # This allows for easier unit and integration testing of your functions.
    return get_SThello()


def get_hello():
    greeting_list = ['Ciao', 'Hei', 'Salut', 'Hola', 'Hallo', 'Hej']
    #data = { "ID": "123", "NAME": "JOHN" }
    return random.choice(greeting_list)
    #return data



def get_SThello():
    current = 1234
    travel = 5678
    wirefeed = 9012
    avc = 3456
    osc = 7890
    print ops
    xops = struct.pack("HHHHH", current, travel, wirefeed, avc, osc)
    print type(xops)
    print bytearray(xops)

    s.send(ops + bytearray(xops))
    data = s.recv(1024)

    b = []
    for i in range(0, len(data)):
        b.append(data[i])

    b = struct.pack("HHHHH", current, travel, wirefeed, avc, osc)
    print b

    value = struct.unpack("HHHHH", bytearray(b))

    js = {}
    js['Current'] = value[0];
    js['Voltage'] = value[1];
    js['Speed'] = value[2];
    js['Heat Input'] = value[3];
    js["TIME"] = time.strftime("%H:%M:%S")
    js["12 TIME"] = time.strftime("%I:%M:%S")
    js["OSC"] = "0";
    js["AVC"] = "9";
    js["TEST"] = "10"
    json_data = json.dumps(js)

    return json_data

if __name__ == '__main__':
    app.run()
