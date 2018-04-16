#! /usr/bin/env python3

import argparse
import asyncio
import functools
import requests
import random
import signal
import json
import sys

catalogue = json.load(open("./catalogue.json"))

def subscribe(endpoint):
    url = "http://"+endpoint+"/mighty-fine/api/subscribe"
    return requests.post(url, headers={"Content-Type": "application/json"}, json={}).json()
    
def unsubscribe(endpoint):
    url = "http://"+endpoint+"/mighty-fine/api/unsubscribe"
    return requests.post(url, headers={"Content-Type": "application/json"}, json={}).json()

def purchase(endpoint):
    url = "http://"+endpoint+"/mighty-fine/api/purchase"
    basket = []
    items_ids = list(catalogue.keys())
    for i in range(random.randint(1,10)):
        basket.append({"id": random.choice(items_ids), "count":random.randint(1,3)})
    return requests.post(url, headers={"Content-Type": "application/json"}, data=json.dumps(basket))
    
def repeat(loop, rate_per_second, fn):
    def f():
        fn()
        loop.call_later(1.0/rate_per_second, f)
    loop.call_soon(f)

def repeat_call(loop, f, rate, endpoint):
    repeat(loop, rate, functools.partial(f, endpoint))

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="A client for the whiskey shop API")
    parser.add_argument("endpoint", help="The target endpoint (IP or hostname)")
    parser.add_argument("-s", "--subscribe", type=int, help="The subscription rate per second")
    parser.add_argument("-u", "--unsubscribe", type=int, help="The unsubscription rate per second")
    parser.add_argument("--random-purchase", help="Purchase from the shop randomly?", action="store_true")
    args = parser.parse_args()


    loop = asyncio.get_event_loop()
    
    if args.subscribe:
        repeat_call(loop, subscribe, args.subscribe, args.endpoint)

    if args.unsubscribe:
        repeat_call(loop, unsubscribe, args.unsubscribe, args.endpoint)
    
    if args.random_purchase:
        repeat_call(loop, purchase, 1.0, args.endpoint)

    def quit():
        loop.stop()
        sys.stderr.write("\nExiting client.\n")
        sys.exit(0)

    loop.add_signal_handler(signal.SIGINT, quit)

    loop.run_forever()
    loop.close()