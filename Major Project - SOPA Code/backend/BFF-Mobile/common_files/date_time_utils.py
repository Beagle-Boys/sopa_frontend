from datetime import datetime

def current_date(year: bool, month: bool, timestamp: bool):
    now = datetime.now()
    if year:
        return str(now.year)
    elif month:
        if now.month < 10:
            _month = "0" + str(now.month)
        else:
            _month = str(now.month)
        return _month
    elif timestamp:
        return str(now)


def sopa_date_format(timestamp, today: bool):
    if today:
        return current_date(True, False, False)[-2:] + current_date(False, True, False)
    if timestamp:
        date = timestamp.split(" ")[0]
        date_split = date.split("-")
        return date_split[0][-2:] + date_split[1]


def delta_time_days(input_timestamp, comparing_timestamp, delta_type: str):
    """
    :param input_timestamp:
    :param comparing_timestamp:
    :param delta_type: "D" for days and "H" for Hours
    :return:
    """
    datetime_object1 = datetime.fromisoformat(input_timestamp)
    datetime_object2 = datetime.fromisoformat(comparing_timestamp)
    delta_days = datetime_object1 - datetime_object2
    if delta_type.upper() == "D":
        return delta_days
    elif delta_type.upper() == "H":
        return divmod(delta_days.total_seconds(), 60)[0] // 60


def epoch_to_friday(epoch, today=False):
    timestamp = epoch_to_datetime(epoch)
    return sopa_date_format(timestamp, False)


def epoch_to_datetime(epoch):
    epoch = epoch / 1000
    return datetime.fromtimestamp(epoch).strftime("%Y-%m-%d %H:%M:%S")