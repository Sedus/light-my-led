# light-my-led
 
 The goal of this project is to make a LED light up on an Arduino using a Raspberry Pi.
 
 To make this happen we're gonna use NodeJS with Redis on the Pi. The Pi and the Arduino
 are connected through the serial USB connection.

 The Arduino will send a message to the Pi letting it know when the LED starts and stops shining.
 
## Raspberry Pi

### NodeJS

How to install NodeJS on your pi.

### Redis

Redis is needed as storage for our applications.
How to install and run Redis on your pi.

    ssh into the pi.
    wget http://download.redis.io/releases/redis-3.0.3.tar.gz
    tar -xvf redis-3.0.3.tar.gz
    cd redis-3.0.3
    make
