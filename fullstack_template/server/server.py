import random
from flask import Flask, render_template
import time
import socket
import json
import struct

app = Flask(__name__, static_folder='../static/dist', template_folder='../static')

#TEST Commnuication to WELDLOOP
#Server to weldloop message
COM_TEST = bytearray([0xAA, 0x00])
WELD_XMIT_START = bytearray([0x51, 0x00])
NUM_LEVELS		= bytearray([0x52, 0x00])
SCHED_PARMS_DATA= bytearray([0x53, 0x00])
ONE_LEVEL_DATA	= bytearray([0x54, 0x00])
LEVEL_DATA		= bytearray([0x55, 0x00])
WELD_HEAD_DATA	= bytearray([0x56, 0x00])
WELD_XMIT_DONE	= bytearray([0x57, 0x00])
WELDCMD_TESTMODE= bytearray([0x58, 0x00])
WELDCMD_MANPRGE	= bytearray([0x59, 0x00])
WELDCMD_WIREOFF	= bytearray([0x5A, 0x00])
WELDCMD_MANADV	= bytearray([0x5B, 0x00])
SET_WELD_LEVEL	= bytearray([0x5C, 0x00])
WELDCMD_LAMPOFF	= bytearray([0x5D, 0x00])
WELDCMD_OSCMAN	= bytearray([0x5E, 0x00])
WELDCMD_TVLDIR	= bytearray([0x5F, 0x00])
RETURN_TO_HOME	= bytearray([0x60, 0x00])
CHECK_GROUND_FAULT= bytearray([0x61, 0x00])
WELDCMD_SET		= bytearray([0x62, 0x00])
WELDCMD_SEQSTART= bytearray([0x63, 0x00])
WELDCMD_SEQSTOP	= bytearray([0x64, 0x00])
WELDCMD_ALLSTOP	= bytearray([0x65, 0x00])
WELDCMD_PWRAP	= bytearray([0x66, 0x00])
AMI_CLEAR_FAULTS= bytearray([0x67, 0x00])
AMI_SET_WELDSCHED= bytearray([0x68, 0x00])
WRITE_LIB_STRINGS= bytearray([0x69, 0x00])
WRITE_LED_STRING= bytearray([0x6A, 0x00])
SERVO_CONSTANTS	= bytearray([0x6B, 0x00])
SINGLE_MULTILEVEL_DATA= bytearray([0x6C, 0x00])
CMD_HEARTBEAT	= bytearray([0x6D, 0x00])
SCHED_DATAAQI_DATA= bytearray([0x6E, 0x00])
WELDCMD_SERVOJOG= bytearray([0x6F, 0x00])
WELDCMD_MANIPJOG= bytearray([0x70, 0x00])
POSITION_RESET	= bytearray([0x71, 0x00])
WELDCMD_SVRCHG	= bytearray([0x72, 0x00])
ONE_LEVEL_UPDATE= bytearray([0x73, 0x00])
GAIN_CALIBRATION= bytearray([0x74, 0x00])
OFFSETGAIN_LOWER= bytearray([0x75, 0x00])
OFFSETGAIN_UPPER= bytearray([0x76, 0x00])
NO_SCHED_LOADED	= bytearray([0x77, 0x00])
SET_LAMP_TIME	= bytearray([0x78, 0x00])
SET_HOME_DIRECTION= bytearray([0x79, 0x00])
SET_POSTPURGEHOME= bytearray([0x7A, 0x00])
SET_BOOSTER_VOLTAGE = bytearray([0x7B, 0x00])
SET_FAULT_ENABLES	= bytearray([0x7C, 0x00])
SET_AUXLINE_FUNCTION= bytearray([0x7D, 0x00])
ENABLE_OSCILLATOR	= bytearray([0x7E, 0x00])
OSC_SPEEDSTEER      = bytearray([0x7F, 0x00])
XMIT_SERVODEF_START	= bytearray([0x80, 0x00])
XMIT_ONESERVODEF	= bytearray([0x81, 0x00])
XMIT_SERVODEF_DONE	= bytearray([0x82, 0x00])
DIGITAL_OUTPUT_TEST	= bytearray([0x83, 0x00])
ANALOG_OUTPUT_TEST	= bytearray([0x84, 0x00])
RF_TEST				= bytearray([0x85, 0x00])
WRITE_PDBITMAP		= bytearray([0x86, 0x00])
OSC_LIMIT_DATA		= bytearray([0x87, 0x00])
SET_LEVEL_TIME		= bytearray([0x88, 0x00])
GUI_CONNECTED       = bytearray([0x89, 0x00])
LAST_COMMAND		=	GUI_CONNECTED

#Connect to STM32 
WeldLoopSocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
WeldLoopSocket.settimeout(5)
WeldLoopSocket.connect(("10.65.4.142",700))


@app.route('/')
def index():
    return render_template('public/index.html')


@app.route('/hello') # take note of this decorator syntax, it's a common pattern
def hello():
    # It is good practice to only call a function in your route end-point,
    # rather than have actual implementation code here.
    # This allows for easier unit and integration testing of your functions.
    return get_SThello()

#TEST send JSON data back to react application
def get_hello():
    #Create JSON data
    js = {}
    js['Current'] = 1
    js['Voltage'] = 2
    js['Speed'] = 3
    js['Heat Input'] = 4
    js["OSC"] = 5
    js["AVC"] = 6
    js["TEST"] = 7
    js["TIME"] = time.strftime("%H:%M:%S")
    js["12 TIME"] = time.strftime("%I:%M:%S")
    json_data = json.dumps(js)
    
    #return jsaon data
    return json_data


#TEST get data from STM32 and send back to react application
def get_SThello():
    current = 1234
    travel = 5678
    wirefeed = 9012
    avc = 3456
    osc = 7890
    time = 1020

    #Create default data
    xops = struct.pack("HHHHHH", current, travel, wirefeed, avc, osc, time)
    print type(xops)
    print bytearray(xops)

    #Send default data to STM32
    WeldLoopSocket.send(COM_TEST + bytearray(xops))
    data = WeldLoopSocket.recv(1024)

    #Convert data to list
    listdata = []
    for i in range(0, len(data)):
        listdata.append(data[i])

    #Unpack list to short  integer
    value = struct.unpack("HHHHHH", bytearray(listdata))

    #Creat JSON data send back to react application
    js = {}
    js['Current'] = value[0]
    js['Travel'] = value[1]
    js['Wirefeed'] = value[2]
    js['AVC'] = value[3]
    js["OSC"] = value[4]
    js["Time"] = value[5]
    json_data = json.dumps(js)

    return json_data

if __name__ == '__main__':
    app.run()
