import logging

logger = logging.getLogger('[MOBILE-BFF]')
logger.setLevel(logging.DEBUG)
channel = logging.StreamHandler()
channel.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
channel.setFormatter(formatter)
logger.addHandler(channel)
