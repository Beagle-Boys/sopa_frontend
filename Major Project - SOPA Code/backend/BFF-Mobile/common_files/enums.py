from enum import Enum
from common_files.constants import AUTH_SERVICE


class Code(object):
    """
    enum code to every custom errors used for SOPA APP.
     1xxx - User registration and Login
     2xxx - Request Errors
     3xxx - Mobile Processes
     4xxx - Spot Errors
     5xxx - DB Errors
     6xxx - Reservation Errors
     7xxx - Transaction Errors
    """
    error_enum = {
        1001: "User Already Exists",
        1002: "Wrong Password or Email",
        1003: "User Not Found",
        1004: "Oops! Unexpected error occurred",
        1005: "User is Locked ! Contact Admin",
        2001: "Invalid Request",
        2002: "Inavlid Image Ids",
        3001: "App Issue",
        4001: "Invalid Spot ID",
        4002: "Spot Already Bookmarked",
        4003: "Spot not bookmarked",
        4004: "Failed updating bookmark",
        4005: "Spot Search Query needs more characters",
        6001: "Invalid Timeslot",
        6002: "Timeslot Already Booked",
        6003: "Failed creating reservation",
        6004: "Invalid reservation request, Add Amount",
        5001: "Failed updating userdata",
        7001: "Failed initiating transaction",
        7002: "Failed updating transaction",
        7003: "Incorrect payment details",
        7004: "Failed completing transaction",
        7005: "Incorrect order ID",
    }

    product_tags = {
        AUTH_SERVICE: "auth"
    }

    @staticmethod
    def sopa_error_enum(code):
        return Code.error_enum[code]

    @staticmethod
    def product_key(code):
        return Code.product_tags[code]


class SpotTypeEnum(str, Enum):
    PUBLIC = "PUBLIC"
    PRIVATE = "PRIVATE"


class UserTypeEnum(str, Enum):
    PREMIUM = "PREMIUM"
    COMMON = "COMMON"


class ReservationStatusEnum(str, Enum):
    PENDING = "PENDING"
    AWAITING_PAYMENT = "AWAITING_PAYMENT"
    APPROVED = "APPROVED"
    DENIED = "DENIED"


class ReservationResponseEnum(str, Enum):
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"