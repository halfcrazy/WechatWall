#!/usr/bin/env python
# -*- coding: utf-8 -*-

import random
import json


def object_to_json(obj):
    """Transform  object to json"""
    return json.dumps(obj.__dict__)


def generate_name():
    """Generate random nickname for those who does'n specified nickname"""
    word = [u"甲", u"乙", u"丙", u"丁", u"戊", u"己", u"庚", u"辛", u"壬", u"癸", u"子", u"丑", u"寅", u"卯", u"辰", u"巳", u"午", u"未", u"申", u"酉", u"戌", u"亥"]
    return "".join(random.sample(word, 6))


def datetime2timestamp(dt_obj):
    from datetime import datetime
    import time
    time_tuple = dt_obj.timetuple()
    ts = time.mktime(time_tuple)
    return ts


def pretty_date(time=False):
    """
    Get a datetime object or a int() Epoch timestamp and return a
    pretty string like 'an hour ago', 'Yesterday', '3 months ago',
    'just now', etc
    """
    from datetime import datetime
    now = datetime.now()

    if type(time) is int or type(time) is float:
        diff = now - datetime.fromtimestamp(time)
    elif isinstance(time, datetime):
        diff = now - time
    elif not time:
        diff = now - now
    second_diff = diff.seconds
    day_diff = diff.days

    if day_diff < 0:
        return ''

    if day_diff == 0:
        if second_diff < 10:
            return "just now"
        if second_diff < 60:
            return str(second_diff) + " seconds ago"
        if second_diff < 120:
            return "a minute ago"
        if second_diff < 3600:
            return str(second_diff / 60) + " minutes ago"
        if second_diff < 7200:
            return "an hour ago"
        if second_diff < 86400:
            return str(second_diff / 3600) + " hours ago"
    if day_diff == 1:
        return "Yesterday"
    if day_diff < 7:
        return str(day_diff) + " days ago"
    if day_diff < 31:
        return str(day_diff / 7) + " weeks ago"
    if day_diff < 365:
        return str(day_diff / 30) + " months ago"
    return str(day_diff / 365) + " years ago"
